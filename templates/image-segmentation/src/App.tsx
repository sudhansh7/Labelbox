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
  return currentTools.map(({name, color, tool}, index) => {
    return {
      name,
      color,
      tool,
      count: annotationsByTool[index] ? annotationsByTool[index].length : 0,
      visible: true
    };
  });
}

// TODO write test for this function
function selectAnnotations(currentTools: Tool[], annotationsByTool: AnnotationsByTool) {
  const mergeAnnotationsAndTools = (allAnnotations: AnnotationsByTool, {tool, color}: Tool, index: number) => {
    const annotations = annotationsByTool[index] ?
      annotationsByTool[index].map((bounds) => ({ color, bounds })) :
      [];
    const differentColorWithSameTool = allAnnotations[tool as string] ? allAnnotations[tool as string] : [];
    return Object.assign(allAnnotations, {[tool as string]: [...differentColorWithSameTool, ...annotations]});
  };
  return currentTools.reduce(mergeAnnotationsAndTools, {});
}

class App extends React.Component {
  public state: {
    imageInfo: {url: string, height: number, width: number} | undefined,
    currentToolIndex: number,
    annotationsByTool: AnnotationsByTool,
    hiddenTools?: number[],
  } = {
    imageInfo: undefined,
    currentToolIndex: 0,
    annotationsByTool: {},
  };

  componentWillMount () {
    this.next();
    /* window.addEventListener('keydown', (e) => console.log(e.keyCode));*/
    /* window.addEventListener('keyup', (e) => console.log(e.keyCode));*/
    /* */
    /* addHotkey('space', () => this.setState())*/
    return true;
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
    // tslint:disable
    console.log('hidden', this.state.hiddenTools, (this.state as any).test)

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

    const toggleVisiblityOfTool = (hiddenTools: number) => {
      // tslint:disable
      console.log({...this.state, hiddenTools, test: hiddenTools})
      this.setState({...this.state, hiddenTools, test: hiddenTools});
    };


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
                visibilityToggle={toggleVisiblityOfTool}
              />
            </div>
            <div className="labeling-frame">
              <div className="header">Outline all listed objects</div>
              <LabelingScreen
                imageInfo={this.state.imageInfo}
                annotations={selectAnnotations(tools, this.state.annotationsByTool)}
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
