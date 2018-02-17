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
  Rectangle as RectangleTyped,
  Marker,
} from 'react-leaflet';
import { CRS, latLngBounds, DomEvent, DivIcon, Point } from 'leaflet';
import { Annotation } from '../app.reducer';
import { improveDragging } from './dragging-fix';
import 'leaflet-editable';
import { LeafletDraw } from './draw-component';

// TODO hack to add editing onto the interface
const Map: any = MapTyped;
const Polygon: any = PolygonTyped;
const Rectangle: any = RectangleTyped;
const Polyline: any = PolylineTyped;

interface LeafletClick extends Event {
  latlng: {
    lat: number;
    lng: number;
  };
}

export interface MapClick {
  location: {
    lat: number;
    lng: number;
  };
  shapeId?: string;
}

export type ToolNames = 'polygon' | 'rectangle' | 'line' | undefined;
interface Props {
  imageUrl: string;
  imageSize: {width: number, height: number};
  drawColor: string | undefined;
  annotations: Annotation[];
  onNewAnnotation: (annotation: {lat: number, lng: number}[]) => void;
  onDrawnAnnotationUpdate: (annotation: {lat: number, lng: number}[]) => void;
  onAnnotationEdit: (annotationId: string, newBounds: {lat: number, lng: number}[]) => void;
  markers: {location: {lat: number, lng: number}}[];
  selectedTool: ToolNames | undefined;
  isEditing: boolean,
  mapClick: (click: MapClick) => void
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
  markers,
  isEditing,
  mapClick,
}: Props) {

  const getPointsFromEvent = (e: any) => {
    let points = e.layer.getLatLngs();
    return (Array.isArray(points[0]) ? points[0] : points);
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
  const icon =  new DivIcon({
    iconSize: new Point(8, 8),
    className: 'leaflet-div-icon leaflet-editing-icon'
  });

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
      onClick={({latlng}:LeafletClick) => mapClick({location: latlng})}
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
          onClick={(e: LeafletClick) => { DomEvent.stop(e); mapClick({location: e.latlng, shapeId: id})}}
        />
      ))}
      {annotations.filter(({toolName}) => toolName === 'rectangle').map(({id, color, bounds, editing}, index) => (
        <Rectangle
          key={index}
          bounds={latLngBounds(bounds)}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); mapClick({location: e.latlng, shapeId: id}) }}
        />
      ))}
      {annotations.filter(({toolName}) => toolName === 'line').map(({id, color, bounds, editing}, index) => (
        <Polyline
          key={index}
          positions={bounds}
          color={color}
          ref={(shape: any) => onShapeCreation(shape, id, editing)}
          onClick={(e: any) => { DomEvent.stop(e); mapClick({location: e.latlng, shapeId: id}) }}
        />
      ))}
      {markers.map(({location}, index) => (<Marker key={index} position={location} icon={icon} />))}
    </Map>
  );
}
