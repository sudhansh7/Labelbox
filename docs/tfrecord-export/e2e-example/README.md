# E2E Tensorflow Example

This code demonstrates how to use a TFRecords export from Labelbox in a Tensorflow image segmentation model.
By leveraging Tensorflow's [Datasets API](https://www.tensorflow.org/versions/r1.8/api_guides/python/input_dataset),
the end-to-end example is able to read its inputs directly from cloud storage.

## Walkthrough

This example was developed on Python 3.5.2.

### Setting up

#### Configuring Google Cloud SDK application default credentials

TFRecord exports are hosted on Google Cloud Storage. To directly ingest them
from a Tensorflow Dataset Input Pipeline, Google Cloud SDK application default
credentials need to be configured.

Install the Google Cloud SDK by [following these
instructions](https://cloud.google.com/sdk/install) and acquire [Application
Default
Credentials](https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login)
by running:
```bash
gcloud auth application-default login
```

#### Python dependencies

Install Python dependencies:
```bash
pip install -r requirements.txt
```

NOTE: See [this issue](https://github.com/tensorflow/tensorflow/issues/17411)
if you receive an "illegal hardware instruction" error. You may need to
[install Tensorflow from
source](https://www.tensorflow.org/install/install_sources).

### Running the model

```bash
python example.py export.json
```

Monitor the model outputs at [http://localhost:6006/](http://localhost:6006/)

## Files provided

 * TODO
 * TODO

## Model details

TODO: 3 layer CNN with FC layer replaced by another conv (FCN); no pooling => no upsampling



