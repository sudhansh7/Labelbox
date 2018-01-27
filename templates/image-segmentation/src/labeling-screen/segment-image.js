import React, { Component } from 'react';
import L from 'leaflet';
import './leaflet.css';
import './leaflet-draw/leaflet.draw.css';
import './leaflet-draw/leaflet.draw';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import { getSizeOnImage } from './image-size';

export class SegmentImage extends Component {
  state = {
    loading: true,
    errorLoadingImage: false
  }

  componentDidUpdate(newProps){
    const { imageUrl, showPolygonTool, showRectangleTool } = newProps;
    if (imageUrl !== this.props.imageUrl) {
      this.drawnItems.getLayers().forEach((layer) => layer.remove());
      this.drawnOverlay.remove();
      this.drawImageOnMap(imageUrl);
    }
    this.updateDrawControls();
  }

  updateDrawControls() {
    if (this.drawControl){
      this.drawControl.remove();
    }
    this.drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polyline: false,
        polygon: this.props.showPolygonTool && {
          shapeOptions: {
            color: this.props.drawColor
          }
        },
        rectangle: this.props.showRectangleTool && {
          shapeOptions: {
            color: this.props.drawColor
          }
        },
        circle: false,
        circlemarker: false,
        marker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true
      }
    });
    this.map.addControl(this.drawControl);
  }

  componentDidMount(){
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -5,
      attributionControl: false,
      zoomControl: false
    });
    this.drawnItems = new L.FeatureGroup();
    this.updateDrawControls();
    const { imageUrl } = this.props;
    this.drawImageOnMap(imageUrl);
  }

  drawImageOnMap(imageUrl) {
    const updateLabel = () => {
      const toPixelLocation = ({lat, lng}) => ({y: lat, x: lng});
      const segmentation = this.drawnItems.getLayers()
            .map((layer) => layer.getLatLngs())
            .map(([latLngLocations]) => latLngLocations.map(toPixelLocation));
      this.props.updateLabel(segmentation || []);
    };

    this.setState({...this.state, loading: true});
    getSizeOnImage(imageUrl).then(({width, height}) => {
      const bounds = [[0,0], [height,width]];

      this.drawnOverlay = L.imageOverlay(imageUrl, bounds).addTo(this.map);
      this.map.addLayer(this.drawnItems);
      this.map.fitBounds(bounds);
      this.map.setZoom(-1);

		  this.map.on(L.Draw.Event.CREATED, (e) => {
			  this.drawnItems.addLayer(e.layer);
        updateLabel();
		  });

		  this.map.on(L.Draw.Event.DELETED, (e) => {
        updateLabel();
		  });

      this.setState({...this.state, loading: false});
    }, () => {
      this.setState({...this.state, loading: false, errorLoadingImage: true});
    });
  }

  render() {
    return (
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'}}>
        {
          this.state.loading && (<LinearProgress color="accent" />)
        }
        {
          this.state.errorLoadingImage ? (
            <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'center'}}>
              <Icon style={{color: 'grey', fontSize: '200px'}}>broken_image</Icon>
              <div style={{color: 'grey', fontStyle: 'italic'}}>
                Error loading <a href={this.props.imageUrl} target="_blank">{this.props.imageUrl}</a>. Please confirm that this url is live and a direct link to an image. Webpage links are not supported.
              </div>
            </div>
          ) :
          (<div id="map" style={{display: 'flex', flexGrow: '1'}}></div>)
        }
      </div>
    );
  }
}
