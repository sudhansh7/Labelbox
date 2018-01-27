import * as React from 'react';
/* import { LinearProgress } from 'material-ui/Progress';*/
/* import Icon from 'material-ui/Icon';*/
import { Map, Marker, Popup } from 'react-leaflet';
import { CRS } from 'leaflet';

interface Props {
  imageUrl: string;
  imageSize: {width: number, height: number};
  showPolygonTool: boolean;
  showRectangleTool: boolean;
  updateLabel: (label: string) => void;
  drawColor: string;
  onNewAnnotation: (anotation: {x: number, y: number}[]) => void;
}

export function SegmentImage ({imageUrl, imageSize: {width, height}}: Props) {
  const position = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13
  };

  // tslint:disable-next-line
  console.log('render this image', imageUrl, width, height);

  return (
    <Map zoom={position.zoom} crs={CRS.Simple} bounds={[[0, 0], [height, width]]}>
      <Marker position={position}>
        <Popup>
          <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
        </Popup>
      </Marker>
    </Map>
  );
}
