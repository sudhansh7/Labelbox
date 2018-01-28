// tslint:disable
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
import { keyComboStream, keyDownSteam } from './key-binding-helpers';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

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

type Tool = {id: string, name: string, color: string, tool: ToolNames};
const tools: Tool[] = [
  {id: guid(), name: 'Vegetation', color: 'pink', tool: 'polygon'},
  {id: guid(), name: 'Paved Road', color: 'purple', tool: 'polygon'},
  {id: guid(), name: 'Buildings', color: 'orange', tool: 'rectangle'},
  {id: guid(), name: 'Sidewalk', color: 'green', tool: 'line'},
];

function selectToolbarState(currentTools: Tool[], annotationsByTool: AnnotationsByTool, hiddenTools: string[]) {
  return currentTools
    .map(({id, name, color, tool}) => {
      return {
        id,
        name,
        color,
        tool,
        count: annotationsByTool[id] ? annotationsByTool[id].length : 0,
        visible: hiddenTools.indexOf(id) === -1
      };
    });
}

export interface Annotation {
  color: string,
  bounds: {x: number, y:number}[],
  editing: boolean,
  toolName: ToolNames,
}


// TODO write test for this function
function selectAnnotations(
  currentTools: Tool[],
  annotationsByTool: AnnotationsByTool,
  hiddenTools: string[],
  currentlyEditingShape: undefined | {
    toolName: ToolNames,
    toolId: string
  }
):Annotation[] {
  const mergeAnnotationsAndTools = (allAnnotations: Annotation[], {id, tool, color}: Tool):Annotation[] => {
    if (hiddenTools.indexOf(id) !== -1) {
      return allAnnotations;
    }

    const isShapeBeingEdited = currentlyEditingShape && tool === currentlyEditingShape.toolName && id === currentlyEditingShape.toolId;
    const annotations = annotationsByTool[id] ?
      annotationsByTool[id].map((bounds) => ({color, bounds, editing: Boolean(isShapeBeingEdited), toolName: tool})) :
      [];
    return [...allAnnotations, ...annotations];
  };
  return currentTools.reduce(mergeAnnotationsAndTools, []);
}

class App extends React.Component {
  public state: {
    imageInfo: {url: string, height: number, width: number} | undefined,
    currentToolId: string | undefined,
    annotationsByTool: AnnotationsByTool,
    hiddenTools: string[],
    currentlyEditingShape?: {
      toolName: ToolNames,
      toolId: string
    },
  } = {
    imageInfo: undefined,
    currentToolId: undefined,
    annotationsByTool: {},
    hiddenTools: [],
  };

  componentWillMount () {
    this.next();

    // TODO kinda of of a hack to have this function here
    const clickDeleteLastPoint = () => {
      const selector = '.leaflet-draw-actions a[title="Delete last point drawn"]';
      const undo: HTMLElement | null = document.querySelector(selector);
      if (undo) {
        undo.click();
      }
    };
    keyComboStream(['cmd', 'ctrl', 'space'], 'z').subscribe(clickDeleteLastPoint);

    keyDownSteam('space').subscribe(() => {
      this.setState({...this.state, currentToolId: undefined});
    });

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
      if (this.state.currentToolId === undefined) {
        throw new Error('should not be able to add an annotation without a tool');
      }
      this.setState({
        ...this.state,
        annotationsByTool: {
          ...this.state.annotationsByTool,
          [this.state.currentToolId]: [
            ...(this.state.annotationsByTool[this.state.currentToolId] || []),
            annotation
          ]
        }
      });
    };

    const toggleVisiblityOfTool = (toolId: string) => {
      const removeItem = (arr: string[], index: number) => [ ...arr.slice(0, index), ...arr.slice(index + 1) ];
      const currentHiddenTools = this.state.hiddenTools || [];
      const foundIndex = currentHiddenTools.indexOf(toolId);
      const hiddenTools = foundIndex === -1 ?
        [...currentHiddenTools, toolId] :
        removeItem(currentHiddenTools, foundIndex);

      this.setState({...this.state, hiddenTools});
    };

    const editShape = (toolName: ToolNames, index?: number) => {
      this.setState({
        ...this.state,
        currentlyEditingShape: toolName !== undefined && index !== undefined ? {toolName, index} : undefined
      });
    }

    const onAnnotationEdit = (toolName: ToolNames, annotationIndex: number, updatedValue: {x: number, y: number}[]) => {
      if (toolName === undefined){
        throw new Error('Cant edit a polygon that wasnt made with a tool');
      }
      // TODO need to make this an id
      // If someone make one annotation
      // make a second annotation
      // then delets the first one
      // updates the second one
      // This function will error bause the annotationIndex has changed
      // Thats why I should use an ID
      const tool = tools.find(({tool}) => tool === toolName);
      if (!tool) {
        throw new Error(`tool not found ${toolName}`);
      }
      this.setState({
        ...this.state,
        annotationsByTool: {
          ...this.state.annotationsByTool,
          [tool.id]: [
            ...this.state.annotationsByTool[tool.id].slice(0, annotationIndex),
            updatedValue,
            ...this.state.annotationsByTool[tool.id].slice(annotationIndex+1),
          ]
        }
      });
    };

    const currentTool = tools.find((tool) => tool.id === this.state.currentToolId);
    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div className="content">
            <div className="sidebar">
              <div className="header logo">Labelbox</div>
              <Toolbar
                tools={selectToolbarState(tools, this.state.annotationsByTool, this.state.hiddenTools)}
                currentTool={this.state.currentToolId}
                toolChange={(currentToolId: string) => this.setState({...this.state, currentToolId})}
                visibilityToggle={toggleVisiblityOfTool}
              />
            </div>
            <div className="labeling-frame">
              <div className="header">Outline all listed objects</div>
              <LabelingScreen
                imageInfo={this.state.imageInfo}
                annotations={selectAnnotations(tools, this.state.annotationsByTool, this.state.hiddenTools, this.state.currentlyEditingShape)}
                onSubmit={(label: string) => this.next(label)}
                drawColor={currentTool ? currentTool.color : undefined}
                onNewAnnotation={onNewAnnotation}
                selectedTool={currentTool ? currentTool.tool : undefined}
                editShape={editShape}
                isEditing={Boolean(this.state.currentlyEditingShape)}
                onAnnotationEdit={onAnnotationEdit}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
