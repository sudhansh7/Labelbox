# Labelbox
Labelbox is the most versatile labeling tool for machine learning. Simply connect your data, choose or customize an open source labeling interface, invite team members and start labeling.

## Benefits of using Labelbox
- Simple Image Labeling: Labelbox makes it really easy to do basic image classification or segmentation tasks. Simply upload a CSV file pointing to the location of your data and choose an image classification or segmentation labeling template to get started

- Label just about anything: Not only are Labelbox templates open source, you can build your own templates using Labelbox.js. Build your own custom labeling template to label any kind of data as long as it can be loaded in a browser

- Manage Teams: Ready for your team, no matter the size. Labelbox streamlines your workflows, from micro labeling projects for quick R&D to production grade projects requiring hundreds of collaborators
- Monitor Performance: Maintain the highest quality standards for your data by keeping track of labeling task performance of individuals and teams

## Overview
All labeling tasks share the theme of "data in labels out". This repo contains a set of highquality labeling frontends to aid in many data labeling projects.

```
           -----------------------
           |                     |
           |                     |
           |                     |
Data -->   |  Labeling Frontend  |   --> Label
           |                     |
           |                     |
           |                     |
           -----------------------
```

Please see [labeling frontend templates](#labeling-frontend-templates) for templates relevant to your labeling task.

Once you've found a template for your job you can either host and manage the data labeling yourself or deploy your frontend to our hosting service at (labelbox.io)[https://www.labelbox.io/].


# Labeling Frontend Templates

## Image Classification

[Code Here](https://github.com/Labelbox/Labelbox/tree/master/templates/image-classification)
![images/classification.png](./images/classification.png)

## Image Segmentation

[Code Here](https://github.com/Labelbox/Labelbox/tree/master/templates/image-segmentation)
![images/segmentation.png](./images/segmentation.png)


# Using labeling-api.js
To develop a Labelbox frontend, import labeling-api.js and use the 2 APIs described below to **Fetch** and **Submit** an individual dataset row. Note that multiple data can be loaded in a single Fetch if a row in CSV file contains an array of data. 

### Attach the Labelbox's client side api.

```html
<script src="https://api.labelbox.io/client/v0.1/labeling-api.js"></script>
```

### Get a row to label

```javascript
Labelbox.fetchNextAssetToLabel().then((dataToLabel) => {
  // ... draw to screen for user to view and label
});
```

### Save the label for a row

```javascript
Labelbox.setLabelForAsset(label); // labels the asset currently on the screen
```

### Full Example
Full Example

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

# Developing Labeling Frontend with Localhost

### Run localhost server 
1. Start the localhost server in a directory containing your labeling frontend files. For example, run the server inside labelingfrontend if you have index.html (labeling frontend) inside it. 
```
python2 -m SimpleHTTPServer
```
2. Copy file path to the main HTML file. Following the example above, it would look like localhost:8000/index.html

3. Paste the path of labeling frontend under Custom Labeling Interface for an existing project. 
![](https://s3-us-west-2.amazonaws.com/labelbox/labelbox_localhost.gif)


# Installing Labeling Frontend in Labelbox.io


