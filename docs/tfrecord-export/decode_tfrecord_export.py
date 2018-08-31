import sys
from json import load
from math import floor
import os
from PIL import Image
# import requests
import tensorflow as tf


def fail_for_missing_file():
    print('You must provide the path to export.json file.')
    sys.exit(1)


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

    if not os.path.isdir('./output'):
        os.mkdir('./output')
    with tf.name_scope('input'), tf.Session() as sess:
        dataset_iterator = (tf.data.TFRecordDataset([tfrecord_paths]).map(lambda example: tf.parse_single_example(
                    example,
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
                        }))
                .shuffle(buffer_size=10)
                .make_one_shot_iterator())

        try:
            print('Pixel value to label legend:\n{}'.format(legend))
            while True:
                example = dataset_iterator.get_next()

                ID, image, label, colorspace = sess.run([
                    example['image/ID'],
                    tf.image.decode_image(example['image/encoded']),
                    tf.image.decode_image(example['image/segmentation/class/encoded']),
                    example['image/colorspace']
                    ])
                ID = ID.decode('utf-8')
                colorspace = colorspace.decode('utf-8')

                image_output_path = 'output/{}.jpg'.format(ID)
                print('Writing image for label ID {} to {}'.format(ID, image_output_path))
                Image.fromarray(image, mode=colorspace).save(image_output_path)
                input("Press ENTER to continue...")

                label_output_path = 'output/{}-label.jpg'.format(ID)
                print('Writing label for label ID {} to {}'.format(ID, label_output_path))
                # Tensorflow returns a 3D array from `decode_image`, but `Image.fromarray(... mode='L')` needs 2D
                label = label[:, :, 0]
                # Multiplication to scale labels for increased visibility
                Image.fromarray(floor(255 / len(legend.keys())) * label, mode='L').save(label_output_path)
                input("Press ENTER to continue...")

        except tf.errors.OutOfRangeError:
            print('Dataset iterator exhausted')
