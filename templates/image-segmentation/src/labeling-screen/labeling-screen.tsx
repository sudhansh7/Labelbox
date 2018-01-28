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
    selectedTool: ToolNames,
    annotations: {
      [key: string]: {
        color: string;
        bounds: {x: number, y: number}[];
        editing: boolean;
      }[]
    };
    editShape: (tool: ToolNames, index: number) => void
  };

  customizationSubscription: {unsubscribe: () => {}};

  componentWillMount() {
    // TODO need to redo this customization
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

    const { width, height, url } = this.props.imageInfo;
    return (
      <SegmentImage
        imageUrl={url}
        imageSize={{width, height}}
        drawColor={this.props.drawColor}
        onNewAnnotation={this.props.onNewAnnotation}
        selectedTool={this.props.selectedTool}
        annotations={this.props.annotations}
        editShape={this.props.editShape}
      />
    );
  }
}
