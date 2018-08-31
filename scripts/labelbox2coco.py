# import labelbox2coco library
import labelbox2coco as lb2co

# set labeled_data to the file path of the Labelbox JSON export
labeled_data = 'C:\Computer Vision\Labelbox\datasets\wireframes\labelbox\labelbox_wireframes.json'

# set coco_output to the file name you want the COCO data to be written to
coco_output = 'C:\Computer Vision\Labelbox\datasets\wireframes\coco\coco_wireframes.json'

# call the Labelbox to COCO conversion
lb2co.from_json(labeled_data=labeled_data, coco_output=coco_output)
