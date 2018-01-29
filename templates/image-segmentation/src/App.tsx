// tslint:disable
import * as React from 'react';
import './App.css';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { SegmentImage } from './labeling-screen/segment-image';
import { Toolbar } from './toolbar/toolbar';
import { getSizeOnImage } from './utils/image-size';
import { ToolNames } from './labeling-screen/segment-image';
import { keyComboStream, keyDownSteam } from './key-binding-helpers';
import { logo } from './logo';
import { screenText } from './customization';
import { LinearProgress } from 'material-ui/Progress';
/* import { LatLng, Polygon } from 'leaflet';*/
import * as wkt from 'terraformer-wkt-parser';

export interface Annotation {
  id: string,
  color: string,
  bounds: {x: number, y:number}[],
  editing: boolean,
  toolName: ToolNames,
  toolId: string,
}

const updateAnnotation = (state: AppState, annotationId: string, fields: Partial<Annotation>): AppState => {
  const index = state.annotations.findIndex(({id}) => id === annotationId);
  if (index === undefined) {
    return state;
  }
  return {
    ...state,
    annotations: [
      ...state.annotations.slice(0, index),
      {
        ...state.annotations.find(({id}) => annotationId === id),
        ...fields
      } as Annotation,
      ...state.annotations.slice(index + 1),
    ]
  };
};


const editShape = (state: AppState, annotationId?: string) => {
  let updatedState = state.annotations.filter(({editing}) => editing)
    .reduce((appState, annotation) => updateAnnotation(appState, annotation.id, {editing: false}), state);

  if (annotationId) {
    updatedState = updateAnnotation(updatedState, annotationId, {editing: true})
  }

  return updatedState;
};


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

type Tool = {id: string, name: string, color: string, tool: ToolNames};

function selectToolbarState(currentTools: Tool[], annotations: Annotation[], hiddenTools: string[]) {
  return currentTools
    .map(({id, name, color, tool}) => {
      return {
        id,
        name,
        color,
        tool,
        count: annotations.filter(({toolId}) => toolId === id).length,
        visible: hiddenTools.indexOf(id) === -1
      };
    });
}

interface AppState {
  imageInfo: {url: string, height: number, width: number} | undefined,
  currentToolId: string | undefined,
  annotations: Annotation[],
  hiddenTools: string[],
  deletedAnnotations: Annotation[],
  loading: boolean,
  tools: Tool[]
}

const defaultState = {
  loading: true,
  imageInfo: undefined,
  currentToolId: undefined,
  annotations: [],
  hiddenTools: [],
  deletedAnnotations: [],
  tools: []
};

const addId = (item: any) => ({id: guid(), ...item});

class App extends React.Component {
  public state: AppState = {
    ...defaultState,
    tools: screenText.tools.map(addId) as Tool[]
  };

  componentWillMount () {
    this.next();

    // TODO kinda of of a hack to have this function here
    const undo = () => {
      if (this.state.currentToolId){

        const selector = '.leaflet-draw-actions a[title="Delete last point drawn"]';
        const undo: HTMLElement | null = document.querySelector(selector);
        if (undo) {
          undo.click();
        }
      } else {
        if (this.state.deletedAnnotations.length > 0) {
          this.setState({
            ...this.state,
            annotations: [
              ...this.state.annotations,
              this.state.deletedAnnotations[0]
            ],
            deletedAnnotations: [
              ...this.state.deletedAnnotations.slice(1)
            ]
          });
        }
      }


    };

    keyComboStream(['cmd', 'ctrl'], 'z').subscribe(undo);

    keyDownSteam('escape').subscribe(() => {
      // Turn off current tool and editing
      this.setState({...editShape(this.state), currentToolId: undefined});
    });

    keyDownSteam('del').subscribe(() => {
      const deleteAnnotationIndex = this.state.annotations.findIndex(({editing}) => editing === true);
      if (deleteAnnotationIndex !== undefined) {
        this.setState({
          ...this.state,
          annotations: [
            ...this.state.annotations.slice(0, deleteAnnotationIndex),
            ...this.state.annotations.slice(deleteAnnotationIndex + 1),
          ],
          deletedAnnotations: [
            {...this.state.annotations[deleteAnnotationIndex], editing: false},
            ...this.state.deletedAnnotations
          ]
        });
      }
    });

    // TODO will probably need erro handleing here
    (window as any).Labelbox.getTemplateCustomization()
      .subscribe((customization: any) => {
        this.setState({defaultState, tools: customization.tools.map(addId)});
      });

    window.onbeforeunload = () => {
      if (this.state.annotations.length > 0 || this.state.currentToolId) {
        return "Are you sure that you want to leave this page?";
      } else {
        return
      }
    }
  }

  next(label?: string) {
    const getNext = () => {
      // tslint:disable-next-line
      (window as any).Labelbox.fetchNextAssetToLabel()
        .then((imageUrl: string) => {
          this.setState({...this.state, loading: true});
          const updateImageInfo = ({height, width}: {height: number, width: number}) => {
            this.setState({
              ...defaultState,
              tools: this.state.tools,
              imageInfo: {width, height, url: imageUrl},
              loading: false,
            });
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
    const onNewAnnotation = (bounds: {x: number, y: number}[]) => {
      const currentTool = this.state.tools.find(({id}) => id === this.state.currentToolId);
      if (currentTool === undefined) {
        throw new Error('should not be able to add an annotation without a tool');
      }
      this.setState({
        ...this.state,
        currentToolId: undefined,
        annotations: [
          ...this.state.annotations,
          {
            id: guid(),
            bounds,
            color: currentTool.color,
            editing: false,
            toolName: currentTool.tool,
            toolId: currentTool.id
          }
        ]
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


    const onAnnotationEdit = (annotationId: string, newBounds: {x: number, y: number}[]) => {
      this.setState(updateAnnotation(this.state, annotationId, {bounds: newBounds}));


    };

    const submit = () => {
      /* const toLatLngs = ({bounds}:Annotation) => bounds.map(({x, y}) => new LatLng(y, x));*/
      /* const latLngs = this.state.annotations.map(toLatLngs);*/
      /* const geoJson = new (Polygon as any)(...latLngs).toGeoJSON();*/
      /* console.log(geoJson);*/

      /* const annotationsTo*/

      const getPoints = ({bounds}: Annotation) => bounds.map(({x, y}) => [y, x]);

      const turnAnnotationsIntoWktString = (annotations: Annotation[]) => {
        return wkt.convert({
          "type": "Polygon",
          "coordinates": this.state.annotations.map(getPoints)
        });
      };

      const annotationsByTool = this.state.annotations.reduce((annotationsByTool, annotation) => {
        if (!annotationsByTool[annotation.toolId]) {
          annotationsByTool[annotation.toolId] = []
        }

        return {
          ...annotationsByTool,
          [annotation.toolId]: [
            ...annotationsByTool[annotation.toolId],
            annotation
          ]
        };
      }, {})

      const label = Object.keys(annotationsByTool).reduce((label, toolId) => {
        const tool = this.state.tools.find(({id}) => id === toolId);
        if (!tool) {
          throw new Error('tool not foudn' + toolId);
        }
        return {
          ...label,
          [tool.name]: turnAnnotationsIntoWktString(annotationsByTool[toolId])
        }
      }, {})

      console.log(label);

      /* this.tools.reduce((label, {id, tool}) => {*/
      /* */
      /* })*/

      /* turnAnnotationsIntoWktString*/

      /* [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],*/
      /* [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]*/

      /* const result = wkx.Geometry.parseGeoJSON(geoJson);*/
      /* console.log(geoJson, wkt);*/
      /* wkt*/
      /* const result = (window as any).Terraformer.WKT.convert(geoJson);*/
      /* console.log(result);*/
      /* this.next(JSON.stringify());*/
    }

    const currentTool = this.state.tools.find((tool) => tool.id === this.state.currentToolId);
    const isEditing = this.state.annotations.some(({editing}) => editing === true);
    return (
      <MuiThemeProvider theme={theme}>
        {
          this.state.loading && <LinearProgress color="primary" style={{position: 'absolute', top: '0px', width: '100vw'}} />
        }
        <div className="app">
          <div className="content">
            <div className="sidebar">
              <div className="header logo">
                <img src={logo} width="100px" />
              </div>
              <Toolbar
                tools={selectToolbarState(this.state.tools, this.state.annotations, this.state.hiddenTools)}
                currentTool={this.state.currentToolId}
                toolChange={(currentToolId: string) => this.setState({...editShape(this.state), currentToolId})}
                visibilityToggle={toggleVisiblityOfTool}
                disableSubmit={this.state.annotations.length === 0}
                onSubmit={() => submit()}
              />
            </div>
            <div className="labeling-frame">
              <div className="header" style={{fontWeight: '100'} as any}>Outline all listed objects</div>
              {
                this.state.imageInfo && <SegmentImage
                  imageUrl={this.state.imageInfo.url}
                  imageSize={this.state.imageInfo}
                  annotations={this.state.annotations.filter(({toolId}) => this.state.hiddenTools.indexOf(toolId) === -1)}
                  drawColor={currentTool ? currentTool.color : undefined}
                  onNewAnnotation={onNewAnnotation}
                  selectedTool={currentTool ? currentTool.tool : undefined}
                  editShape={(annotationId?: string) => this.setState(editShape(this.state, annotationId))}
                  isEditing={isEditing}
                  onAnnotationEdit={onAnnotationEdit}
                />
              }
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
