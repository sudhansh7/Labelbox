## Guide

This guide aims to help you get up and running with Tensorflow and Labelbox. 

Hopefully if you're reading this, you've already kicked off a TFRecord export from the exports tab within Labelbox. Once the task completes, you will be able to download an `export.json` file from the "Tasks" dropdown menu in the top menu bar.
Within `export.json` there is a `tfrecord_paths` key which has a value that is an array of paths that point to Google Cloud Storage objects.

### Quick Start With Docker
We've created a docker image with all of the dependencies needed to run tensorflow and consume the `export.json` file that you've downloaded from Labelbox.
The image has everything needed to run `decode_tfrecord_export.py`, a python file that consumes `export.json` and bootstraps tensorflow.

You can run the python script within a docker container by executing the following bash script:
```bash
sh run_decode.sh [path to export.json]
```


### Running locally
In order to be able to pull the TFRecord files from Google Cloud Storage, you will need to have the [Google Cloud SDK](https://cloud.google.com/sdk/) installed and authenticated on your machine. Once the SDK has been installed, you can run
```bash
gcloud auth login
```
to provide your credentials to the SDK. 

##### Installing Google Cloud SDK
Head to [Google Cloud SDK](https://cloud.google.com/sdk/) and follow their installation guide for your specific platform. The guide will go over initializing the SDK, which will be necessary in order for tensorflow to be able to fetch the TFRecord file. 


