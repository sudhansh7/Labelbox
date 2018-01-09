import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { SegmentImage } from './segment-image';
import { rectangleIcon, polygonIcon } from './icons';
import screenText from './screen-text';

export class LabelingScreen extends Component {
  state = {}
  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = (label) => {
      this.props.onSubmit(JSON.stringify(this.state.segmentation));
      this.setState({segmentation: undefined});
    };

    return (
      <Card>
        <CardContent>
          <div>
            <SegmentImage
              imageUrl={this.props.imageUrl}
              style={{width: '100%'}}
              updateLabel={(segmentation) => this.setState({segmentation})}
            />
          </div>
          <div className="form-controls">
            <div>{screenText.instructions}</div>
          </div>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button
            raised={true}
            color="primary"
            disabled={!this.state || !this.state.segmentation || this.state.segmentation.length === 0}
            onClick={onSubmit}
          >Submit</Button>
        </CardActions>
      </Card>
    );
  }
}
