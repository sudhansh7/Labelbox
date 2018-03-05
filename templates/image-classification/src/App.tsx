import * as React from 'react';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { LabelingScreen } from './labeling-screen/labeling-screen';
import { logo } from './logo';
import styled from 'styled-components';
import { History } from './history/history';

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

class App extends React.Component {
  public state: {
    label?: string;
    imageUrl?: string;
    previousLabel?: string;
    nextLabel?: string;
  } = {};

  componentWillMount () {
    this.next();
  }

  next(submission?: {label?: string, skip?: boolean}){
    const getNext = () => {
      (window as any).Labelbox.fetchNextAssetToLabel()
        .then((imageUrl: string) => this.setState({imageUrl}));
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
    console.log('setLabel', labelId);
  }

  jumpToNextAsset(){
    console.log('jumpToNextAsset');
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
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
            imageUrl={this.state && this.state.imageUrl}
            onSkip={() => this.next({skip: true})}
            onSubmit={(label: string) => this.next({label})}
          />
        </AppContainer>
      </MuiThemeProvider>
    );
  }
}

export default App;
