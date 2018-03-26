// tslint:disable
import * as React from 'react';
import {
  Map as MapTyped,
  ImageOverlay,
  FeatureGroup,
  Polygon as PolygonTyped,
  Polyline as PolylineTyped,
  Rectangle as RectangleTyped,
  Marker as MarkerTyped,
} from 'react-leaflet';
import { CRS, latLngBounds, DomEvent } from 'leaflet';
import { Annotation } from '../app.reducer';
import { improveDragging } from './dragging-fix';
import 'leaflet-editable';
import { LeafletDraw } from './draw-component';
import { getPointIcon } from './get-point-icon';

// TODO hack to add editing onto the interface
const Map: any = MapTyped;
const Polygon: any = PolygonTyped;
const Rectangle: any = RectangleTyped;
const Polyline: any = PolylineTyped;
const Marker: any = MarkerTyped;

const debounce = (fn: Function, time: number) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), time);
  }
}

interface LeafletEvent extends Event {
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

export interface MouseMove {
  location: {
    lat: number;
    lng: number;
  };
}

export type ToolType = 'polygon' | 'rectangle' | 'line' | 'point' | undefined;
interface Props {
  imageUrl: string;
  imageSize: {width: number, height: number};
  drawColor: string | undefined;
  annotations: Annotation[];
  onNewAnnotation: (annotation: {lat: number, lng: number}[]) => void;
  onDrawnAnnotationUpdate: (annotation: {lat: number, lng: number}[]) => void;
  onAnnotationEdit: (annotationId: string, newBounds: {lat: number, lng: number}[]) => void;
  selectedTool: ToolType | undefined;
  isEditing: boolean;
  onMapClick: (click: MapClick) => void;
  onMouseMove: (move: MouseMove) => void;
  onImageLoaded: () => void;
  loading: boolean;
}

export function SegmentImage({
  imageUrl,
  imageSize: {width, height},
  drawColor,
  selectedTool,
  onNewAnnotation,
  onDrawnAnnotationUpdate,
  onAnnotationEdit,
  annotations,
  isEditing,
  onMapClick,
  onMouseMove,
  onImageLoaded,
  loading,
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

  const notifyImageLoaded = (ref: any) => {
    if (ref && !ref.leafletElement.listens('load')) {
      ref.leafletElement.on('load', onImageLoaded);
    }
  }

  return (
    <div style={{opacity: loading ? 0.6 : 1, height: '100%', widht: '100%'}}>
      <Map
        ref={improveDragging}
        crs={CRS.Simple}
        bounds={[[0, 0], [height, width]]}
        maxZoom={100}
        minZoom={-50}
        zoomControl={false}
        editable={true}
        onClick={({latlng}:LeafletEvent) => onMapClick({location: latlng})}
        onMousemove={({latlng}:LeafletEvent) => onMouseMove({location: latlng})}
        zoomSnap={0.1}
      >
        <ImageOverlay url={imageUrl} bounds={[[0, 0], [height, width]]} ref={notifyImageLoaded}/>
        <FeatureGroup>
          <LeafletDraw
            drawColor={drawColor}
            selectedTool={selectedTool}
            onNewAnnotation={onNewAnnotation}
            onDrawnAnnotationUpdate={onDrawnAnnotationUpdate}
          />
        </FeatureGroup>
        {annotations.filter(({toolName}) => toolName === 'polygon').map(({id, color, geometry, editing}, index) => (
          <Polygon
            key={id}
            positions={geometry}
            color={color}
            ref={(shape: any) => onShapeCreation(shape, id, editing)}
            onClick={(e: LeafletEvent) => { DomEvent.stop(e); onMapClick({location: e.latlng, shapeId: id})}}
          />
        ))}
        {annotations.filter(({toolName}) => toolName === 'rectangle').map(({id, color, geometry, editing}, index) => (
          <Rectangle
            key={id}
            bounds={Array.isArray(geometry) && latLngBounds(geometry)}
            color={color}
            ref={(shape: any) => onShapeCreation(shape, id, editing)}
            onClick={(e: any) => { DomEvent.stop(e); onMapClick({location: e.latlng, shapeId: id}) }}
          />
        ))}
        {annotations.filter(({toolName}) => toolName === 'line').map(({id, color, geometry, editing}, index) => (
          <Polyline
            key={id}
            positions={geometry}
            color={color}
            ref={(shape: any) => onShapeCreation(shape, id, editing)}
            onClick={(e: any) => { DomEvent.stop(e); onMapClick({location: e.latlng, shapeId: id}) }}
          />
        ))}
        {annotations.filter(({toolName}) => toolName === 'point').map(({id, color, geometry, editing}, index) => (
          <Marker
            key={id}
            position={geometry}
            icon={getPointIcon(color)}
            color={color}
            draggable={true}
            onDrag={debounce((e: any) => onAnnotationEdit(id, e.latlng), 500)}
            ref={(shape: any) => onShapeCreation(shape, id, editing)}
            onClick={(e: any) => { DomEvent.stop(e); onMapClick({location: e.latlng, shapeId: id}) }}
          />
        ))}
      </Map>
    </div>
  );
}
