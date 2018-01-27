import * as React from 'react';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import { getSizeOnImage } from './image-size';

import { render } from 'react-dom'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

interface Props {
  imageUrl: string,
  showPolygonTool: boolean,
  showRectangleTool: boolean,
  updateLabel: (label: string) => void,
  drawColor: string,
  onNewAnnotation: (anotation: {x: number, y: number}[]) => void,
}

export function SegmentImage ({imageUrl}: Props) {
  const position = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13
  };

  console.log('render this image', imageUrl);

  return (
    <Map center={position} zoom={position.zoom}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      <Marker position={position}>
        <Popup>
          <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
        </Popup>
      </Marker>
    </Map>
  );
}
