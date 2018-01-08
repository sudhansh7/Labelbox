import React, { Component } from 'react';
import L from 'leaflet';
import './leaflet.css';

export class SegmentImage extends Component {
  componentDidMount(){
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
  }

  render() {
    return (
      <div>
        <div id="mapid" style={{height: '180px'}}></div>
        <div>Segment this image {this.props.imageUrl}</div>
      </div>
    );
  }
}
