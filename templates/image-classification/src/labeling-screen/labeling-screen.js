import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    maxHeight: '80vh',
  },
});

export class LabelingScreen extends Component {
  state = {}
  render() {

    const bull = <span>•</span>;

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
            </div>
          </div>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button onClick={onSkip}>Skip</Button>
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
