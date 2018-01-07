import React, { Component } from 'react';
import './App.css';
import ClassificationForm from './classification-options';
import Button from 'material-ui/Button';
import { MuiThemeProvider } from 'material-ui/styles';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
export const primary = '#5495e3';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div className="content">

            <div className="labeling-frame">
              <div>
                <img src="https://electrek.files.wordpress.com/2016/06/tesla-model-3-silver-prototype-promo-shot-headlands.jpg?quality=82&strip=all&w=1600" alt="classify-data" />
              </div>
              <div className="form-controls">
                <div className="classification">
                  <ClassificationForm />
                </div>
                <div className="form-buttons">
                  <Button>Skip</Button>
                  <Button raised={true} color="primary">Submit</Button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
