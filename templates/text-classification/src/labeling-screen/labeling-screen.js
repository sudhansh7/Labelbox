import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { LinearProgress } from 'material-ui/Progress';

export class LabelingScreen extends Component {
  render() {
    if (!this.props.text) {
      return (<div>Loading...</div>);
    }

    const submit = (label) => {
      this.props.onSubmit(label);
    };

    return (
      <Card>
        <CardContent>
          {
            !this.props.text && (<LinearProgress color="accent" />)
          }
          <div style={{fontStyle: 'italic', margin: '20px'}}>{this.props.text}</div>
          <div className="form-controls" style={{display: 'flex', flexGrow: '1'}}>
            <ClassificationForm onSelect={submit} />
          </div>
        </CardContent>
      </Card>
    );
  }
}
