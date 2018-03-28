![](https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/images/header.png)

Table of Contents
=================

   * [Labelbox](#labelbox)
   * [Benefits](#benefits)
   * [Quickstart](#quickstart)
   * [Uploading Datasets](#uploading-datasets)
   * [Labeling Interfaces](#labeling-interfaces)
      * [Image Segmentation](#image-segmentation-interface)
      * [Image Classification](#image-classification-interface)
      * [Text Classification](#text-classification-interface)
   * [Exporting Labels](#exporting-labels)
      * [Segmentation Masks](#segmentation-masks)
      * [COCO format](scripts/README.md)
      * [Pascal VOC format](scripts/README.md)
   * [Creating Custom Labeling Interfaces](#creating-custom-labeling-interfaces)
      * [A Minimal Example](#a-minimal-example)
      * [Labelbox Pluggable Interface Architecture](#labelbox-pluggable-interface-architecture)
      * [Using labeling-api.js](#using-labeling-apijs)
      * [Hello World Example](#hello-world-example)
      * [Full Example](#full-example)
      * [Reference Interfaces](#reference-interfaces)
      * [Local Development of Labeling Interfaces](#local-development-of-labeling-interfaces)
      * [Installing a Labeling Frontend in labelbox.io](#installing-a-labeling-frontend-in-labelboxio)
   * [Request features](#request-features)
   * [Terms of use, privacy and content dispute policy](#terms-of-use-privacy-and-content-dispute-policy)

# Labelbox
[Labelbox](https://www.labelbox.io/) is a data labeling tool that's purpose
built for machine learning applications. Start labeling data in minutes using
pre-made labeling interfaces, or create your own pluggable interface to suit
the needs of your data labeling task. Labelbox is lightweight for single users
or small teams and scales up to support large teams and massive data sets.

![](https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/gifs/Creating+segmentation+project.gif)


## Benefits
- **Simple image labeling**: Labelbox makes it quick and easy to do basic image
  classification or segmentation tasks. To get started, simply upload your data
  or a CSV file containing URLs pointing to your data hosted on a server,
  select a labeling interface, (optional) invite collaborators and start labeling.

- **Label just about anything**: Create a custom labeling interface to meet the
  needs of your labeling task. Start by customizing one of the standard
  Labelbox interfaces or build one from the ground up, just import
  `labeling-api.js` in a script tag. See 
  [Creating Custom Labeling Interfaces](#creating-custom-labeling-interfaces)
  to get started.

- **Manage Teams**: Invite your team members to help with labeling tasks. Labelbox
  streamlines your labeling workflows, from micro labeling projects for quick
  R&D to production grade projects requiring hundreds of collaborators.

- **Measure Performance**: Maintain the highest quality standards for your data by
  keeping track of labeling task performance of individuals and teams.

## Quickstart
1. Sign up on [Labelbox](https://www.labelbox.io)
2. Jump into the example project or create a new one
3. Step through the setup, attach a data set and start labeling
4. Export your labels

## Uploading Datasets
**From your computer:**  
Select your data from your local computer to upload. Your data is uploaded in a
secure cloud bucket and only you have access to it.  
     
**From the cloud:**  
If your data is hosted in the cloud (e.g. Amazon S3), you can point Labelbox
to your data by creating a CSV file with URLs to each file.
[Checkout an example CSV file containing image URLs](./documentation-assets/self-driving-images.csv).  

## Labeling Interfaces
In Labelbox, a labeling interface is used during the image labeling workflow.
There are a few pre-made labeling interfaces available in Labelbox. To configure
a labeling interface for your labeling task, navigate to Settings-\>Labeling
Interface-\>Edit and edit the JSON.  

You can also create and install a completely custom labeling interface to suit
the needs of your labeling task. 
See [Creating Custom Labeling Interfaces](#creating-custom-labeling-interfaces)
to get started.

**Pre-made Labeling Interfaces**
* [Image Segmentation](#image-segmentation-interface)
* [Image Classification](#image-classification-interface)
* [Text Classification](#text-classification-interface)

### Image Segmentation Interface
 The Image Segmentation Interface can be used to segment objects in an image.
 Supported annotation tools are:
 - Rectangle
 - Polygon

For example, let's say we want to configure the labeling interface to segment 2
objects in an image. One object is required to be labeled using a rectangle
tool and the other with a polygon tool. To modify the pre-made Labelbox Image
Segmentation Interface to support this task, edit the segmentation interface
with the JSON snippet below:

```json
{
  "tools": [
    {
      "name": "Car",
      "color": "navy",
      "tool": "polygon"
    },
    {
      "name": "Tree",
      "color": "green",
      "tool": "polygon"
    },
    {
      "name": "Road Sign",
      "color": "orange",
      "tool": "polygon"
    },
    {
      "name": "Person",
      "color": "pink",
      "tool": "rectangle"
    },
    {
      "name": "Corner of Building",
      "color": "red",
      "tool": "point"
    },
        {
      "name": "Lane divider",
      "color": "purple",
      "tool": "line"
    }
  ]
}
```

![](https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/gifs/Editing+Template.gif)


### Image Classification Interface
Classify an image from a set of categories. Classification interface supports single or multi choice forms which can be configured as below:

```json
[
  {
    "name": "model",
    "instructions": "Select the car model",
    "type": "radio",
    "required": true,
    "options": [
      {
        "value": "model_s",
        "label": "Tesla Model S"
      },
      {
        "value": "model_3",
        "label": "Tesla Model 3"
      },
      {
        "value": "model_x",
        "label": "Tesla Model X"
      }
    ]
  },
  {
    "name": "image_problems",
    "instructions": "Select all that apply",
    "type": "checklist",
    "required": false,
    "options": [
      {
        "value": "blur",
        "label": "Blurry"
      },
      {
        "value": "saturated",
        "label": "Over Saturated"
      },
      {
        "value": "pixelated",
        "label": "Pixelated"
      }
    ]
  }
]
```


### Text Classification Interface
Classify text form a set of categories. Categories can be customized in a
fashion similar to the Image Segmentation Interface example above.

## Exporting labels
Labels are exported in CSV or JSON format. For geometic labels (segmentation, key point, etc...) the coordinates are exported in X-Y coordinates or [WKT strings](https://en.wikipedia.org/wiki/Well-known_text). The coordinate origin for geometric labels is the top left point of the image.

For parsing the WKT format, We recommend using python [Shapely](https://pypi.python.org/pypi/Shapely).

```python
from shapely.wkt import loads as wkt_loads
polygon_wkt= wkt_loads(polygon)
```

You can also convert Labelbox output to COCO or Pascal VOC format using our scripts. 
* [COCO format](scripts/README.md)
* [Pascal VOC format](scripts/README.md)

__NOTE__: for 

### Segmentation Masks
Labelbox can also export image masks from labels created using the image
segmentation tools. Using image masks often means less data preparation is
needed to use labels when training machine learning models.

Labelbox generates an image mask per label class (i.e. if there are 2 car and 2
tree labels in an image, 2 image masks in total - a car and a tree - will be
created). White pixels in the image mask represent the object.

![](https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/images/image-masks.png)

## Creating Custom Labeling Interfaces
You can create custom labeling interfaces to suit the needs of your
labeling tasks. All of the pre-made labeling interfaces are open source.

### A Minimal Example
```html
<script src="https://api.labelbox.io/client/v0.1/labeling-api.js"></script>
<div id="form"></div>
<script>
function next(label){
  if (label) {
    Labelbox.setLabelForAsset(label);
  }
  Labelbox.fetchNextAssetToLabel().then(drawItem);
}

function drawItem(dataToLabel){
  const labelForm = `
    <img src="${dataToLabel}" style="width: 300px;"></img>
    <div style="display: flex;">
      <button onclick="next('bad')">Bad Quality</button>
      <button onclick="next('good')">Good Quality</button>
    </div>
  `;
  document.querySelector('#form').innerHTML = labelForm;
}

next();
</script>
```

### Labelbox Pluggable Interface Architecture
Labelbox allows the use of custom labeling interfaces. Custom labeling interfaces
minimally define a labeling ontology and optionally the look and feel of the
labeling interface. A minimal labeling interface imports `labeling-api.js` and
uses the `fetch` and `submit` functions to integrate with Labelbox. While
Labelbox makes it simple to do basic labeling of images and text, there are a
variety of other data types such as point clouds, maps, videos or medical DICOM
imagery that require bespoke labeling interfaces. With this in mind, Labelbox
is designed to facilitate the creation, installation, and maintenance of custom
labeling frontends.

<img src="https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/images/architecture.jpg" width="100%">


### Using `labeling-api.js`
To develop a Labelbox frontend, import `labeling-api.js` and use the 2 APIs
described below to `fetch` the next data and then `submit` the label against the
data. Note that multiple data can be loaded in a single `fetch` if a row in the
CSV file contains an array of data pointers.

__Attach the Labelbox Client Side API__

```html
<script src="https://api.labelbox.io/client/v0.1/labeling-api.js"></script>
```

__Get a row to label__

```javascript
Labelbox.fetchNextAssetToLabel().then((dataToLabel) => {
  // ... draw to screen for user to view and label
});
```

__Save the label for a row__

```javascript
Labelbox.setLabelForAsset(label); // labels the asset currently on the screen
```

### Hello World Example

[Try it in your browser](https://hello-world.labelbox.io)  
(The project must be setup first)

### Full Example
```html
<script src="https://api.labelbox.io/client/v0.1/labeling-api.js"></script>
<div id="form"></div>
<script>
function next(label){
  if (label) {
    Labelbox.setLabelForAsset(label).then(() => {
      Labelbox.fetchNextAssetToLabel().then(drawItem);
    });
  } else {
    Labelbox.fetchNextAssetToLabel().then(drawItem);
  }
}

function drawItem(dataToLabel){
  const labelForm = `
    <img src="${dataToLabel}" style="width: 300px;"></img>
    <div style="display: flex;">
      <button onclick="next('bad')">Bad Quality</button>
      <button onclick="next('good')">Good Quality</button>
    </div>
  `;
  document.querySelector('#form').innerHTML = labelForm;
}

next();
</script>
```


### Reference Interfaces

#### [Image classification interface source code](https://github.com/Labelbox/Labelbox/tree/master/templates/image-classification)
<img src="https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/images/classification.png" width="400">

#### [Image segmentation interface source code](https://github.com/Labelbox/Labelbox/tree/master/templates/image-segmentation)
<img src="https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/images/segmentation.png" width="400">

#### [Text classification interface source code](https://github.com/Labelbox/Labelbox/tree/master/templates/text-classification)
<img src="https://s3-us-west-2.amazonaws.com/labelbox/documentation.assets/images/text-classification.png" width="400">

### Local Development of Labeling Interfaces
Labeling interfaces are developed locally. Once the interface is ready to use,
it is installed in Labelbox by pointing to a hosted version of the interface.

**Run localhost server**
1. Start the localhost server in a directory containing your labeling frontend
   files. For example, run the server inside `templates/hello-world` to run the
   hello world labeling interface locally.
```
python -m SimpleHTTPServer
```

2. Open your browser and navigate to the `localhost` endpoint provided by the
   server.
  
3. Customize the labeling frontend by making changes to `index.html`. Restart the
   server and refresh the browser to see the updates.

![](https://s3-us-west-2.amazonaws.com/labelbox/labelbox_localhost.gif)

### Installing a Labeling Frontend in labelbox.io  
When you are ready to use your custom labeling interface on
[Labelbox](https://www.labelbox.io), upload your `index.html` file to a cloud
service that exposes a URL for Labelbox to fetch the file. If you don't have a
hosting service on-hand, you can quickly get setup with
[Now](https://zeit.co/now) from **Zeit**.

**Custom Interface Hosting Quickstart with [Now](https://zeit.co/now)**
* Create an account at Zeit, download and install Now here: https://zeit.co/download
* With Now installed, navigate to the directory with your labeling interface
  (where your `index.html` is located) and launch Now in your terminal by typing `now`. The
  Now service will provide a link to your hosted labeling interface file.

* Within the *Labeling Interface* menu of the *Settings* tab of your
  Labelbox project, choose *Custom* and paste the link in the *URL to
  labeling frontend* field as shown in the video below.
  
![](https://s3-us-west-2.amazonaws.com/labelbox/labelbox_cloud_deploy.gif)

## Request features
Have a feature request? Need a custom labeling interface built for your labeling task? We can help.  

Create an issue here: https://github.com/Labelbox/Labelbox/issues or contact us at support@labelbox.io

## Terms of use, privacy and content dispute policy
Here is our [terms of service, privacy and content dispute policy](https://www.dropbox.com/s/ph6w2ov4i4v5pf9/Labelbox_Terms_Privacy_Content.pdf?dl=0)
