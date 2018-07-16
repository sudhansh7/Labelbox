#!/usr/bin/env bash

DOCKER_INSTALLED=$(command -v docker)
DOCKER_INSTALL_SITE="https://docs.docker.com/install/"

if ! [ -x "${DOCKER_INSTALLED}" ]; then
  echo "Docker must be installed in order for this script to work properly. Please install it first via ${DOCKER_INSTALL_SITE}" >&2
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: sh run_decode.sh [Path to export.json]"
  exit 1
fi

IMAGE_NAME="labelbox/tfrecord_export"

[ ! -z $(docker images -q ${IMAGE_NAME}:latest) ] || docker pull ${IMAGE_NAME}

EXPORT_FILENAME=$(basename $1)
EXPORT_PATH=$(cd "$(dirname "$1")"; pwd)/$(basename "$1")

docker run \
 --mount src="$(pwd)",target=/root,type=bind \
 --mount src="$EXPORT_PATH",target="/root/$EXPORT_FILENAME",type=bind \
 --rm \
 -it \
 ${IMAGE_NAME} \
 python3 decode_tfrecord_export.py $EXPORT_FILENAME


