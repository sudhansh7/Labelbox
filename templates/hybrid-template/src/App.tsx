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
/* import { screenText } from './customization';*/
import { LinearProgress } from 'material-ui/Progress';
import {
  AppState,
  deleteSelectedAnnotation,
  deselectAllAnnotations,
  imageFinishedLoading,
  mouseMove,
  onNewAnnotation,
  removeTempBoundingBox,
  selectToolbarState,
  syncState,
  toggleVisiblityOfTool,
  updateAnnotation,
  userAnsweredClassification,
  userClickedSetTool,
} from './app.reducer';
import {
  selectIntentFromMapClick,
  selectAnnotationsFromLabel,
  selectLabelFromState,
} from './app.selectors';
import { BrokenImage } from './broken-image';
import { History } from './history/history';
import styled from 'styled-components';
import { LabelInformation } from './label-information';
import { getQueryParam } from './query-param';
import { dispatch } from './redux';
import { addId } from './utils/utils';

const Toolbar = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

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
    // TODO selectDoesStateHaveUnsavedChanges()
    const labelDerviedFromState = selectLabelFromState(state);
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

// TODO the goal is make this a function
// goint to be some code haha
class App extends React.Component {
  public props: {
    state: AppState
  };

  componentWillMount () {
    // TODO kinda of of a hack to have this function here
    // would love to have the drawing be rendered by state
    // not some dom click
    const undo = () => {
      if (this.props.state.currentToolId){

        const selector = '.leaflet-draw-actions a[title="Delete last point drawn"]';
        const undoElement: HTMLElement | null = document.querySelector(selector);
        if (undoElement) {
          undoElement.click();
        }
      } else {
        if (this.props.state.deletedAnnotations.length > 0) {
          dispatch(syncState({
            ...this.props.state,
            annotations: [
              ...this.props.state.annotations,
              this.props.state.deletedAnnotations[0]
            ],
            deletedAnnotations: [
              ...this.props.state.deletedAnnotations.slice(1)
            ]
          }))
        }
      }
    };

    keyComboStream(['cmd', 'ctrl'], 'z').subscribe(undo);
    keyDownSteam('e').subscribe(() => this.submit());
    keyDownSteam('a').subscribe(() => this.next({skip: true}));

    keyDownSteam('escape').subscribe(() => {
      // Turn off current tool and editing
      dispatch(syncState({
        ...deselectAllAnnotations(removeTempBoundingBox(this.props.state)),
        currentToolId: undefined
      }));
    });

    keyDownSteam('f').subscribe(() => {
      if (this.props.state.currentToolId) {
        dispatch(syncState(onNewAnnotation(this.props.state, this.props.state.drawnAnnotationBounds)));
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
        const tool = this.props.state.tools[parseInt(key, 10) - 1]
        if (tool){
          dispatch(userClickedSetTool(tool.id));
        }
      });

    keyDownSteam('del')
      .merge(keyDownSteam('backspace'))
      .subscribe(() => {
        dispatch(syncState(deleteSelectedAnnotation(this.props.state)));
      });

    getLabelbox().then((Labelbox: any) => {
      // TODO will probably need erro handleing here
      Labelbox.getTemplateCustomization()
        .subscribe((customization: any) => {
          if (customization.tools || customization.classifications) {
            dispatch(syncState({
              ...this.props.state,
              tools: customization.tools.map(addId),
              // TODO
              /* classifications: customization.classifications || []*/
            }));
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
          // TODO this is questionable
          dispatch(syncState({
            ...this.props.state,
            annotations: selectAnnotationsFromLabel(this.props.state, asset.label),
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
          // TODO the above state does not match AppState
          } as AppState))
        };
        getSizeOnImage(imageUrl).then(
          updateImageInfo,
          () => dispatch(syncState({...this.props.state, errorLoadingImage: imageUrl, loading: false}))
        );
      });
    });

    window.onbeforeunload = () => {
      if (this.props.state.annotations.length > 0 || this.props.state.currentToolId) {
        return "Are you sure that you want to leave this page?";
      } else {
        return
      }
    }
  }

  startLoading() {
    dispatch(syncState({
      ...this.props.state,
      loading: true,
      imageInfo: undefined
    }));
  }

  next(label: {label?: string, skip?: boolean}) {
    this.startLoading();
    getLabelbox().then((Labelbox) => {
      if (label.label) {
        // Yea wording is confusing here...
        // basically if we have a this.props.state.label it means the user
        // is reviewing the label and when they click submit they don't
        // want to jump all the way to the next asset
        // However, if they are labeling away when they click submit they should
        // indeed jump to the next asset
        const goToNextUnlabeledAsset = !this.props.state.label;
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
    if (!isSubmitDisabled(this.props.state)){
      this.next({label: selectLabelFromState(this.props.state)})
    }
  }

  setLabel(labelId: string){
    this.startLoading();
    getLabelbox().then((Labelbox) => {
      Labelbox.setLabelAsCurrentAsset(labelId)
    });
  }

  render() {
    console.log('Redux State', this.props.state);
    const onAnnotationEdit = (annotationId: string, newBounds: {lat: number, lng: number}[]) => {
      dispatch(syncState(updateAnnotation(this.props.state, annotationId, {geometry: newBounds})));
    };
    const currentTool = this.props.state.tools.find((tool) => tool.id === this.props.state.currentToolId);
    const isEditing = this.props.state.annotations.some(({editing}) => editing === true);
    const handleMapClick = (click: MapClick) => {
      const action = selectIntentFromMapClick(this.props.state, click);
      if (action) {
        dispatch(action);
      }
    }
    return (
      <MuiThemeProvider theme={theme}>
        {
          this.props.state.loading && <LinearProgress color="primary" style={{position: 'absolute', top: '0px', width: '100vw'}} />
        }
        <div className="app">
          <div className="content">
            <div className="sidebar">
              <a href={`https://app.labelbox.io/projects/${getQueryParam('project')}/overview`} style={{marginBottom: '30px'}}>
                <img src={logo} width="100px" style={{marginLeft: '30px'}}/>
              </a>
              <ToolMenu
                tools={selectToolbarState(this.props.state.tools, this.props.state.annotations, this.props.state.hiddenTools)}
                classificationFields={this.props.state.classificationFields}
                currentTool={this.props.state.currentToolId}
                toolChange={(toolId: string) => dispatch(userClickedSetTool(toolId))}
                visibilityToggle={(toolId: string) => dispatch(syncState(toggleVisiblityOfTool(this.props.state, toolId)))}
                disableSubmit={isSubmitDisabled(this.props.state)}
                onSubmit={() => this.submit()}
                onClassificationAnswer={(fieldId: string, answer: string | string[]) => dispatch(userAnsweredClassification(fieldId, answer))}
                onSkip={() => this.next({skip: true})}
                editing={Boolean(this.props.state.existingLabel)}
                onReset={() => this.props.state.label && dispatch(syncState({
                  ...this.props.state,
                  annotations: selectAnnotationsFromLabel(this.props.state, this.props.state.label)
                }))}
              />
            </div>
            <div className="labeling-frame">
              <Toolbar>
                <History
                  title="Outline listed objects"
                  hasBack={Boolean(this.props.state.previousLabel)}
                  goBack={() => this.props.state.previousLabel && this.setLabel(this.props.state.previousLabel)}
                  hasNext={Boolean(this.props.state.existingLabel)}
                  goNext={() => this.props.state.nextLabel ? this.setLabel(this.props.state.nextLabel) : this.jumpToNextAsset()}
                  isCurrent={Boolean(!this.props.state.existingLabel)}
                  goCurrent={() => this.jumpToNextAsset()}
                />
                {this.props.state.existingLabel && <LabelInformation {...this.props.state.existingLabel} />}
              </Toolbar>
              { this.props.state.errorLoadingImage && <BrokenImage imageUrl={this.props.state.errorLoadingImage} /> }
              {
                this.props.state.imageInfo ? <SegmentImage
                  imageUrl={this.props.state.imageInfo.url}
                  imageSize={this.props.state.imageInfo}
                  annotations={this.props.state.annotations.filter(({toolId}) => this.props.state.hiddenTools.indexOf(toolId) === -1)}
                  loading={this.props.state.loading}
                  onImageLoaded={() => dispatch(imageFinishedLoading())}
                  drawColor={currentTool ? currentTool.color : undefined}
                  selectedTool={currentTool ? currentTool.tool : undefined}
                  isEditing={isEditing}
                  onNewAnnotation={(bounds) => dispatch(syncState(onNewAnnotation(this.props.state, bounds)))}
                  onMouseMove={(move: MouseMove) => {
                    const updatedStateFromMouseMove = mouseMove(this.props.state, move);
                    if (updatedStateFromMouseMove){
                      dispatch(syncState(updatedStateFromMouseMove))
                    }
                  }}
                  onMapClick={handleMapClick}
                  onAnnotationEdit={onAnnotationEdit}
                  onDrawnAnnotationUpdate={(drawnAnnotationBounds: any) => dispatch(syncState({...this.props.state, drawnAnnotationBounds}))}
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
