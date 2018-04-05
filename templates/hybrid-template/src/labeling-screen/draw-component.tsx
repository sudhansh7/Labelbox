// tslint:disable
import * as React from 'react';
import { EditControl, } from 'react-leaflet-draw';
import { ToolType } from './segment-image';
import { getPointIcon } from './get-point-icon';

function setTool(toolName: ToolType) {
  const toolbar = document.querySelector('.leaflet-draw.leaflet-control');
  const toolSelector = {
    'cancel': '.leaflet-draw-actions a[title="Cancel drawing"]',
    'line': '.leaflet-draw-draw-polyline',
    'polygon': '.leaflet-draw-draw-polygon',
    // Default Rectangle is shit. So we just use polygon tool
    // and draw the hover rectangle ourself
    'rectangle': '.leaflet-draw-draw-polygon',
    'point': '.leaflet-draw-draw-marker',
  }[toolName || 'cancel'];

  if (toolbar) {
    const tool: HTMLElement | null = toolbar.querySelector(toolSelector);
    if (tool) {
      tool.click();
    }
  }
}

interface LeafletAnnotationUpdateEvent {
  layer: {
    getLatLngs?: () => {lat: number, lng: number}[],
    getLatLng: () => {lat: number, lng: number},
  }
}

export const getPointsFromEvent = (e: LeafletAnnotationUpdateEvent) => {
  let points = e.layer.getLatLngs ? e.layer.getLatLngs() : e.layer.getLatLng();
  return (Array.isArray(points[0]) ? points[0] : points);
}

interface Props {
  selectedTool: ToolType | undefined,
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
      onDrawnAnnotationUpdate(vertextEvent.layers.getLayers().map((layer: any) => {
        return layer.getLatLng()
      }));
    }


    const onCreate = (e: any) => {
      onNewAnnotation(getPointsFromEvent(e));
      // I know what your thinking...
      // we just created this annotation why are we deleteing it?
      // worry not young jedi. In order to keep this pure
      // I.E. state will rendering annotations not user events
      // I'm removing the drawn shape and letting it get drawn via props
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
          marker: {
            icon: getPointIcon(drawColor || 'grey'),
          },
          circlemarker: false,
          polygon: {
            shapeOptions: {
              color: drawColor,
              opacity: selectedTool === "rectangle" ? 0 : 1,
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
