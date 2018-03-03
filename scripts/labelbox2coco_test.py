import os
import labelbox2coco as lb2co


if __name__ == '__main__':
    # test 1
    labeled_data = os.path.abspath('fixtures/labelbox2coco_1.json')
    lb2co.from_json(
        labeled_data=labeled_data,
        coco_output=os.path.abspath('test-results/lb2co-1.json'))

    # test 2
    labeled_data = os.path.abspath('fixtures/labelbox2coco_2.json')
    lb2co.from_json(
        labeled_data=labeled_data,
        coco_output=os.path.abspath('test-results/lb2co-2.json'))
