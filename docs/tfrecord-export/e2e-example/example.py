import sys
from json import load
import numpy as np
import requests
import tensorflow as tf
import tensorflow.contrib.slim as slim
import tensorflow.contrib.slim.nets as nets

tf.logging.set_verbosity(tf.logging.INFO)

def get_kernel_size(factor):
    """
    Find the kernel size given the desired factor of upsampling.
    """
    return 2 * factor - factor % 2


def upsample_filt(size):
    """
    Make a 2D bilinear kernel suitable for upsampling of the given (h, w) size.
    """
    factor = (size + 1) // 2
    if size % 2 == 1:
        center = factor - 1
    else:
        center = factor - 0.5
    og = np.ogrid[:size, :size]
    return (1 - abs(og[0] - center) / factor) * \
           (1 - abs(og[1] - center) / factor)


def bilinear_upsample_weights(factor, number_of_classes):
    """
    Create weights matrix for transposed convolution with bilinear filter
    initialization.
    """

    filter_size = get_kernel_size(factor)

    weights = np.zeros((filter_size,
                        filter_size,
                        number_of_classes,
                        number_of_classes), dtype=np.float32)

    upsample_kernel = upsample_filt(filter_size)

    for i in range(number_of_classes):

        weights[:, :, i, i] = upsample_kernel

    return weights

def fail_for_missing_file():
    print('You must provide the path to export.json file.')
    sys.exit(1)

def _parse_tfrecord(serialized_example):
    example = tf.parse_single_example(
        serialized_example,
        features={
            'image/encoded': tf.FixedLenFeature([], tf.string),
            'image/filename': tf.FixedLenFeature([], tf.string),
            'image/ID': tf.FixedLenFeature([], tf.string),
            'image/format': tf.FixedLenFeature([], tf.string),
            'image/height': tf.FixedLenFeature([], tf.int64),
            'image/width': tf.FixedLenFeature([], tf.int64),
            'image/channels': tf.FixedLenFeature([], tf.int64),
            'image/colorspace': tf.FixedLenFeature([], tf.string),
            'image/segmentation/class/encoded': tf.FixedLenFeature([], tf.string),
            'image/segmentation/class/format': tf.FixedLenFeature([], tf.string),
            })
    image = tf.image.decode_image(example['image/encoded'])
    image.set_shape([None, None, 3])
    label = tf.image.decode_image(example['image/segmentation/class/encoded'])
    label.set_shape([None, None, 1])
    image_float = tf.to_float(image)
    label_float = tf.to_float(label)
    return (image_float, label_float)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        fail_for_missing_file()

    export_file = sys.argv[1]

    if not export_file:
        fail_for_missing_file()

    with open(export_file) as f:
        export_json = load(f)

    legend = export_json['legend']
    tfrecord_paths = export_json['tfrecord_paths']

    vgg = nets.vgg

    training_dataset = (tf.data.TFRecordDataset([tfrecord_paths])
            .map(_parse_tfrecord)
            .batch(16))
    iterator = training_dataset.make_one_shot_iterator()

    images_orig, labels_orig = iterator.get_next()
    print(iterator.output_shapes)
    image_dim = vgg.vgg_16.default_image_size * 2
    images = tf.image.resize_images(
            images=images_orig,
            size=[image_dim, image_dim],
            method=tf.image.ResizeMethod.BILINEAR)
    labels = tf.image.resize_images(
            images=labels_orig,
            size=[image_dim, image_dim],
            method=tf.image.ResizeMethod.BILINEAR)

    upsample_factor = 56
    number_of_classes = len(legend) + 1
    upsample_filter = tf.constant(bilinear_upsample_weights(upsample_factor, number_of_classes))

    # Define the network
    with slim.arg_scope(vgg.vgg_arg_scope()):
        logits, end_points= vgg.vgg_16(images, num_classes=3, spatial_squeeze=False)

    print(logits.get_shape())
    print(labels.shape)

    downsampled_logits_shape = tf.shape(logits)

    # Calculate the ouput size of the upsampled tensor
    upsampled_logits_shape = tf.stack([
                                    downsampled_logits_shape[0],
                                    downsampled_logits_shape[1] * upsample_factor,
                                    downsampled_logits_shape[2] * upsample_factor,
                                    downsampled_logits_shape[3]
                                    ])

    # Perform the upsampling
    upsampled_logits = tf.nn.conv2d_transpose(logits, upsample_filter,
                                    output_shape=upsampled_logits_shape,
                                    strides=[1, upsample_factor, upsample_factor, 1])

    # Flatten the predictions so that we can compute cross-entropy
    flat_logits = tf.reshape(tensor=upsampled_logits, shape=(-1, number_of_classes))

    # One-hot encodes and flattens the labels
    labels_one_hot = tf.concat(axis=3, values=[tf.equal(labels, i) for i in range(number_of_classes)])
    flat_labels = tf.reshape(tensor=labels_one_hot, shape=(-1, number_of_classes))

    cross_entropies = tf.nn.softmax_cross_entropy_with_logits(logits=flat_logits,
                                                            labels=flat_labels)

    cross_entropy_sum = tf.reduce_sum(cross_entropies)

    # Tensor to get the final prediction for each pixel -- pay
    # attention that we don't need softmax in this case because
    # we only need the final decision. If we also need the respective
    # probabilities we will have to apply softmax.
    pred = tf.argmax(upsampled_logits, dimension=3)

    probabilities = tf.nn.softmax(upsampled_logits)

    with tf.variable_scope("adam_vars"):
        optimizer = tf.train.AdamOptimizer(learning_rate=0.0001)
        gradients = optimizer.compute_gradients(loss=cross_entropy_sum)

        for grad_var_pair in gradients:
            curr_var = grad_var_pair[1]
            curr_grad = grad_var_pair[0]

            tf.summary.histogram(curr_var.name.replace(":", "_"), curr_grad)
        train_step = optimizer.apply_gradients(grads_and_vars=gradients)

    tf.summary.scalar('cross_entropy_loss', cross_entropy_sum)
    merged_summary_op = tf.summary.merge_all()
    summary_string_writer = tf.summary.FileWriter('./logs')

    weight_init = tf.variables_initializer(slim.get_variables_to_restore(exclude=['adam_vars']))
    adam_init = tf.variables_initializer(slim.get_variables_to_restore(include=['adam_vars']))

    with tf.Session() as sess:
        sess.run(weight_init)
        sess.run(adam_init)

        for i in range(10):
            loss, summary_string = sess.run([cross_entropy_sum, merged_summary_op])
            sess.run(train_step)
            pred_np, probabilities_np = sess.run([pred, probabilities])
            summary_string_writer.add_summary(summary_string, i)

            print("Current Loss: " + str(loss))

