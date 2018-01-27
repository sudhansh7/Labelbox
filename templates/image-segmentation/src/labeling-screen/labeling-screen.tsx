import * as React from 'react';
import { SegmentImage, ToolNames } from './segment-image';

export class LabelingScreen extends React.Component {
  // TODO move these all to props
  public state = {
    segmentation: [],
    customization: {
      instructions: 'Outline the car using the polygon tool',
      showPolygonTool: true,
      showRectangleTool: true,
      allowMultipleAnnotations: true
    }
  };

  public props: {
    imageInfo: {url: string, height: number, width: number} | undefined,
    onSubmit: (label: string) => void,
    drawColor: string,
    // tslint:disable-next-line
    onNewAnnotation: (annotation: any) => void,
    selectedTool: ToolNames
  };

  customizationSubscription: {unsubscribe: () => {}};

  componentWillMount() {
    // tslint:disable-next-line
    this.customizationSubscription = (window as any).Labelbox.getTemplateCustomization()
      // tslint:disable-next-line
      .subscribe((customization: any) => {
        this.setState({...this.state, customization});
      });
  }

  componentWillUnmount() {
    this.customizationSubscription.unsubscribe();
  }

  render() {
    if (!this.props.imageInfo) {
      return (<div>Loading...</div>);
    }

    const { showPolygonTool, showRectangleTool, allowMultipleAnnotations } = this.state.customization;

    const removeTools = this.state.segmentation.length > 0 && !allowMultipleAnnotations;

    const { width, height, url } = this.props.imageInfo;
    return (
      <SegmentImage
        imageUrl={url}
        imageSize={{width, height}}
        showPolygonTool={removeTools ? false : showPolygonTool}
        showRectangleTool={removeTools ? false : showRectangleTool}
        updateLabel={(segmentation: string) => this.setState({...this.state, segmentation})}
        drawColor={this.props.drawColor}
        onNewAnnotation={this.props.onNewAnnotation}
        selectedTool={this.props.selectedTool}
      />
    );
  }
}
