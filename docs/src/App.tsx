import * as React from 'react';
import styled from 'styled-components';
import { MuiThemeProvider } from 'material-ui/styles';
import { ImportingData } from './importing-data/importing-data';
import './icons.css';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';


const AppContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  height: 100vh;
`;

const Menu = styled.div`
  width: 260px;
  padding: 40px;
`;

const Left = styled.div`
  display: flex;
  flex: 35;
  background-color: #f8f8f9;
  justify-content: flex-end;
`;

const Right = styled.div`
  display: flex;
  flex: 65;
  background-color: white;
`;

const MainContent = styled.div`
  max-width: 860px;
  width: 100%;
  height: 100vh
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const primary = '#2195f3';
export const theme = createMuiTheme({
  palette: {
    primary: {
      ...lightblue,
      A700: primary,
    },
  },
});

class App extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <AppContainer>
          <Left>
            <Menu>
              <div>Tutorials</div>
              <div>Importing Data</div>
            </Menu>
          </Left>
          <Right>
            <MainContent>
              <ImportingData />
            </MainContent>
          </Right>
        </AppContainer>
      </MuiThemeProvider>
    );
  }
}

export default App;
