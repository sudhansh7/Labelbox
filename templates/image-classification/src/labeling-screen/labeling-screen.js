import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';

export class LabelingScreen extends Component {
  state = {
    loading: true,
    errorLoadingImage: false
  }

  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = (label) => {
      this.props.onSubmit(this.state.label);
      this.setState({...this.state, label: undefined, loading: true});
    };

    const onSkip = () => {
      this.props.onSkip();
      this.setState({...this.state, label: undefined, loading: true});
    };

    return (
      <Card>
        <CardContent>
          {
            this.state.loading && (<LinearProgress color="accent" />)
          }
          {
            this.props.imageUrl && !this.state.errorLoadingImage &&
              (<img
                style={{width: '100%', opacity: this.state.loading ? '0.2' : '1'}}
                src={this.props.imageUrl}
                onLoad={(e) => this.setState({...this.state, loading: false})}
                onError={() => this.setState({...this.state, loading: false, errorLoadingImage: true})}
                alt="classify-data"
              />)
          }
          {
            this.state.errorLoadingImage && (
              <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', alignItems: 'center'}}>
                <Icon style={{color: 'grey', fontSize: '200px'}}>broken_image</Icon>
                <div style={{color: 'grey', fontStyle: 'italic'}}>
                  Error loading <a href={this.props.imageUrl} target="_blank">{this.props.imageUrl}</a>. Please confirm that this url is live and a direct link to an image. Webpage links are not supported.
                </div>
              </div>
            )
          }
          <div className="form-controls">
            <div className="classification">
              <ClassificationForm
                value={this.state.label || ''}
                onSelect={(label) => this.setState({...this.state, label})}
              />
            </div>
            <div className="form-buttons">
            </div>
          </div>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button onClick={onSkip} >Skip</Button>
          <Button
            raised={true}
            color="primary"
            disabled={!this.state || !this.state.label}
            onClick={onSubmit}
          >Submit</Button>
        </CardActions>
      </Card>
    );
  }
}
