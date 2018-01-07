import React, { Component } from 'react';
import './App.css';
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

class App extends Component {

  // The embedded api script will soon be a npm package
  componentWillMount () {
    const script = document.createElement("script");
    script.src = "https://labeling-api-nmntfiowht.now.sh";
    script.async = true;
    script.onload = () => {
      console.log(window.Labelbox);
    };
    document.body.appendChild(script);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="app">
          <div className="content">
            <div className="labeling-frame">
              <LabelingScreen imageUrl={"https://electrek.files.wordpress.com/2016/06/tesla-model-3-silver-prototype-promo-shot-headlands.jpg?quality=82&strip=all&w=1600"}/>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
