import React from "react";
import { LinearProgress } from "@material-ui/core";
import { Toolbar } from "./Toolbar";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import blue from "@material-ui/core/colors/blue";

const ImageContainer = styled.div`
  display: flex;
  max-width: 300px;
  max-height: 300px;
  border: 5px solid ${props => (props.selected ? "blue" : "transparent")};
  cursor: pointer;
  :hover {
    opacity: 0.8;
    border: 5px solid blue;
  }
`;

function Image({ src, selected, onClick }) {
  return (
    <ImageContainer selected={selected} onClick={onClick}>
      <img src={src} style={{ maxWidth: "300px", maxHeight: "300px" }}></img>
    </ImageContainer>
  );
}

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

const ConfirmationButton = styled(Button)`
  width: 100px;
`;

const Instructions = styled.div`
  padding: 10px;
`;

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const renderImage = (selectedImages, setSelectedImages) => (data, i) => {
  if (!data || !data.id || !data.imageUrl) {
    return (
      <div>
        Error: invalid image {JSON.stringify(data)} requires id and imageUrl
      </div>
    );
  }
  const toggleImage = () => {
    const foundIndex = selectedImages.indexOf(data.id);
    const newSelectedImages =
      foundIndex > -1
        ? [
            ...selectedImages.splice(0, foundIndex),
            ...selectedImages.splice(foundIndex + 1)
          ]
        : [...selectedImages, data.id];

    setSelectedImages(newSelectedImages);
  };

  return (
    <Image
      src={data.imageUrl}
      id={data.id}
      key={i}
      selected={selectedImages.indexOf(data.id) > -1}
      onClick={toggleImage}
    />
  );
};

function App() {
  const [asset, setAsset] = React.useState(undefined);
  const [selectedImages, setSelectedImages] = React.useState([]);
  window.Labelbox.currentAsset().subscribe(emittedAsset => {
    if (!emittedAsset) {
      return;
    }
    const assetIsNew = !asset || emittedAsset.id !== asset.id;
    const assetHasMoreInfo =
      asset &&
      (asset.previous !== emittedAsset.previous ||
        asset.next !== emittedAsset.next);

    if (assetIsNew || assetHasMoreInfo) {
      try {
        const { selectedImages } = JSON.parse(emittedAsset.label);
        setSelectedImages(selectedImages);
      } catch {
        setSelectedImages([]);
      }
      setAsset(emittedAsset);
    }
  });

  if (!asset) {
    return <LinearProgress />;
  }

  const parsedData = JSON.parse(asset.data);
  if (!parsedData || !parsedData.instructions || !parsedData.images) {
    return (
      <div>
        Error: Input data {asset.data} does not include instructions and images.
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Toolbar
        hasLeft={Boolean(asset.previous)}
        onLeftClick={() =>
          window.Labelbox.setLabelAsCurrentAsset(asset.previous)
        }
        onRightClick={() =>
          asset.next
            ? window.Labelbox.setLabelAsCurrentAsset(asset.next)
            : window.Labelbox.fetchNextAssetToLabel()
        }
      />
      <Instructions>{parsedData.instructions}</Instructions>
      <Images>
        {parsedData.images.map(renderImage(selectedImages, setSelectedImages))}
      </Images>
      <div style={{ padding: "10px" }}>
        <ConfirmationButton
          variant="contained"
          style={{ marginRight: "10px" }}
          onClick={() => window.Labelbox.skip()}
        >
          Skip
        </ConfirmationButton>
        <ConfirmationButton
          color="primary"
          variant="contained"
          onClick={() =>
            window.Labelbox.setLabelForAsset(JSON.stringify({ selectedImages }))
          }
        >
          Submit
        </ConfirmationButton>
      </div>
    </ThemeProvider>
  );
}

export default App;
