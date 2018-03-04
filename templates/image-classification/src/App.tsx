import * as React from 'react';
import './App.css';
import './icons.css';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { LabelingScreen } from './labeling-screen/labeling-screen';

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
    imageUrl?: string;
  };

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
      (window as any).Labelbox.setLabelForAsset(submission.label).then(getNext);
    } else if (submission.skip) {
      (window as any).Labelbox.skip().then(getNext);
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div className="banner">
            <div>Labelbox</div>
          </div>
          <div className="labeling-frame">
            <LabelingScreen
              imageUrl={this.state && this.state.imageUrl}
              onSkip={() => this.next({skip: true})}
              onSubmit={(label: string) => this.next({label})}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
