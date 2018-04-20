import * as React from 'react';
import Icon from 'material-ui/Icon';
import styled from 'styled-components';
import { MuiThemeProvider } from 'material-ui/styles';
import { ImportingData } from './importing-data/importing-data';
import './app.css';
import './icons.css';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { logo } from './logo';


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
  font-weight: 300;
  display: flex;
  flex: 20;
  background-color: #f8f8f9;
  justify-content: flex-end;
`;

const Right = styled.div`
  display: flex;
  flex: 80;
  background-color: white;
  overflow-y: auto;
`;

const MainContent = styled.div`
  max-width: 860px;
  width: 100%;
  padding: 40px;
  font-weight: 300;
`;

const MenuTitle = styled.div`
  font-size: 20px;
  display: flex;
`;

const MenuSubsection = styled.div`
  display: flex;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 3px;
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
              <img src={logo} width="140px" style={{marginBottom: '40px'}} />
              <MenuTitle>
                <Icon style={{flex: 15, color: 'grey'}}>local_library</Icon>
                <div style={{flex: 85}}>Tutorials </div>
              </MenuTitle>
              <MenuSubsection>
                <div style={{flex: 15}}></div>
                <div style={{flex: 85}}>Importing Data</div>
              </MenuSubsection>
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
