import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

export class LabelingScreen extends Component {
  state = {}
  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = (label) => {
      this.props.onSubmit(this.state.label);
      this.setState({label: undefined});
    }

    const onSkip = () => {
      this.props.onSkip();
      this.setState({label: undefined});
    }

    return (
      <Card>
        <CardContent>
          <div>
            <img src={this.props.imageUrl} alt="classify-data" style={{width: '100%'}}/>
          </div>
          <div className="form-controls">
            <div className="classification">
              <ClassificationForm
                value={this.state.label || ''}
                onSelect={(label) => this.setState({label})}
              />
            </div>
            <div className="form-buttons">
            </div>
          </div>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
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
