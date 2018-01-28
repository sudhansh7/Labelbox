// tslint:disable
import * as React from 'react';
/* import { LinearProgress } from 'material-ui/Progress';*/
/* import Icon from 'material-ui/Icon';*/
import {
  Map as MapTyped,
  ImageOverlay,
  FeatureGroup,
  Polygon as PolygonTyped,
  Polyline as PolylineTyped,
  Rectangle as RectangleTyped
} from 'react-leaflet';
import { CRS, latLngBounds, DomEvent } from 'leaflet';
import { Annotation } from '../App';
import { EditControl, } from 'react-leaflet-draw';
import { improveDragging } from './dragging-fix';
import 'leaflet-editable';

// TODO hack to add editing onto the interface
const Map: any = MapTyped;
const Polygon: any = PolygonTyped;
const Rectangle: any = RectangleTyped;
const Polyline: any = PolylineTyped;

export type ToolNames = 'polygon' | 'rectangle' | 'line' | undefined;
interface Props {
  imageUrl: string;
  imageSize: {width: number, height: number};
  drawColor: string | undefined;
  annotations: Annotation[];
  onNewAnnotation: (annotation: {x: number, y: number}[]) => void;
  onAnnotationEdit: (annotationId: string, newBounds: {x: number, y: number}[]) => void;
  selectedTool: ToolNames | undefined;
  editShape: (annotationId?: string) => void,
  isEditing: boolean,
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
export function SegmentImage({
  imageUrl,
  imageSize: {width, height},
  drawColor,
  selectedTool,
  onNewAnnotation,
  onAnnotationEdit,
  annotations,
  editShape,
  isEditing,
}: Props) {

  const getPointsFromEvent = (e: any) => {
    let points = e.layer.getLatLngs();
    return (Array.isArray(points[0]) ? points[0] : points).map(toPixelLocation);
  }

  // tslint:disable-next-line
  const onCreate = (e: any) => {
    onNewAnnotation(getPointsFromEvent(e));
    // In order to keep this pure
    // I'm removing the drawn shape and letting it get updated via props
    e.layer.remove();
  };

  const mapClick = (e:any) => {
    if (!selectedTool && isEditing){
      // Turn editing off if they click outside the editing
      editShape();
    }
  }

  const onShapeCreation = (shape: any, annotationId: string, editingShape: boolean) => {
    if (shape){

      // Diffcult to keep leaflet pure...
      // I.E. This function gets called multiple times and we don't want
      // multiple event listeners
      if (!shape.leafletElement.listens('editable:vertex:dragend')) {
        const listenToDrags = (e: any) => {
          onAnnotationEdit(annotationId, getPointsFromEvent(e))
        }

        shape.leafletElement.on('editable:vertex:dragend', listenToDrags);
      }

      if (editingShape) {
        // Leaflet editable has some strange state problems
        // disable and then renable will force a redraw
        shape.leafletElement.disableEdit();
        shape.leafletElement.enableEdit();
      } else {
        shape.leafletElement.disableEdit();
      }
    }
  }

  // TODO improve zooming
  return (
    <Map
      ref={improveDragging}
      crs={CRS.Simple}
      bounds={[[0, 0], [height, width]]}
      maxZoom={100}
      minZoom={-4}
      zoomControl={false}
      editable={true}
      onClick={mapClick}
    >
      <ImageOverlay url={imageUrl} bounds={[[0, 0], [height, width]]} />
      <FeatureGroup>
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
      </FeatureGroup>
      {annotations.filter(({toolName}) => toolName === 'polygon').map(({id, color, bounds, editing}, index) => (
        <Polygon
          key={index}
          positions={bounds.map(toLatLngLocation)}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); editShape(id) }}
        />
      ))}
      {annotations.filter(({toolName}) => toolName === 'rectangle').map(({id, color, bounds, editing}, index) => (
        <Rectangle
          key={index}
          bounds={latLngBounds(bounds.map(toLatLngLocation))}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); editShape(id) }}
        />
      ))}
      {annotations.filter(({toolName}) => toolName === 'line').map(({id, color, bounds, editing}, index) => (
        <Polyline
          key={index}
          positions={bounds.map(toLatLngLocation)}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); editShape(id) }}
        />
      ))}
    </Map>
  );
}
