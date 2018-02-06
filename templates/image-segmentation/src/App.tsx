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
import { keyComboStream, keyDownSteam } from './key-binding-helpers';
import { logo } from './logo';
import { screenText } from './customization';
import { LinearProgress } from 'material-ui/Progress';
import {
  AppState,
  Tool,
  guid,
  toggleVisiblityOfTool,
  onNewAnnotation,
  deleteSelectedAnnotation,
  generateLabel,
  selectToolbarState,
  updateAnnotation,
  editShape
} from './app.reducer';
import { BrokenImage } from './broken-image';

export const primary = '#5495e3';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary
    }
  }
});

const defaultState = {
  loading: true,
  imageInfo: undefined,
  currentToolId: undefined,
  annotations: [],
  drawnAnnotationBounds: [],
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
    // would love to have the drawing be rendered by state
    // not some dom click
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

    keyDownSteam('enter').subscribe(() => {
      if (this.state.currentToolId) {
        this.setState(onNewAnnotation(this.state, this.state.drawnAnnotationBounds))
      }
    });

    keyDownSteam('del').subscribe(() => {
      this.setState(deleteSelectedAnnotation(this.state));
    });

    // TODO will probably need erro handleing here
    (window as any).Labelbox.getTemplateCustomization()
      .subscribe((customization: any) => {
        if (customization.tools) {
          this.setState({defaultState, tools: customization.tools.map(addId)});
        }
      });

    window.onbeforeunload = () => {
      if (this.state.annotations.length > 0 || this.state.currentToolId) {
        return "Are you sure that you want to leave this page?";
      } else {
        return
      }
    }
  }

  next(label?: {label?: string, skip?: boolean}) {
    const getNext = () => {
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
          getSizeOnImage(imageUrl).then(
            updateImageInfo,
            () => this.setState({...this.state, errorLoadingImage: imageUrl, loading: false})
          );
        });
    };
    if (!label) {
      getNext();
    } else if (label.label) {
      (window as any).Labelbox.setLabelForAsset(label.label).then(getNext);
    } else if (label.skip) {
      (window as any).Labelbox.skip().then(getNext);
    }
  }

  render() {
    const onAnnotationEdit = (annotationId: string, newBounds: {lat: number, lng: number}[]) => {
      this.setState(updateAnnotation(this.state, annotationId, {bounds: newBounds}));
    };

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
                visibilityToggle={(toolId: string) => this.setState(toggleVisiblityOfTool(this.state, toolId))}
                disableSubmit={this.state.annotations.length === 0}
                onSubmit={() => this.next({label: generateLabel(this.state)})}
                onSkip={() => this.next({skip: true})}
              />
            </div>
            <div className="labeling-frame">
              <div className="header" style={{fontWeight: '100'} as any}>Outline all listed objects</div>
              { this.state.errorLoadingImage && <BrokenImage imageUrl={this.state.errorLoadingImage} /> }
              {
                this.state.imageInfo && <SegmentImage
                  imageUrl={this.state.imageInfo.url}
                  imageSize={this.state.imageInfo}
                  annotations={this.state.annotations.filter(({toolId}) => this.state.hiddenTools.indexOf(toolId) === -1)}
                  drawColor={currentTool ? currentTool.color : undefined}
                  onNewAnnotation={(bounds) => this.setState(onNewAnnotation(this.state, bounds))}
                  selectedTool={currentTool ? currentTool.tool : undefined}
                  editShape={(annotationId?: string) => this.setState(editShape(this.state, annotationId))}
                  isEditing={isEditing}
                  onAnnotationEdit={onAnnotationEdit}
                  onDrawnAnnotationUpdate={(drawnAnnotationBounds) => this.setState({...this.state, drawnAnnotationBounds})}
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
