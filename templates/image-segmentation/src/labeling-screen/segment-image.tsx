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
import { Annotation } from '../app.reducer';
import { improveDragging } from './dragging-fix';
import 'leaflet-editable';
import { LeafletDraw } from './draw-component';

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
  onNewAnnotation: (annotation: {lat: number, lng: number}[]) => void;
  onDrawnAnnotationUpdate: (annotation: {lat: number, lng: number}[]) => void;
  onAnnotationEdit: (annotationId: string, newBounds: {lat: number, lng: number}[]) => void;
  selectedTool: ToolNames | undefined;
  editShape: (annotationId?: string) => void,
  isEditing: boolean,
}

// TODO make this a function again
export function SegmentImage({
  imageUrl,
  imageSize: {width, height},
  drawColor,
  selectedTool,
  onNewAnnotation,
  onDrawnAnnotationUpdate,
  onAnnotationEdit,
  annotations,
  editShape,
  isEditing,
}: Props) {

  const getPointsFromEvent = (e: any) => {
    let points = e.layer.getLatLngs();
    return (Array.isArray(points[0]) ? points[0] : points);
  }


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
      minZoom={-2}
      zoomControl={false}
      editable={true}
      onClick={mapClick}
      zoomSnap={0.1}
    >
      <ImageOverlay url={imageUrl} bounds={[[0, 0], [height, width]]} />
      <FeatureGroup>
        <LeafletDraw
          drawColor={drawColor}
          selectedTool={selectedTool}
          onNewAnnotation={onNewAnnotation}
          onDrawnAnnotationUpdate={onDrawnAnnotationUpdate}
        />
      </FeatureGroup>
      {annotations.filter(({toolName}) => toolName === 'polygon').map(({id, color, bounds, editing}, index) => (
        <Polygon
          key={index}
          positions={bounds}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); editShape(id) }}
        />
      ))}
      {annotations.filter(({toolName}) => toolName === 'rectangle').map(({id, color, bounds, editing}, index) => (
        <Rectangle
          key={index}
          bounds={latLngBounds(bounds)}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); editShape(id) }}
        />
      ))}
      {annotations.filter(({toolName}) => toolName === 'line').map(({id, color, bounds, editing}, index) => (
        <Polyline
          key={index}
          positions={bounds}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); editShape(id) }}
        />
      ))}
    </Map>
  );
}
