import sys
from json import load
import math
import tensorflow as tf
from tensorflow.contrib import layers
from tensorflow.contrib.data import map_and_batch
from tensorflow.contrib.data import shuffle_and_repeat
from tensorflow.contrib.layers.python.layers import layers as layers_lib
from tensorflow.contrib.layers.python.layers import regularizers
from tensorflow.contrib.layers.python.layers import utils
import tensorflow.contrib.slim as slim
from tensorflow.python.ops import init_ops
from tensorflow.python.ops import nn_ops



tf.logging.set_verbosity(tf.logging.INFO)


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

def _resize(image_dim):
    def _inner(images_orig, labels_orig):
        images = tf.image.resize_images(
                images=images_orig,
                size=[image_dim, image_dim],
                method=tf.image.ResizeMethod.BILINEAR)
        labels = tf.image.resize_images(
                images=labels_orig,
                size=[image_dim, image_dim],
                method=tf.image.ResizeMethod.BILINEAR)
        return (images, labels)
    return _inner

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

    image_dim = 512
    test_set_size = math.ceil(0.20 * len(tfrecord_paths))

    training_dataset = (tf.data.TFRecordDataset(tfrecord_paths)
            .skip(test_set_size)
            .map(_parse_tfrecord)
            .apply(shuffle_and_repeat(50))
            .apply(map_and_batch(_resize(image_dim), 8)))
    test_dataset = (tf.data.TFRecordDataset(tfrecord_paths)
            .take(test_set_size)
            .map(_parse_tfrecord)
            .apply(map_and_batch(_resize(image_dim), test_set_size)))

    training_iterator = training_dataset.make_one_shot_iterator()
    test_iterator = test_dataset.make_initializable_iterator()

    handle = tf.placeholder(tf.string, shape=[])
    iterator = tf.data.Iterator.from_string_handle(
        handle, training_dataset.output_types, training_dataset.output_shapes)
    images, labels = iterator.get_next()

    number_of_classes = len(legend) + 1 # +1 to include background class
    weight_decay = 0.0005
    dropout_keep_prob = tf.placeholder(tf.float32, shape=[])

    # Define the network
    with tf.variable_scope('fcn', values=[images]):
        with slim.arg_scope(
            [layers.conv2d],
            activation_fn=nn_ops.relu,
            weights_regularizer=regularizers.l2_regularizer(weight_decay),
            biases_initializer=init_ops.zeros_initializer()):

            net = layers_lib.repeat(images, 2, layers.conv2d, 64, [3, 3], scope='conv1')
            logits = layers.conv2d( # replace fc layer with conv for FCN
                net,
                number_of_classes, [1, 1],
                activation_fn=None,
                normalizer_fn=None,
                scope='fc2')

    # Flatten logit scores (predictions) for cross entropy computation
    flat_logits = tf.reshape(tensor=logits, shape=(-1, number_of_classes))

    # One-hot encode and flatten label
    labels_one_hot = tf.concat(axis=3, values=[tf.equal(labels, i) for i in range(number_of_classes)])
    flat_labels = tf.reshape(tensor=labels_one_hot, shape=(-1, number_of_classes))

    cross_entropies = tf.nn.softmax_cross_entropy_with_logits_v2(
        logits=flat_logits, labels=tf.stop_gradient(flat_labels))
    cross_entropy_sum = tf.reduce_sum(cross_entropies)
    tf.summary.scalar('cross_entropy_loss', cross_entropy_sum)

    # Tensor to get the final prediction for each pixel
    pred = tf.argmax(logits, dimension=3)

    with tf.name_scope('image_summaries'):
        tf.summary.image('inputs', images)
        print(logits.get_shape())
        tf.summary.image('probabilities', tf.expand_dims(tf.nn.softmax(logits)[:,:,:,1], axis=3))
        tf.summary.image(
            'prediction',
            tf.expand_dims(math.floor(255 / number_of_classes) * tf.cast(pred, tf.uint8), axis=3))

    with tf.variable_scope("optimizer"):
        optimizer = tf.train.AdamOptimizer(learning_rate=0.0001)
        gradients = optimizer.compute_gradients(loss=cross_entropy_sum)

        for grad_var_pair in gradients:
            curr_var = grad_var_pair[1]
            curr_grad = grad_var_pair[0]

            tf.summary.histogram(curr_var.name.replace(':', '_') + '-grad', curr_grad)

        train_step = optimizer.apply_gradients(grads_and_vars=gradients)

    image_summaries = tf.summary.merge_all(scope=r"image_summaries")
    other_summaries = tf.summary.merge_all(scope=r"^((?!image_summaries).)*$")

    train_writer = tf.summary.FileWriter('./logs/train')
    test_writer = tf.summary.FileWriter('./logs/test')

    with tf.Session() as sess:
        tf.global_variables_initializer().run()
        training_handle = sess.run(training_iterator.string_handle())
        test_handle = sess.run(test_iterator.string_handle())

        print('Training started. Run `tensorboard --logdir ./logs` to visualize summaries')

        for i in range(1000):
            summary, _ = sess.run([other_summaries, train_step], feed_dict={
                handle: training_handle,
                dropout_keep_prob: 0.5})
            train_writer.add_summary(summary, i)

            if i % 1 == 0: # evaluate on test set every iteration to generate visualizations
                sess.run(test_iterator.initializer)
                # NOTE: train_step must not be called with `test_handle` feed!
                summary, summary_images = sess.run([other_summaries, image_summaries], feed_dict={
                    handle: test_handle,
                    dropout_keep_prob: 1.0})
                test_writer.add_summary(summary, i)
                test_writer.add_summary(summary_images, i)


