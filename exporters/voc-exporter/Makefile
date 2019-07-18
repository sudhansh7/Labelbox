LOCAL_IMAGE := voc
OUTPUT_DEST := $(shell pwd)/output
IMAGE_DEST := $(shell pwd)/images

build:
	docker build \
	-t ${LOCAL_IMAGE} .

run-local-export: $(info EXPORT SAVE DESTINATION is $(OUTPUT_DEST)) $(info IMAGE SAVE DESTINATION is $(IMAGE_DEST)) build
	docker run -it --rm -v ${OUTPUT_DEST}:/output -v $(EXPORT_PATH):/input -v ${IMAGE_DEST}:/images ${LOCAL_IMAGE}