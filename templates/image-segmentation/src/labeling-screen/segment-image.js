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
  componentDidMount(){
    const { imageUrl } = this.props;
    getSizeOnImage(imageUrl).then((size) => this.drawMap({imageUrl, ...size}));
  }

  drawMap({imageUrl, width, height}) {
    const map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -5,
      attributionControl: false,
      zoomControl: false
    });
    const bounds = [[0,0], [height,width]];
    const image = L.imageOverlay(imageUrl, bounds).addTo(map);
    const drawnItems = new L.FeatureGroup();
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
        featureGroup: drawnItems,
        remove: true
      }
    });
    map.addControl(drawControl);
    map.addLayer(drawnItems);
    map.fitBounds(bounds);
    map.setZoom(-1);

		map.on(L.Draw.Event.CREATED, (e) => {
			drawnItems.addLayer(e.layer);
      const toPixelLocation = ({lat, lng}) => ({y: lat, x: lng});
      const segmentation = drawnItems.getLayers()
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
