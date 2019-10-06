## Video Overview

[![Video Tutorial](./video.png)](https://www.loom.com/share/5b53617b027d4ef382d56a8dcc6ca5f1)

## Interface Setup

URL: https://image-selection.labelbox.com

![Interface Setup](./interface.png)

## Interface Input

```
{
  "instructions": "Please select all images that would be appropriate for an athletic mom.",
  "images": [
    {
      "id": "image-one-database-id",
      "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/104836109-p100d-review-5.1910x1000.jpeg"
    },
    {
      "id": "image-two-database-id",
      "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/104836109-p100d-review-5.1910x1000.jpeg"
    }
  ]
}
```

## Interface Label Output

```
{
  "selectedImages": [
    "image-one-database-id",
    "image-two-database-id"
  ]
}
```
