## Video Overview

[![Video Tutorial](./video.png)](https://www.loom.com/share/5b53617b027d4ef382d56a8dcc6ca5f1)

## Interface Setup

URL: https://image-selection.labelbox.com

![Interface Setup](./interface.png)

## Interface Input

```
{
  "instructions": "Which cars do you like the most?",
  "instructionImageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/2016-Tesla-Model-X-75d-side-profile.jpg",
  "images": [
    {
      "id": "example-id-1",
      "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/2012_tesla_model-s_sedan_signature-performance_rq_oem_2_1280.jpg"
    },
    {
      "id": "example-id-2",
      "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/2014_tesla_model-s_sedan_p85_rq_oem_1_1280.jpg"
    },
    {
      "id": "example-id-3",
      "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/2016-Tesla-Model-S-P90D-front-three-quarter.jpg"
    },
  ]
}
```

The field "instructionsImageUrl" is optional.

## Interface Label Output

```
{
  "selectedImages": [
    "image-one-database-id",
    "image-two-database-id"
  ]
}
```
