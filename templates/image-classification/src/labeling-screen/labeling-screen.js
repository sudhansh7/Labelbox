import React, { Component } from 'react';
import Button from 'material-ui/Button';
import ClassificationForm from './classification-options';

export class LabelingScreen extends Component {
  state = {}
  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
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
            <Button>Skip</Button>
            <Button raised={true} color="primary" disabled={!this.state || !this.state.label}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }
}
