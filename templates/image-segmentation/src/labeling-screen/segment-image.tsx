import * as React from 'react';
/* import { LinearProgress } from 'material-ui/Progress';*/
/* import Icon from 'material-ui/Icon';*/
import { Map, ImageOverlay, FeatureGroup, Circle } from 'react-leaflet';
import { CRS } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';

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
      <ImageOverlay url={imageUrl} bounds={[[0, 0], [height, width]]} />
      <FeatureGroup>
        <EditControl
          position="topright"
          // tslint:disable-next-line
          onEdited={() => console.log('woot')}
          // tslint:disable-next-line
          onCreated={() => console.log('woot')}
          // tslint:disable-next-line
          onDeleted={() => console.log('woot')}
          draw={{rectangle: false}}
        />
        <Circle center={[0, 0]} radius={10} />
      </FeatureGroup>

    </Map>
  );
}
