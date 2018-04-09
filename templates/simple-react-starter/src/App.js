import React, { Component } from 'react';
import Button from 'material-ui/Button';
import './App.css';
import { LabelingUI } from './LabelingUI';
import { LinearProgress } from 'material-ui/Progress';

import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';

export const primary = '#5495e3';
export const secondary = '#c1c1c1';
export const error = red['A700'];
export const textColor = '#5b5b5b';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary
    }
  }
});

const defaultState = {data: undefined, loading: true, label: undefined};
class App extends Component {
  state = defaultState;

  next(submission){
    this.setState(defaultState);
    const getNext = () => {
      window.Labelbox.fetchNextAssetToLabel();
    };
    if (!submission) {
      getNext();
    } else if (submission.label) {
      window.Labelbox.setLabelForAsset(JSON.stringify(submission.label || '')).then(getNext);
    } else if (submission.skip) {
      window.Labelbox.skip().then(getNext);
    }
  }

  componentWillMount(){
    window.Labelbox.currentAsset().subscribe((asset) => {
      if (!asset){
        this.setState({loading: true});
        return;
      }

      this.setState({data: asset.data, loading: false});
    });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <div>
            {this.state.loading && <LinearProgress/>}
            <div className="LabelingFrame">
              <LabelingUI label={this.state.label} data={this.state.data} onLabelUpdate={(label) => this.setState({...this.state, label})} />
              <div className="Divider"></div>
              <div className="ButtonBar">
                <Button onClick={() => this.next({skip: true})}>Skip</Button>
                <Button
                  variant="raised"
                  color="primary"
                  disabled={!this.state.label}
                  onClick={() => this.next({label: this.state.label})}
                >Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
