import * as React from 'react';
import ClassificationForm from './classification-options';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';

export class LabelingScreen extends React.Component {
  state: {
    loading: boolean,
    errorLoadingImage: boolean,
    label?: string,
  } = {
    loading: true,
    errorLoadingImage: false,
  }
  props: {
    imageUrl?: string;
    onSkip: Function;
    onSubmit: Function;
  }

  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = () => {
      this.props.onSubmit(this.state.label);
      this.setState({...this.state, label: undefined, loading: true});
    };

    const onSkip = () => {
      this.props.onSkip();
      this.setState({...this.state, label: undefined, loading: true});
    };

    return (
      <div style={{display: 'flex'}}>
        <div>
          <div className="form-controls">
            <div className="classification">
              <ClassificationForm
                value={this.state.label || ''}
                onSelect={(label: string) => this.setState({...this.state, label})}
              />
              </div>
            <div className="form-buttons">
            </div>
          </div>
          <div style={{justifyContent: 'flex-end'}}>
            <Button onClick={onSkip} >Skip</Button>
            <Button
              variant="raised"
              color="primary"
              disabled={!this.state || !this.state.label}
              onClick={() => onSubmit()}
            >Submit</Button>
          </div>
        </div>
        <div>
          {
            this.state.loading && (<LinearProgress color="primary" />)
          }
          {
            this.props.imageUrl && !this.state.errorLoadingImage &&
              (<img style={{maxWidth: '100%', maxHeight: '100%', opacity: this.state.loading ? '0.2' : '1'} as any}
                  src={this.props.imageUrl}
                  onLoad={(e) => this.setState({...this.state, loading: false})}
                  onError={() => this.setState({...this.state, loading: false, errorLoadingImage: true})}
                  alt="classify-data"
                />)
          }
          {
            this.state.errorLoadingImage && (
              <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'center'} as any}>
                <Icon style={{color: 'grey', fontSize: '200px'}}>broken_image</Icon>
                <div style={{color: 'grey', fontStyle: 'italic'}}>
                  Error loading <a href={this.props.imageUrl} target="_blank">{this.props.imageUrl}</a>. Please confirm that this url is live and a direct link to an image. Webpage links are not supported.
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
