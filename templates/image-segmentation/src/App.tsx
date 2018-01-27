import * as React from 'react';
import './App.css';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { LabelingScreen } from './labeling-screen/labeling-screen';
import { Toolbar } from './toolbar/toolbar';
import { getSizeOnImage } from './utils/image-size';
import { ToolNames } from './labeling-screen/segment-image';

export const primary = '#5495e3';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary
    }
  }
});

interface AnnotationsByTool {
  [key: string]: {x: number, y: number}[][];
}

type Tool = {name: string, color: string, tool: ToolNames};
const tools: Tool[] = [
  {name: 'Vegetation', color: 'pink', tool: 'polygon'},
  {name: 'Paved Road', color: 'purple', tool: 'polygon'},
  {name: 'Buildings', color: 'orange', tool: 'rectangle'},
  {name: 'Sidewalk', color: 'green', tool: 'line'},
];

function selectToolbarState(currentTools: Tool[], annotationsByTool: AnnotationsByTool) {
  return currentTools.map(({name, color, tool}) => {
    return {name, color, tool, count: 2, visible: true};
  });
}

class App extends React.Component {
  public state: {
    imageInfo: {url: string, height: number, width: number} | undefined,
    currentToolIndex: number,
    annotationsByTool: AnnotationsByTool,
  } = {
    imageInfo: undefined,
    currentToolIndex: 0,
    annotationsByTool: {}
  };

  componentWillMount () {
    this.next();
    /* window.addEventListener('keydown', (e) => console.log(e.keyCode));*/
    /* window.addEventListener('keyup', (e) => console.log(e.keyCode));*/
    /* */
    /* addHotkey('space', () => this.setState())*/
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

    const onNewAnnotation = (annotation: {x: number, y: number}[]) => {
      this.setState({
        ...this.state,
        annotationsByTool: {
          ...this.state.annotationsByTool,
          [this.state.currentToolIndex]: [
            ...(this.state.annotationsByTool[this.state.currentToolIndex] || []),
            annotation
          ]
        }
      });
    };

    // tslint:disable-next-line
    console.log(this.state.annotationsByTool);

    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div className="content">
            <div className="sidebar">
              <div className="header logo">Labelbox</div>
              <Toolbar
                tools={selectToolbarState(tools, this.state.annotationsByTool)}
                currentTool={this.state.currentToolIndex}
                toolChange={(currentToolIndex: number) => this.setState({...this.state, currentToolIndex})}
              />
            </div>
            <div className="labeling-frame">
              <div className="header">Outline all listed objects</div>
              <LabelingScreen
                imageInfo={this.state.imageInfo}
                onSubmit={(label: string) => this.next(label)}
                drawColor={tools[this.state.currentToolIndex].color}
                onNewAnnotation={onNewAnnotation}
                selectedTool={tools[this.state.currentToolIndex].tool}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
