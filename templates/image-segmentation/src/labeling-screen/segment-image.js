import React, { Component } from 'react';
import L from 'leaflet';
import './leaflet.css';
import './leaflet-draw/leaflet.draw.css';
import './leaflet-draw/leaflet.draw';

function getSizeOnImage(url) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = url;
    img.onload = (event) => {
      document.body.removeChild(img);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.style.display = 'none';
    document.body.appendChild(img);
  });
}

export class SegmentImage extends Component {
  componentWillUpdate(newProps){
    const { imageUrl } = newProps;
    if (imageUrl !== this.props.imageUrl) {
      this.drawnItems.getLayers().forEach((layer) => layer.remove());
      this.drawnOverlay.remove();
      getSizeOnImage(imageUrl).then((size) => this.drawMap({imageUrl, ...size}));
    }
  }

  componentDidMount(){
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -5,
      attributionControl: false,
      zoomControl: false
    });
    this.drawnItems = new L.FeatureGroup();
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        polygon: true,
        rectangle: true,
        circle: false,
        circlemarker: false,
        marker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true
      }
    });
    this.map.addControl(drawControl);
    const { imageUrl } = this.props;
    getSizeOnImage(imageUrl).then((size) => this.drawMap({imageUrl, ...size}));
  }

  drawMap({imageUrl, width, height}) {
    const bounds = [[0,0], [height,width]];
    this.drawnOverlay = L.imageOverlay(imageUrl, bounds).addTo(this.map);
    this.map.addLayer(this.drawnItems);
    this.map.fitBounds(bounds);
    this.map.setZoom(-1);

		this.map.on(L.Draw.Event.CREATED, (e) => {
			this.drawnItems.addLayer(e.layer);
      const toPixelLocation = ({lat, lng}) => ({y: lat, x: lng});
      const segmentation = this.drawnItems.getLayers()
        .map((layer) => layer.getLatLngs())
        .map(([latLngLocations]) => latLngLocations.map(toPixelLocation));
      this.props.updateLabel(segmentation);
		});
  }


  render() {
    return (
      <div>
        <div id="map" style={{height: '350px'}}></div>
      </div>
    );
  }
}
