import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Toolbar } from "./components/Toolbar";
import Image from './components/Image';
import JsonUtils from './utils/Json.utils';

const SECTION_PADDING = '10px';
const MAX_BUTTONS_WRAPPER_WIDTH = '240px';

const ButtonsWrapper = styled.div`
  float: right;

  button + button {
    margin-left: 10px;
  }
`;

const TopWrapper = styled.div`
  padding: ${SECTION_PADDING};
  > * {
    display: inline-block;
    vertical-align: top;
  }

  div.instructions {
    max-width: calc(100% - ${MAX_BUTTONS_WRAPPER_WIDTH})
  }

  div.image-wrapper {
    margin-top: 10px;
  }
`;

const ImagesWrapper = styled.div`
  padding: 5px;
  border-top: ${props => props.hasReferenceImage ? '1px solid lightgray' : 'none'};

  div.image-wrapper {
    margin: 5px;
    display: inline-block;
    vertical-align: top;
  }
`;



const renderImages = ({
  images,
  selectedImages,
  toggle,
  isReview,
}) => {

  return images.map(imageData => {
    if(!imageData || !imageData.externalId || !imageData.imageUrl) return (
      <div>
        Error: invalid image {JSON.stringify(imageData)} requires id and imageUrl
      </div>
    );

    const selected = selectedImages.some(({ externalId }) => imageData.externalId === externalId);

    return (
      <Image
        pointer={!isReview}
        key={imageData.externalId}
        id={imageData.externalId}
        alt={imageData.externalId}
        src={imageData.imageUrl}
        onClick={() => isReview ? null : toggle(imageData)}
        selected={selected}
      />
    )
  })
};

const mountOutput = (selectedImages, parsedData) => {
  const output = {
    label: selectedImages,
  }
  
  if(parsedData.externalId) output.externalId = parsedData.externalId;
  if(parsedData.referenceImage) output.referenceImage = parsedData.referenceImage;
  
  return JsonUtils.ds(selectedImages);
  
}

const App = () => {

  const [asset, setAsset] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isReview, setIsReview] = useState(false);

  useEffect(() => {
    if(window.top !== window.self) setIsReview(true);
  }, []);
  
  useEffect(() => {
    const _handleNewAsset = emittedAsset => {
      if (!emittedAsset) return;
      
      const assetIsNew = !asset || emittedAsset.id !== asset.id;
      const assetHasMoreInfo = 
      asset
      && (
        asset.previous !== emittedAsset.previous
        || asset.next !== emittedAsset.next
      );
      
      if (assetIsNew || assetHasMoreInfo) {
        try {
          let { label } = emittedAsset;
          setSelectedImages(JsonUtils.dp(label));
        } catch(err) {
          setSelectedImages([]);
        }
        setAsset(emittedAsset);
      }
    };

    const subscription = window.Labelbox.currentAsset().subscribe(_handleNewAsset);
    return () => subscription.unsubscribe();
  }, [asset])


  const toggle = imageData => {

    let newSelectedImages = [...selectedImages];

    // if image isn't selected
    if(!selectedImages.some(({ externalId }) => externalId === imageData.externalId)) {
      newSelectedImages.push(imageData);  
    }
    else {
      const index = selectedImages.findIndex(({ externalId }) => externalId === imageData.externalId);
      newSelectedImages.splice(index, 1);
    }
    
    setSelectedImages(newSelectedImages);
  };
  
  
  if (!asset) {
    return <LinearProgress />;
  }
  
  const parsedData = JSON.parse(asset.data);
  if (!parsedData || !parsedData.instructions || !parsedData.data) {
    return (
      <div>
        Error: Input data {asset.data} does not include instructions and data fields.
      </div>
    );
  }

  

  const isEditing = !!asset.createdAt;

  return (
    <>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

      <Toolbar
        hasRight
        hasLeft={!!asset.previous}
        onLeftClick={() => window.Labelbox.setLabelAsCurrentAsset(asset.previous)}
        onRightClick={() =>
          asset.next
            ? window.Labelbox.setLabelAsCurrentAsset(asset.next)
            : window.Labelbox.fetchNextAssetToLabel()
        }
      />

      <TopWrapper>
        <div className='instructions'>
          <div dangerouslySetInnerHTML={{ __html: parsedData.instructions }} />
          {
            parsedData.referenceImage &&
            <Image
              id='reference-image'
              alt='reference image'
              src={parsedData.referenceImage}
            />
          }
        </div>

        <ButtonsWrapper>

          <Button
            id="skip"
            disabled={isReview}
            variant="contained"
            onClick={() => {
              window.Labelbox.skip().then(() => {
                toast('Skipped');
                if (!asset.label) window.Labelbox.fetchNextAssetToLabel();
              })
            }}
          >
            Skip
          </Button>

          <Button
            id="submit"
            color="primary"
            disabled={isReview}
            variant="contained"
            onClick={() => 
              window.Labelbox.setLabelForAsset(mountOutput(selectedImages, parsedData))
              .then(() => {
                if (!asset.label) window.Labelbox.fetchNextAssetToLabel();
                toast(isEditing ? 'Saved' : 'Submitted');
              })
            }
          >
            {isEditing ? 'Save' : 'Submit'}
          </Button>

        </ButtonsWrapper>
        
      </TopWrapper>

      <ImagesWrapper hasReferenceImage={!!parsedData.referenceImage}>
        {renderImages({
          toggle,
          selectedImages,
          images: parsedData.data,
          isReview,
        })}
      </ImagesWrapper>

    </>
  );
}

export default App;
