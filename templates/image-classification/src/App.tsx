import * as React from 'react';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { Label } from './labeling-screen/classification-options';
import { LabelingScreen } from './labeling-screen/labeling-screen';
import { logo } from './logo';
import styled from 'styled-components';
import { History } from './history/history';
import { LinearProgress } from 'material-ui/Progress';
import { LabelInformation } from './label-information';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  height: 90vh;
  padding-top: 5vh;
  padding-bottom: 5vh;
`;

const Header = styled.div`
  display: flex;
  height: 50px;
  margin-right: 5vw;
`;

const Logo = styled.img`
  margin-left: 20px;
  margin-bottom: 30px;
  margin-right: 205px;
  width: 100px;
`;

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


export const primary = '#5495e3';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary
    }
  }
});

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


const readAsJson = (str?: string) => {
  if (typeof str !== 'string'){
    return;
  }
  try{
    return JSON.parse(str);
  } catch(e){
    return;
  }
}

class App extends React.Component {
  public state: {
    label?: Label;
    imageUrl?: string;
    previousLabel?: string;
    nextLabel?: string;
    loading: boolean;
    errorLoadingImage: boolean;
    existingLabel?: {
      typeName: 'Any' | 'Skip',
      createdBy: string,
      createdAt: string,
    };
  } = {
    loading: true,
    errorLoadingImage: false,
  };

  componentWillMount () {
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
      return loadImageInDom(asset.data);
    }

    getLabelbox().then((Labelbox) => {
      Labelbox.enablePreloading({preloadFunction});
      Labelbox.currentAsset().subscribe((asset: Asset | undefined) => {
        if (!asset){
          return;
        }
        this.setState({
          imageUrl: asset.data,
          previousLabel: asset.previous,
          nextLabel: asset.next,
          label: readAsJson(asset.label),
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
        });
      });
    })
  }

  next(submission?: {label?: Label, skip?: boolean}){
    this.setState({...this.state, loading: true});
    getLabelbox().then((Labelbox) => {
      const getNext = () => {
        Labelbox.fetchNextAssetToLabel()
      };
      if (!submission) {
        getNext();
      } else if (submission.label) {
        Labelbox.setLabelForAsset(JSON.stringify(submission.label || '')).then(getNext);
      } else if (submission.skip) {
        Labelbox.skip().then(getNext);
      }
    })
  }

  setLabel(labelId: string){
    getLabelbox().then((Labelbox) => Labelbox.setLabelAsCurrentAsset(labelId));
  }

  jumpToNextAsset(){
    getLabelbox().then((Labelbox) => Labelbox.fetchNextAssetToLabel());
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {this.state.loading && (<LinearProgress color="primary" />)}
        <AppContainer>
          <Header>
            <Logo src={logo} />
            <History
              title="Classify Image"
              hasBack={Boolean(this.state.previousLabel)}
              goBack={() => this.state.previousLabel && this.setLabel(this.state.previousLabel)}
              hasNext={Boolean(this.state.existingLabel)}
              goNext={() => this.state.nextLabel ? this.setLabel(this.state.nextLabel) : this.jumpToNextAsset()}
              isCurrent={Boolean(!this.state.existingLabel)}
              goCurrent={() => this.jumpToNextAsset()}
            />
            <div style={{display: 'flex', flexGrow: '1'} as any}></div>
            {this.state.existingLabel && <LabelInformation {...this.state.existingLabel} />}
          </Header>
          <LabelingScreen
            loading={this.state.loading}
            errorLoadingImage={this.state.errorLoadingImage}
            label={this.state.label}
            imageUrl={this.state && this.state.imageUrl}
            onLabelUpdate={(label: Label) => this.setState({...this.state, label})}
            onSkip={() => this.next({skip: true})}
            onSubmit={() => this.next({label: this.state.label})}
            onImageLoad={() => this.setState({...this.state, loading: false})}
            onErrorLoadingImage={() => this.setState({...this.state, loading: false, errorLoadingImage: true})}
          />
        </AppContainer>
      </MuiThemeProvider>
    );
  }
}

export default App;
