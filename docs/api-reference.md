# API Reference

* [Labelbox.currentAsset()](#labelboxcurrentasset)
* [Labelbox.enablePreloading()](#labelboxenablepreloading)
* [Labelbox.setLabelForAsset()](#labelboxsetlabelforasset)
* [Labelbox.fetchNextAsset()](#labelboxfetchnextasset)
* [Labelbox.setLabelAsCurrentAsset()](#labelboxsetlabelascurrentasset)
* [Labelbox.skip()](#labelboxskip)
* [Labelbox.getTemplateCustomization()](#labelboxgettemplatecustomization)

## Labelbox.currentAsset

**Overview:**

This function returns a stream of information about the currently viewed asset on the screen. Its important to have all your drawing logic behind this function so that Labelbox can tell your frontend about which asset to render.

For example, if the user opened your interface form an existing label this function would recieve the data about that asset but also its label information.

**Example:**

```javascript
const subscription = Labelbox.currentAsset().subscribe((asset) => {
  // Asset can be undefined
  if (!asset){
    return;
  }

  console.log(asset.id); // The labelbox id for this asset
  console.log(asset.data); // This is whatever data you imported into labelbox (E.X. your image url)
  console.log(asset.dataRowId); // Labelbox's ID for this asset
  console.log(asset.label); // Undefined if the asset hasn't been labeled or whatever label you've submitted
  console.log(asset.previous); // The previous assetId in the queue (see setLabelAsCurrentAsset)
  console.log(asset.next); // The next assetId in the queu (see setLabelAsCurrentAsset)
  console.log(asset.createdAt); // Datetime for when this asset was created
  console.log(asset.createdBy); // Email for who created the label
  console.log(asset.typeName); // Labelbox has Label Schemas to improve reporting. This can either be Any or Skip at the moment
})

// If you want to stop recieving updates.
// However, I would recommend having a single subscription for your entire application.
subscription.unsubscribe();
```

Note: This .subscribe will get called anytime any field on the asset changes. Its important your code can handle multiple emissions of the same asset. For example `asset.data` might emit and then a second later the same `asset.data` might emit but `asset.previous` has changed.

## Labelbox.enablePreloading

**Overview:**

Labelbox automatically preloads a labeling queue. However, you can improve the loading speed of labels by giving Labelbox a function to run on each preloaded asset. The preloading function must return a promise.

In the example below we preload images in the dom before the user sees the asset so that it will be cached by the time the user reaches that asset.

**Example:**

```javascript
const preloadFunction = (asset: Asset) => {
  const loadImageInDom = (url: string) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = url;
      img.onload = () => {
        img.remove();
        resolve();
      };
      img.style.display = 'none',
      img.style.width = '0px',
      img.style.height = '0px',
      document.body.appendChild(img);
    });
  }
  return loadImageInDom(asset.data);
}

Labelbox.enablePreloading({preloadFunction})
```

## Labelbox.setLabelForAsset

**Overview**

This function takes a string (JSON.stringify(myJsonLabel)** and will return a promise for when the label has been saved.

**Example**

```javascript
Labelbox.setLabelForAsset('good').then(() => console.log('Success!'));
```

## Labelbox.fetchNextAsset

**Overview**

This function will set the currentAsset to be the next unlabeled asset. For example after submitting a label if you want to advance to the next unlabeled asset you can run this method and then Labelbox.currentAsset(** will emit the new asset as soon as its fetched.

**Example**

```javascript
function label(label){
  Labelbox.setLabelForAsset(label).then(() => {
    Labelbox.fetchNextAssetToLabel();
  });
}
```

## Labelbox.setLabelAsCurrentAsset

**Overview**

Labelbox will automatically emit currentAssets when a user performs some action, such as jumping through the review screen. However, if you would like to add a button to go back to a previous asset you can use this method.

**Example**

```javascript
function goBack(){
  Labelbox.setLabelAsCurrentAsset(asset.previous)
}
```

## Labelbox.skip

**Overview**

Labelbox.skip() is identical to setLabelForAsset('Skip', 'Skip'). The Label that will be seen in your export will be "Skip**

**Example**

```javascript
Labelbox.skip().then(() => console.log('Skipped!'))
```

## Labelbox.getTemplateCustomization

**Overview**

If you decide you want your template to be customizable you can use this method to recieve the customization. Customization always comes in as JSON, but may not be supported by your template. Make sure to add some error handeling here.

**Example**

```javascript
// Your template is want customization JSON that looks like this...
{
  "instructions":"Label This",
  "tools": [{"name": "Tool one"}]
}

// You can use this function like so...

Labelbox.getTemplateCustomization().subscribe((customization) => {
  if (customization.instructions && customization.tools) {
     updateTemplateWithCustomization(customization);
  }
})
```

Its worth noting that this customization will also be provided everytime your template loads and not just when a user is configuring it.
