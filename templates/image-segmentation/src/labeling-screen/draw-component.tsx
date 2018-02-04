// tslint:disable
import * as React from 'react';
import { EditControl, } from 'react-leaflet-draw';
import { ToolNames } from './segment-image';

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

const getPointsFromEvent = (e: any) => {
  let points = e.layer.getLatLngs();
  return (Array.isArray(points[0]) ? points[0] : points);
}

interface Props {
  selectedTool: ToolNames | undefined,
  drawColor: string | undefined
  onNewAnnotation: (annotation: {lat: number, lng: number}[]) => void;
  onDrawnAnnotationUpdate: (annotation: {lat: number, lng: number}[]) => void;
}

export class LeafletDraw extends React.Component{
  public props: Props;

  // Since leaflet draw is not pure we need to stop it
  // from rendering unless the props changed
  // (otherwise it removes in progress drawn polygon)
  shouldComponentUpdate(nextProps: Props){
    return this.props.drawColor !== nextProps.drawColor || this.props.selectedTool !== nextProps.selectedTool;
  }

  render(){
    const {
      selectedTool,
      drawColor,
      onNewAnnotation,
      onDrawnAnnotationUpdate,
    } = this.props;

    const vertexDrawn = (vertextEvent: any) => {
      onDrawnAnnotationUpdate(vertextEvent.layers.getLayers().map((layer: any) => layer.getLatLng()));
    }

    // tslint:disable-next-line
    // In order to keep this pure
    // I'm removing the drawn shape and letting it get updated via props
    const onCreate = (e: any) => {
      onNewAnnotation(getPointsFromEvent(e));
      e.layer.remove();
    };

    return (
      <EditControl
        // tslint:disable-next-line
        ref={() => setTool(selectedTool)}
        position="topright"
        // tslint:disable-next-line
        onEdited={(e:any) => console.log('woot')}
        // tslint:disable-next-line
        onCreated={onCreate}
        // tslint:disable-next-line
        onDeleted={() => console.log('woot')}
        onDrawVertex={vertexDrawn}
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
          },
          polyline: {
            shapeOptions: {
              color: drawColor
            }
          }
        }}
      />
    )
  }
}
