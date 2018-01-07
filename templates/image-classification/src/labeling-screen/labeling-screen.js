import React from 'react';
import Button from 'material-ui/Button';
import ClassificationForm from './classification-options';

export function LabelingScreen(props) {
  if (!props.imageUrl) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
      <div>
        <img src={props.imageUrl} alt="classify-data" />
      </div>
      <div className="form-controls">
        <div className="classification">
          <ClassificationForm />
        </div>
        <div className="form-buttons">
          <Button>Skip</Button>
          <Button raised={true} color="primary">Submit</Button>
        </div>
      </div>
    </div>
  );
}
