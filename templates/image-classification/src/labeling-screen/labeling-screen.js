import React, { Component } from 'react';
import Button from 'material-ui/Button';
import ClassificationForm from './classification-options';

export class LabelingScreen extends Component {
  state = {}
  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = (label) => {
      this.props.onSubmit(this.state.label)
      this.setState({label: undefined})
    }

    const onSkip = () => {
      this.props.onSkip()
      this.setState({label: undefined})
    }

    return (
      <div>
        <div>
          <img src={this.props.imageUrl} alt="classify-data" />
        </div>
        <div className="form-controls">
          <div className="classification">
            <ClassificationForm
              value={this.state.label || ''}
              onSelect={(label) => this.setState({label})}
            />
          </div>
          <div className="form-buttons">
            <Button onClick={onSkip}>Skip</Button>
            <Button
              raised={true}
              color="primary"
              disabled={!this.state || !this.state.label}
              onClick={onSubmit}
            >Submit</Button>
          </div>
        </div>
      </div>
    );
  }
}
