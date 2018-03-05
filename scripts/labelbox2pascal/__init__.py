import os
import json
import logging
from shapely import wkt
import requests
from PIL import Image
from pascal_voc_writer import Writer as PascalWriter


def from_json(labeled_data, ann_output_dir, images_output_dir):
    """Convert Labelbox JSON export to Pascal VOC format.

    Args:
        labeled_data (str): File path to Labelbox JSON export of label data.
        ann_output_dir (str): File path of directory to write Pascal VOC
            annotation files.
        images_output_dir (str): File path of directory to write images.

    Todo:
        * Add functionality to allow use of local copy of an image instead of
            downloading it each time.
    """

    # make sure annotation output directory is valid
    try:
        ann_output_dir = os.path.abspath(ann_output_dir)
        assert os.path.isdir(ann_output_dir)
    except AssertionError as e:
        logging.exception('Annotation output directory does not exist')
        return None

    # read labelbox JSON output
    with open(labeled_data, 'r') as f:
        lines = f.readlines()
        label_data = json.loads(lines[0])

    for data in label_data:
        # Download image and save it
        try:
            response = requests.get(data['Labeled Data'], stream=True)
        except requests.exceptions.MissingSchema as e:
            logging.exception(('"Labeled Data" field must be a URL. '
                              'Support for local files coming soon'))
            continue
        except requests.exceptions.ConnectionError as e:
            logging.exception('Failed to fetch image from {}'
                              .format(data['Labeled Data']))
            continue
        response.raw.decode_content = True
        im = Image.open(response.raw)
        image_name = ('{img_id}.{ext}'
                      .format(img_id=data['ID'], ext=im.format.lower()))
        image_fqn = os.path.join(images_output_dir, image_name)
        im.save(image_fqn, format=im.format)

        # generate image annotation in Pascal VOC
        width, height = im.size
        xml_writer = PascalWriter(image_fqn, width, height)

        # convert WKT multipolygon to Pascal VOC format
        for cat in data['Label'].keys():

            multipolygon = wkt.loads(data['Label'][cat])
            for m in multipolygon:
                xy_coords = []
                for x, y in m.exterior.coords:
                    xy_coords.extend([x, height-y])
                # remove last polygon if it is identical to first point
                if xy_coords[-2:] == xy_coords[:2]:
                    xy_coords = xy_coords[:-2]
                xml_writer.addObject(name=cat, xy_coords=xy_coords)

        # write Pascal VOC xml annotation for image
        xml_writer.save(os.path.join(ann_output_dir,
                                     '{}.xml'.format(data['ID'])))
