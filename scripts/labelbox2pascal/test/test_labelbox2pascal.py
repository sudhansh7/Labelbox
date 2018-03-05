import os
import labelbox2pascal as lb2pa


def test_from_json():
    if not os.path.isdir('test-results'):
        os.makedirs('test-results')

    # test 1
    lb2pa.from_json('test-fixtures/labelbox_1.json', 'test-results',
                    'test-results')

    # test 2
    lb2pa.from_json('test-fixtures/labelbox_2.json', 'test-results',
                    'test-results')
