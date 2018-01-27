import * as React from 'react';
import { LinearProgress } from 'material-ui/Progress';
import Icon from 'material-ui/Icon';
import { getSizeOnImage } from './image-size';

interface Props {
  imageUrl: string,
  showPolygonTool: boolean,
  showRectangleTool: boolean,
  updateLabel: (label: string) => void,
  drawColor: string,
  onNewAnnotation: (anotation: {x: number, y: number}[]) => void,
}

export class SegmentImage extends React.Component {
  state = {
    loading: true,
    errorLoadingImage: false
  }

  public props: Props;

  render() {
    return (
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'} as any}>
        hello
      </div>
    );
  }
}
