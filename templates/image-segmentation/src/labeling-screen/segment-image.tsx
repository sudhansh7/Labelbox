// tslint:disable
import * as React from 'react';
/* import { LinearProgress } from 'material-ui/Progress';*/
/* import Icon from 'material-ui/Icon';*/
import {
  Map,
  ImageOverlay,
  FeatureGroup,
  Polygon,
  /* Polyline,*/
  Rectangle
} from 'react-leaflet';
import { CRS, latLngBounds } from 'leaflet';
import { EditControl, } from 'react-leaflet-draw';

export type ToolNames = 'polygon' | 'rectangle' | 'line' | undefined;
interface Props {
  imageUrl: string;
  imageSize: {width: number, height: number};
  drawColor: string;
  annotations: {
    [key: string]: {
      color: string;
      bounds: {x: number, y: number}[];
    }[]
  };
  onNewAnnotation: (anotation: {x: number, y: number}[]) => void;
  selectedTool: ToolNames;
}

function setTool(toolName: ToolNames) {
  const toolbar = document.querySelector('.leaflet-draw.leaflet-control');
  const toolSelector = {
    'cancel': '.leaflet-draw-actions a[title="Cancel drawing"]',
    'line': '.leaflet-draw-draw-polyline',
    'polygon': '.leaflet-draw-draw-polygon',
    'rectangle': '.leaflet-draw-draw-rectangle',
  }[toolName || 'cancel'];

  if (toolbar) {
    const tool: HTMLElement | null = toolbar.querySelector(toolSelector);
    if (tool) {
      tool.click();
    }
  }
}

const toPixelLocation = ({lat, lng}: {lat: number, lng: number}) => {
  return {y: lat, x: lng};
};

const toLatLngLocation = ({x, y}: {x: number, y: number}) => {
  return {lat: y, lng: x};
};

// TODO make this a function again
export class SegmentImage extends React.Component {
  public props: Props;

  componentDidMount() {
    const toolbar = document.querySelector('.leaflet-draw.leaflet-control');
    // tslint:disable-next-line
    console.log(toolbar);
  }

  render() {
    const {
      imageUrl,
      imageSize: {width, height},
      drawColor,
      selectedTool,
      onNewAnnotation
    } = this.props;

    // tslint:disable-next-line
    console.log(this.props.annotations);

    // tslint:disable-next-line
    const onCreate = (e: any) => {
      onNewAnnotation(e.layer.getLatLngs()[0].map(toPixelLocation));
      // In order to keep this pure
      // I'm removing the drawn shape and letting it get updated via props
      e.layer.remove();
    };

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
            // tslint:disable-next-line
            ref={() => setTool(selectedTool)}
            position="topright"
            // tslint:disable-next-line
            onEdited={() => console.log('woot')}
            // tslint:disable-next-line
            onCreated={onCreate}
            // tslint:disable-next-line
            onDeleted={() => console.log('woot')}
            draw={{
              circle: false,
              marker: false,
              circlemarker: false,
              polygon: {
                shapeOptions: {
                  color: drawColor
                }
              },
              rectangle: {
                shapeOptions: {
                  color: drawColor
                }
              }
            }}
          />
        </FeatureGroup>
        {this.props.annotations.polygon &&  this.props.annotations.polygon.map(({color, bounds}, index) => (
          <Polygon key={index} positions={bounds.map(toLatLngLocation)} color={color} />
        ))}
        {this.props.annotations.rectangle &&  this.props.annotations.rectangle.map(({color, bounds}, index) => (
          <Rectangle key={index} bounds={latLngBounds(bounds.map(toLatLngLocation))} color={color} />
        ))}
      </Map>
    );
  }
}
