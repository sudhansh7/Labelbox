import React, { Component } from 'react';
import ClassificationForm from './classification-options';
import { SegmentImage } from './segment-image';
import { rectangleIcon, polygonIcon } from './icons';

export class LabelingScreen extends Component {
  state = {
    segmentation: [],
    customization: {
      instructions: "Outline the car using the polygon tool",
      showPolygonTool: true,
      showRectangleTool: true,
      allowMultipleAnnotations: true
    }
  };

  customizationSubscription;

  componentWillMount(){
    this.customizationSubscription = window.Labelbox.getTemplateCustomization()
      .subscribe((customization) => {
        this.setState({...this.state, customization});
      });
  }

  componentWillUnmount(){
    this.customizationSubscription.unsubscribe();
  }

  render() {
    if (!this.props.imageUrl) {
      return (<div>Loading...</div>);
    }

    const onSubmit = (label) => {
      this.props.onSubmit(JSON.stringify(this.state.segmentation));
      this.setState({...this.state, segmentation: []});
    };

    const {showPolygonTool, showRectangleTool, allowMultipleAnnotations, instructions} = this.state.customization;

    const removeTools = this.state.segmentation.length > 0 && !allowMultipleAnnotations;

    return (
      <SegmentImage
        imageUrl={this.props.imageUrl}
        showPolygonTool={removeTools ? false : showPolygonTool}
        showRectangleTool={removeTools ? false : showRectangleTool}
        style={{width: '100%'}}
        updateLabel={(segmentation) => this.setState({...this.state, segmentation})}
        drawColor={this.props.drawColor}
      />
    );
  }
}
