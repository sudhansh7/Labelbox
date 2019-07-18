LOCAL_IMAGE := coco
OUTPUT_DEST := $(shell pwd)/output

build:
	docker build \
	-t ${LOCAL_IMAGE} .

run-local-export: $(info EXPORT SAVE DESTINATION is $(OUTPUT_DEST)) build
	docker run -it --rm -v ${OUTPUT_DEST}:/output -v $(EXPORT_PATH):/input ${LOCAL_IMAGE}