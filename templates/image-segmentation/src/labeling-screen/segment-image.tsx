import * as React from 'react';
import L from 'leaflet';
import './leaflet.css';
import './leaflet-draw/leaflet.draw.css';
import './leaflet-draw/leaflet.draw';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import { getSizeOnImage } from './image-size';

interface Props {
  imageUrl: string,
  showPolygonTool: boolean,
  showRectangleTool: boolean,
  updateLabel: (label: string) => void,
  drawColor: string,
  onNewAnnotation: (anotation: {x: number, y: number}[]) => void,
}

export class SegmentImage extends React.Component {
  state = {
    loading: true,
    errorLoadingImage: false
  }

  // TODO any
  private drawnItems: any;
  private drawnOverlay: any;
  private drawControl: any;
  private map: any;

  public props: Props;

  componentDidUpdate(newProps: Props){
    const { imageUrl } = newProps;
    if (imageUrl !== this.props.imageUrl) {
      this.drawnItems.getLayers().forEach((layer: {remove: () => void}) => layer.remove());
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

  drawImageOnMap(imageUrl: string) {
    const updateLabel = () => {
      const toPixelLocation = ({lat, lng}: {lat: number, lng: number}) => ({y: lat, x: lng});
      const segmentation = this.drawnItems.getLayers()
            // TODO any
            .map((layer: any) => layer.getLatLngs())
            .map(([latLngLocations]: {lat: number, lng: number}[][]) => latLngLocations.map(toPixelLocation));
      this.props.updateLabel(segmentation || []);
    };

    this.setState({...this.state, loading: true});
    getSizeOnImage(imageUrl).then(({width, height}) => {
      const bounds = [[0,0], [height,width]];

      this.drawnOverlay = L.imageOverlay(imageUrl, bounds).addTo(this.map);
      this.map.addLayer(this.drawnItems);
      this.map.fitBounds(bounds);
      this.map.setZoom(-1);

		  this.map.on(L.Draw.Event.CREATED, (e: any) => {
			  this.drawnItems.addLayer(e.layer);
        // TODO might not need these other items
        this.props.onNewAnnotation(e.layer.getLatLngs());
        updateLabel();
		  });

		  this.map.on(L.Draw.Event.DELETED, (e: any) => {
        updateLabel();
		  });

      this.setState({...this.state, loading: false});
    }, () => {
      this.setState({...this.state, loading: false, errorLoadingImage: true});
    });
  }

  render() {
    return (
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'} as any}>
        {
          this.state.loading && (<LinearProgress color="primary" />)
        }
        {
          this.state.errorLoadingImage ? (
            <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'center'} as any}>
              <Icon style={{color: 'grey', fontSize: '200px'}}>broken_image</Icon>
              <div style={{color: 'grey', fontStyle: 'italic'}}>
                Error loading <a href={this.props.imageUrl} target="_blank">{this.props.imageUrl}</a>. Please confirm that this url is live and a direct link to an image. Webpage links are not supported.
              </div>
            </div>
          ) :
          (<div id="map" style={{display: 'flex', flexGrow: '1'} as any}></div>)
        }
      </div>
    );
  }
}
