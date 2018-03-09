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
`;

const Logo = styled.img`
  margin-left: 20px;
  margin-bottom: 30px;
  margin-right: 205px;
  width: 100px;
`;

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
  } = {
    loading: true,
    errorLoadingImage: false,
  };

  componentWillMount () {
    (window as any).Labelbox.currentAsset().subscribe((asset: Asset | undefined) => {
      if (!asset){
        return;
      }
      this.setState({
        imageUrl: asset.data,
        previousLabel: asset.previous,
        nextLabel: asset.next,
        label: readAsJson(asset.label),
      });
    });
  }

  next(submission?: {label?: Label, skip?: boolean}){
    this.setState({...this.state, loading: true});
    const getNext = () => {
      (window as any).Labelbox.fetchNextAssetToLabel()
    };
    if (!submission) {
      getNext();
    } else if (submission.label) {
      (window as any).Labelbox.setLabelForAsset(JSON.stringify(submission.label || '')).then(getNext);
    } else if (submission.skip) {
      (window as any).Labelbox.skip().then(getNext);
    }
  }

  setLabel(labelId: string){
    (window as any).Labelbox.setLabelAsCurrentAsset(labelId)
  }

  jumpToNextAsset(){
    (window as any).Labelbox.fetchNextAssetToLabel();
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
              hasNext={Boolean(this.state.nextLabel || this.state.label)}
              goNext={() => this.state.nextLabel ? this.setLabel(this.state.nextLabel) : this.jumpToNextAsset()}
              isCurrent={Boolean(!this.state.label)}
              goCurrent={() => this.jumpToNextAsset()}
            />
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
