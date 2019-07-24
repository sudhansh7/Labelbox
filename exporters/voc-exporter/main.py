import argparse
import json
import os
import logging
import traceback as tb

import voc_exporter

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger(__name__)

def export(file_input, file_output, image_output):
    "Uses VOC exporter function from_json to convert labelbox JSON into MS VOC format."

    try:
        os.makedirs(file_output, exist_ok=True)
        os.makedirs(image_output, exist_ok=True)
        LOGGER.info('Creating voc export')

        voc_exporter.from_json(file_input, file_output, image_output)

        LOGGER.info('Done saving voc export')

    except Exception as e:
        tb.print_exc()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('file_input', help='File path to Labelbox JSON to parse export')
    parser.add_argument('file_output', help='File path to desired output directory for export asset')

    args = parser.parse_args()

    file_input = args.file_input
    assert file_input

    file_output = args.file_output
    assert file_output

    image_output = file_output + '/images'

    export(file_input, file_output, image_output)