import json
import datetime as dt
import logging
from shapely import wkt
import requests
from PIL import Image


def from_json(labeled_data, coco_output):

    # read labelbox JSON output
    with open(labeled_data, 'r') as f:
        # lines = f.readlines()
        # label_data = json.loads(lines[0])
        label_data = json.loads(f.read())

    # setup COCO dataset container and info
    coco = {
        'info': None,
        'images': [],
        'annotations': [],
        'licenses': [],
        'categories': []
    }

    coco['info'] = {
        'year': dt.datetime.now(dt.timezone.utc).year,
        'version': None,
        'description': label_data[0]['Project Name'],
        'contributor': label_data[0]['Created By'],
        'url': 'labelbox.com',
        'date_created': dt.datetime.now(dt.timezone.utc).isoformat()
    }

    for data in label_data:

        # Download and get image name
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
        width, height = im.size

        image = {
            "id": data['ID'],
            "width": width,
            "height": height,
            "file_name": data['Labeled Data'],
            "license": None,
            "flickr_url": data['Labeled Data'],
            "coco_url": data['Labeled Data'],
            "date_captured": None,
        }

        coco['images'].append(image)

        # convert WKT multipolygon to COCO Polygon format
        for category_name, category_instances in data['Label'].items():

            print()
            print("Category : " + category_name)

            try:
                # check if label category exists in 'categories' field
                category_id = [c['id'] for c in coco['categories'] if c['supercategory'] == category_name][0]
            except IndexError:
                category_id = len(coco['categories']) + 1
                category = {
                    'supercategory': category_name,
                    'id': category_id,
                    'name': category_name
                }
                coco['categories'].append(category)

            # print("COCO Categories : ")
            # print(coco['categories'])

            for category_instance in category_instances:

                print("Category Instance : ")
                print(category_instance)

                polygon = category_instance['geometry']
                # print(polygon)
                polygon_obj = wkt.loads(polygon)
                print(polygon_obj)

                # for m in polygon_obj:

                segmentation = []
                for x, y in polygon_obj.exterior.coords:
                    segmentation.extend([x, height - y])

                annotation = {
                    "id": len(coco['annotations']) + 1,
                    "image_id": data['ID'],
                    "category_id": category_id,
                    "segmentation": [segmentation],
                    "area": polygon_obj.area,  # float
                    "bbox": [polygon_obj.bounds[0], polygon_obj.bounds[1],
                             polygon_obj.bounds[2] - polygon_obj.bounds[0],
                             polygon_obj.bounds[3] - polygon_obj.bounds[1]],
                    "iscrowd": 0
                }

                coco['annotations'].append(annotation)

    with open(coco_output, 'w+') as f:
        f.write(json.dumps(coco))
