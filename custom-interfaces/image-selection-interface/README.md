## Video Overview

[![Video Tutorial](./video.png)](https://www.loom.com/share/5b53617b027d4ef382d56a8dcc6ca5f1)

## Interface Setup

URL: https://image-selection.labelbox.com

![Interface Setup](./interface.png)

## Interface Input

```
[{
  "instructions": "Which cars do you like the most?",
  "referenceImage":"https://storage.googleapis.com/labelbox-example-datasets/tesla/104836109-p100d-review-5.1910x1000.jpeg",
  "externalId":"abadsf99w11",
  "data": [{
    "externalId": "ab65d5e99w12",
    "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/104836109-p100d-review-5.1910x1000.jpeg"
  },
  {
    "externalId": "abadsf99w13",
    "imageUrl": "https://storage.googleapis.com/labelbox-example-datasets/tesla/104836109-p100d-review-5.1910x1000.jpeg"
  }]
}]
```

The field `referenceImage` and outer `externalId` is optional.

## Interface Label Output

```
{
  "selectedImages": [
    "image-one-database-id",
    "image-two-database-id"
  ]
}
```
