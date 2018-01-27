import * as React from 'react';
import { SegmentImage } from './segment-image';

export class LabelingScreen extends React.Component {
  // TODO move these all to props
  public state = {
    segmentation: [],
    customization: {
      instructions: "Outline the car using the polygon tool",
      showPolygonTool: true,
      showRectangleTool: true,
      allowMultipleAnnotations: true
    }
  };

  public props: {
    imageUrl: string | undefined,
    onSubmit: (label: string) => void,
    drawColor: string,
    // TODO not any
    onNewAnnotation: (annotation: any) => void,
  }

  customizationSubscription: {unsubscribe: () => {}};

  componentWillMount(){
    this.customizationSubscription = window['Labelbox'].getTemplateCustomization()
      // TODO any
      .subscribe((customization: any) => {
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

    const { showPolygonTool, showRectangleTool, allowMultipleAnnotations } = this.state.customization;

    const removeTools = this.state.segmentation.length > 0 && !allowMultipleAnnotations;

    return (
      <SegmentImage
        imageUrl={this.props.imageUrl}
        showPolygonTool={removeTools ? false : showPolygonTool}
        showRectangleTool={removeTools ? false : showRectangleTool}
        updateLabel={(segmentation: string) => this.setState({...this.state, segmentation})}
        drawColor={this.props.drawColor}
        onNewAnnotation={this.props.onNewAnnotation}
      />
    );
  }
}
