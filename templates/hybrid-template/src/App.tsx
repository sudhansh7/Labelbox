// tslint:disable
import * as React from 'react';
import './App.css';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { SegmentImage, MapClick, MouseMove } from './labeling-screen/segment-image';
import { ToolMenu } from './toolbar/toolbar';
import { getSizeOnImage } from './utils/image-size';
import { keyComboStream, keyDownSteam } from './key-binding-helpers';
import { logo } from './logo';
import { screenText } from './customization';
import { LinearProgress } from 'material-ui/Progress';
import {
  AppState,
  guid,
  toggleVisiblityOfTool,
  onNewAnnotation,
  deleteSelectedAnnotation,
  generateLabel,
  selectToolbarState,
  updateAnnotation,
  editShape,
  userClickedMap,
  mouseMove,
  generateAnnotationsFromLabel,
  removeTempBoundingBox,
} from './app.reducer';
import { BrokenImage } from './broken-image';
import { History } from './history/history';
import styled from 'styled-components';
import { LabelInformation } from './label-information';
import { getQueryParam } from './query-param';

const Toolbar = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

interface Asset {
  id: string,
  data: string,
  label: string,
  next?: string,
  previous?: string,
  typeName?: string,
  createdBy?: string,
  createdAt?: string,
}

function hasUserChangedLabel(state: AppState){
  if (state.label) {
    // We dont set this.state.label until the user clicks confirm
    const labelDerviedFromState = generateLabel(state);
    if (state.label === 'Skip' && labelDerviedFromState === '{}'){
      return false;
    }
    if (state.label !== labelDerviedFromState) {
      return true;
    }
  }

  // TODO I dont like that state.label isn't saved until we sumbit
  if (!state.label && state.annotations.length > 0) {
    return true;
  }

  return false;
}

function isSubmitDisabled(state: AppState){
  return state.loading || !hasUserChangedLabel(state);
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

const defaultState = {
  loading: true,
  imageInfo: undefined,
  currentToolId: undefined,
  annotations: [],
  drawnAnnotationBounds: [],
  hiddenTools: [],
  deletedAnnotations: [],
  tools: [],
  classifications: [],
};

// I load the script async
const getLabelbox = ():Promise<any> => {
  if ((window as any).Labelbox){
    return Promise.resolve((window as any).Labelbox);
  } else {
    return new Promise((resolve) => {
      (window as any).document.getElementById('labelbox-script').addEventListener('load', () => {
        resolve((window as any).Labelbox);
      });
    });
  }
}

const addId = (item: any) => ({id: guid(), ...item});

class App extends React.Component {
  public state: AppState = {
    ...defaultState,
    tools: screenText.tools.map(addId)
  };

  componentWillMount () {
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
    keyDownSteam('e').subscribe(() => this.submit());
    keyDownSteam('a').subscribe(() => this.next({skip: true}));

    keyDownSteam('escape').subscribe(() => {
      // Turn off current tool and editing
      this.setState({...editShape(removeTempBoundingBox(this.state)), currentToolId: undefined});
    });

    keyDownSteam('f').subscribe(() => {
      if (this.state.currentToolId) {
        this.setState(onNewAnnotation(this.state, this.state.drawnAnnotationBounds))
      }
    });

    keyDownSteam('1')
      .merge(keyDownSteam('2'))
      .merge(keyDownSteam('3'))
      .merge(keyDownSteam('4'))
      .merge(keyDownSteam('5'))
      .merge(keyDownSteam('6'))
      .merge(keyDownSteam('7'))
      .merge(keyDownSteam('8'))
      .merge(keyDownSteam('9'))
      .merge(keyDownSteam('0'))
      .subscribe((key) => {
        const tool = this.state.tools[parseInt(key) - 1]
        if (tool){
          this.setTool(tool.id);
        }
      });

    keyDownSteam('del')
      .merge(keyDownSteam('backspace'))
      .subscribe(() => {
        this.setState(deleteSelectedAnnotation(this.state));
      });

    getLabelbox().then((Labelbox: any) => {
      // TODO will probably need erro handleing here
      Labelbox.getTemplateCustomization()
        .subscribe((customization: any) => {
          if (customization.tools) {
            this.setState({
              ...this.state,
              tools: customization.tools.map(addId),
              classifications: customization.tools
            });
          }
        });
      const preloadFunction = (asset: Asset) => {
        const loadImageInDom = (url: string) => {
          return new Promise((resolve) => {
            const img = document.createElement('img');
            img.src = url;
            img.onload = () => {
              img.remove();
              resolve();
            };
            img.style.display = 'none',
            img.style.width = '0px',
            img.style.height = '0px',
            document.body.appendChild(img);
          });
        }
        return Promise.all([getSizeOnImage(asset.data), loadImageInDom(asset.data)]);
      }

      Labelbox.enablePreloading({preloadFunction})
    })

    getLabelbox().then((Labelbox: any) => {
      Labelbox.currentAsset().subscribe((asset: Asset | undefined) => {
        // TODO this this should probably be the signal for all start loading
        if (!asset){
          this.startLoading();
          return;
        }

        const imageUrl = asset.data;

        this.startLoading();
        const updateImageInfo = ({height, width}: {height: number, width: number}) => {
          const stateWithTools = {
            ...defaultState,
            tools: this.state.tools,
          };
          const annotations = generateAnnotationsFromLabel(stateWithTools, asset.label);
          this.setState({
            annotations: annotations,
            imageInfo: {width, height, url: imageUrl},
            previousLabel: asset.previous,
            nextLabel: asset.next,
            label: asset.label,
            ... asset.createdAt ?
              {
                existingLabel: {
                  typeName: asset.typeName,
                  createdBy: asset.createdBy,
                  createdAt: asset.createdAt,
                }
              } :
              {
                existingLabel: undefined
              },
          })
        };
        getSizeOnImage(imageUrl).then(
          updateImageInfo,
          () => this.setState({...this.state, errorLoadingImage: imageUrl, loading: false})
        );
      });
    });

    window.onbeforeunload = () => {
      if (this.state.annotations.length > 0 || this.state.currentToolId) {
        return "Are you sure that you want to leave this page?";
      } else {
        return
      }
    }



  }

  startLoading() {
    this.setState({
      ...this.state,
      loading: true,
      imageInfo: undefined
    });
  }

  next(label: {label?: string, skip?: boolean}) {
    this.startLoading();
    getLabelbox().then((Labelbox) => {
      if (label.label) {
        // Yea wording is confusing here...
        // basically if we have a this.state.label it means the user
        // is reviewing the label and when they click submit they don't
        // want to jump all the way to the next asset
        // However, if they are labeling away when they click submit they should
        // indeed jump to the next asset
        const goToNextUnlabeledAsset = !this.state.label;
        Labelbox.setLabelForAsset(label.label, 'Any').then(() => {
          if (goToNextUnlabeledAsset){
            this.jumpToNextAsset();
          }
        });
      } else if (label.skip) {
        Labelbox.skip().then(() => this.jumpToNextAsset());
      } else {
        console.error('Next called with no label', label);
      }
    })
  }

  jumpToNextAsset(){
    this.startLoading();
    getLabelbox().then((Labelbox) => {
      Labelbox.fetchNextAssetToLabel();
    });
  }

  submit(){
    if (!isSubmitDisabled(this.state)){
      this.next({label: generateLabel(this.state)})
    }
  }

  setTool(toolId: string) {
    this.setState({...editShape(this.state), currentToolId: toolId});
  }

  setLabel(labelId: string){
    this.startLoading();
    getLabelbox().then((Labelbox) => {
      Labelbox.setLabelAsCurrentAsset(labelId)
    });
  }

  render() {
    const onAnnotationEdit = (annotationId: string, newBounds: {lat: number, lng: number}[]) => {
      this.setState(updateAnnotation(this.state, annotationId, {geometry: newBounds}));
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
              <a href={`https://app.labelbox.io/projects/${getQueryParam('project')}/overview`} style={{marginBottom: '30px'}}>
                <img src={logo} width="100px" style={{marginLeft: '30px'}}/>
              </a>
              <ToolMenu
                tools={selectToolbarState(this.state.tools, this.state.annotations, this.state.hiddenTools)}
                classifications={this.state.classifications}
                currentTool={this.state.currentToolId}
                toolChange={(toolId: string) => this.setTool(toolId)}
                visibilityToggle={(toolId: string) => this.setState(toggleVisiblityOfTool(this.state, toolId))}
                disableSubmit={isSubmitDisabled(this.state)}
                onSubmit={() => this.submit()}
                onSkip={() => this.next({skip: true})}
                editing={Boolean(this.state.existingLabel)}
                onReset={() => this.state.label && this.setState({
                  ...this.state,
                  annotations: generateAnnotationsFromLabel(this.state, this.state.label)
                })}
              />
            </div>
            <div className="labeling-frame">
              <Toolbar>
                <History
                  title="Outline listed objects"
                  hasBack={Boolean(this.state.previousLabel)}
                  goBack={() => this.state.previousLabel && this.setLabel(this.state.previousLabel)}
                  hasNext={Boolean(this.state.existingLabel)}
                  goNext={() => this.state.nextLabel ? this.setLabel(this.state.nextLabel) : this.jumpToNextAsset()}
                  isCurrent={Boolean(!this.state.existingLabel)}
                  goCurrent={() => this.jumpToNextAsset()}
                />
                {this.state.existingLabel && <LabelInformation {...this.state.existingLabel} />}
              </Toolbar>
              { this.state.errorLoadingImage && <BrokenImage imageUrl={this.state.errorLoadingImage} /> }
              {
                this.state.imageInfo ? <SegmentImage
                  imageUrl={this.state.imageInfo.url}
                  imageSize={this.state.imageInfo}
                  annotations={this.state.annotations.filter(({toolId}) => this.state.hiddenTools.indexOf(toolId) === -1)}
                  loading={this.state.loading}
                  onImageLoaded={() => this.setState({...this.state, loading: false})}
                  drawColor={currentTool ? currentTool.color : undefined}
                  selectedTool={currentTool ? currentTool.tool : undefined}
                  isEditing={isEditing}
                  onNewAnnotation={(bounds) => this.setState(onNewAnnotation(this.state, bounds))}
                  onMouseMove={(move: MouseMove) => {
                    const updatedStateFromMouseMove = mouseMove(this.state, move);
                    if (updatedStateFromMouseMove){
                      this.setState(updatedStateFromMouseMove)
                    }
                  }}
                  onMapClick={(e: MapClick) => this.setState(userClickedMap(this.state, e))}
                  onAnnotationEdit={onAnnotationEdit}
                  onDrawnAnnotationUpdate={(drawnAnnotationBounds: any) => this.setState({...this.state, drawnAnnotationBounds})}
                /> : <div style={{opacity: 0.6, height: '100%', widht: '100%', backgroundColor: '#dddddd'}}></div>
              }
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
