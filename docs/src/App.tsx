import * as React from 'react';
import Icon from 'material-ui/Icon';
import styled from 'styled-components';
import { MuiThemeProvider } from 'material-ui/styles';
import { ImportingData } from './pages/importing-data';
import './app.css';
import './icons.css';
import { createMuiTheme } from 'material-ui/styles';
import lightblue from 'material-ui/colors/blue';
import { logo } from './logo';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom'
import  { ExportTutorial } from './pages/export-tutorial';
import { AppState } from './redux/index';
import { Provider } from 'react-redux';

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
  flex-direction: column;
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

function Content({state}:{state: AppState}){
  if (!(window.location.pathname === '/import' || window.location.pathname === '/export')) {
    return (<Redirect to="/import" />);
  }
  return (
    <MainContent>
      <Route path="/import" component={() => <ImportingData state={state} /> }/>
      <Route path="/export" component={ExportTutorial}/>
    </MainContent>
  )
}

function MenuItem({name, to}:{name: string, to: string}){
  return (
    <Link style={{display: 'flex', marginBottom: '10px', textDecoration: 'none', color: 'inherit'}} to={to}>
      <div style={{flex: 15}}></div>
      <div style={{flex: 85}}>{name}</div>
    </Link>
  )
}

class App extends React.Component {
  public props: {store: any}

  render() {
    return (
      <Provider store={this.props.store}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <AppContainer>
              <Left>
                <Menu>
                  <img src={logo} width="140px" style={{marginBottom: '40px'}} />
                  <MenuTitle>
                    <Icon style={{flex: 15, color: 'grey'}}>local_library</Icon>
                    <div style={{flex: 85}}>Tutorials </div>
                  </MenuTitle>
                  <MenuSubsection>
                    <MenuItem name="Importing Data" to="/import" />
                    <MenuItem name="Exporting Data" to="/export" />
                  </MenuSubsection>
                </Menu>
              </Left>
              <Right>
                <Content state={this.props.store.getState()} />
              </Right>
            </AppContainer>
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
