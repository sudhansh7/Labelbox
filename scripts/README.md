# Labelbox Scripts
### Labelbox JSON to COCO
__Dependencies__  
  - [Pillow](https://github.com/python-pillow/Pillow)
  - [requests](https://github.com/requests/requests)
  - [Shapely](https://github.com/Toblerity/Shapely)   
  
__Quick Start__ 
```python
# import labelbox2coco library
import labelbox2coco as lb2co

# set labeled_data to the file path of the Labelbox JSON export
labeled_data = 'fixtures/labelbox2coco_1.json'

# set coco_output to the file name you want the COCO data to be written to
coco_output = 'lb2co-1.json'

# call the Labelbox to COCO conversion
lb2co.from_json(labeled_data=labeled_data, coco_output=coco_output)
```
