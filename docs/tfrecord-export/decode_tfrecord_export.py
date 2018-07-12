import sys
from json import load
from glob import glob
from PIL import Image
import requests
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

    with tf.name_scope('input'), tf.Session() as sess:
        dataset_iterator = (tf.data.TFRecordDataset([tfrecord_paths])
                .map(lambda example: tf.parse_single_example(
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

                print('Now showing image ID {}'.format(ID))
                Image.fromarray(image, mode=colorspace).show()
                input("Press ENTER to continue...")

                print('Now label for image ID {}'.format(ID))
                # Tensorflow returns a 3D array from `decode_image`, but `Image.fromarray(... mode='L')` needs 2D
                # The 50* scales label intensities to be more visible
                label = label[:,:,0]
                Image.fromarray(50*label, mode='L').show()
                input("Press ENTER to continue...")

        except tf.errors.OutOfRangeError:
            print('Dataset iterator exhausted')
