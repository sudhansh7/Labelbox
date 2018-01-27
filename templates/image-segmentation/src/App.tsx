import * as React from 'react';
import './App.css';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { LabelingScreen } from './labeling-screen/labeling-screen';
import { Toolbar } from './toolbar/toolbar';
import { getSizeOnImage } from './utils/image-size';
export const primary = '#5495e3';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary
    }
  }
});

class App extends React.Component {
  public state: {
    imageInfo: {url: string, height: number, width: number} | undefined,
    currentToolIndex: number,
    annotationsByTool: {},
  } = {
    imageInfo: undefined,
    currentToolIndex: 0,
    annotationsByTool: {}
  };

  componentWillMount () {
    this.next();
  }

  next(label?: string) {
    const getNext = () => {
      // tslint:disable-next-line
      (window as any).Labelbox.fetchNextAssetToLabel()
        .then((imageUrl: string) => {
          const updateImageInfo = ({height, width}: {height: number, width: number}) => {
            this.setState({...this.state, imageInfo: {width, height, url: imageUrl}});
          };
          getSizeOnImage(imageUrl).then(updateImageInfo);
        });
    };
    if (label) {
      // tslint:disable-next-line
      (window as any).Labelbox.setLabelForAsset(label).then(getNext);
    } else {
      getNext();
    }
  }

  render() {
    const tools = [
      {name: 'Vegetation', color: 'pink'},
      {name: 'Paved Road', color: 'purple'},
      {name: 'Sidewalk', color: 'green'},
      {name: 'Buildings', color: 'orange'},
    ];

    const onNewAnnotation = (annotation: {x: number, y: number}[]) => {
      this.setState({
        ...this.state,
        annotationsByTool: {
          ...this.state.annotationsByTool,
          [this.state.currentToolIndex]: [
            ...(this.state.annotationsByTool[this.state.currentToolIndex] || {}),
            annotation
          ]
        }
      });
    };

    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div className="content">
            <div className="sidebar">
              <div className="header logo">Labelbox</div>
              <Toolbar
                tools={tools}
                currentTool={this.state.currentToolIndex}
                toolChange={(currentToolIndex: number) => this.setState({...this.state, currentToolIndex})}
              />
            </div>
            <div className="labeling-frame">
              <div className="header">Outline all listed objects</div>
              <LabelingScreen
                imageUrl={this.state.imageInfo && this.state.imageInfo.url}
                onSubmit={(label: string) => this.next(label)}
                drawColor={tools[this.state.currentToolIndex].color}
                onNewAnnotation={onNewAnnotation}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
