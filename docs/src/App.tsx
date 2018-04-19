import * as React from 'react';
import styled from 'styled-components';
import { ImportingData } from './importing-data/importing-data';


const AppContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  height: 100vh;
`;

// const Content = styled.div`
//   display: flex;
//   width: 980px;
// `;

// const MainContent = styled.div`
//   display: flex;
//   width: 980px;
// `;

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
`;

class App extends React.Component {
  public render() {
    return (
      <AppContainer>
        <Left>
          <Menu>
            <div>Tutorials</div>
            <div>Importing Data</div>
          </Menu>
        </Left>
        <Right>
          <ImportingData />
        </Right>
      </AppContainer>
    );
  }
}

        // <Content>
        //   <Sidebar>
        //   </Sidebar>
        //   <div>
        //     Content Here
        //   </div>
        // </Content>

export default App;
