import React, { Component } from 'react';
import Button from 'material-ui/Button';
import ClassificationForm from './classification-options';

export class LabelingScreen extends Component {
  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    let chosenLabel;

    return (
      <div>
        <div>
          <img src={this.props.imageUrl} alt="classify-data" />
        </div>
        <div className="form-controls">
          <div className="classification">
            <ClassificationForm />
          </div>
          <div className="form-buttons">
            <Button>Skip</Button>
            <Button raised={true} color="primary" disabled={!chosenLabel}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }
}
