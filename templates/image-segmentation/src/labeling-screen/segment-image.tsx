import * as React from 'react';
/* import { LinearProgress } from 'material-ui/Progress';*/
/* import Icon from 'material-ui/Icon';*/
import { Map, ImageOverlay } from 'react-leaflet';
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

  // tslint:disable-next-line
  console.log('render th s image', imageUrl, width, height);

  // TODO improve zooming
  return (
    <Map
      crs={CRS.Simple}
      bounds={[[0, 0], [height, width]]}
      maxZoom={100}
      minZoom={-4}
      zoomControl={false}
    >
      <ImageOverlay url={imageUrl} bounds={[[0, 0], [height, width]]}/>
    </Map>
  );
}
