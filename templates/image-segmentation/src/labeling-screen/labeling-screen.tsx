import * as React from 'react';
import { SegmentImage, ToolNames } from './segment-image';
import { Annotation } from '../App';

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
    onAnnotationEdit: (annotationId: string, newBounds: {x: number, y: number}[]  | {x: number, y: number}) => void;
    imageInfo: {url: string, height: number, width: number} | undefined,
    onSubmit: (label: string) => void,
    drawColor: string | undefined,
    onNewAnnotation: (annotation: {x: number, y: number}[] | {x: number, y: number}) => void;
    selectedTool: ToolNames | undefined,
    annotations: Annotation[],
    editShape: (annotationId?: string) => void,
    isEditing: boolean,
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
        isEditing={this.props.isEditing}
        onAnnotationEdit={this.props.onAnnotationEdit}
      />
    );
  }
}
