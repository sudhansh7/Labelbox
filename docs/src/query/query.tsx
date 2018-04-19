import * as React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import './query.css'
import Icon from 'material-ui/Icon';
import { GetQueryAsPython } from './get-query-as-python';
import { GetQueryAsCurl } from './get-query-as-curl';

import styled from 'styled-components';

const GetCodeButton = styled.div`
  background-color: #b6bbbf;
  padding: 10px;
  margin-right: 10px;
  opacity: 0.75;
  font-size: 12px;
  cursor: pointer;
`;


function graphQLFetcher(graphQLParams: any) {
  return fetch('https://api.labelbox.io/graphql', {
    method: 'post',
    headers: {
      // TODO improve auth here
      'Authorization': 'Bearer ' + localStorage.getItem('labelbox-jwt'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

export class Query extends React.Component {
  public state = {
    showQueryInPython: false,
    showQueryAsCurl: false,
  }
  public props: { query: string};
  private ref: any;

  render(){
    const { query } = this.props;

    return (
      <div>
        {this.state.showQueryInPython && (<GetQueryAsPython onClose={() => this.setState({...this.state, showQueryInPython: false})} query={query} />)}
        {this.state.showQueryAsCurl && (<GetQueryAsCurl onClose={() => this.setState({...this.state, showQueryAsCurl: false})} query={query} />)}
        <div style={{display: 'flex', flexGrow: 1, position: 'relative', height: '300px'}} ref={(e) => this.ref = e}>
          <Icon onClick={() => this.ref.querySelector('.execute-button').click()} style={{
            color: '#b6bbbf',
            fontSize: '40px',
            zIndex: 100,
            position:'absolute',
            marginLeft: 'calc(50% - 50px)',
            cursor: 'pointer',
            paddingTop: '5px'
          }}>play_circle_filled</Icon>
          <div style={{position: 'absolute', bottom: '15px', marginLeft: 'calc(50% - 125px)', zIndex: 100, color: 'white'}}>
            <div style={{display: 'flex'}}>
              <GetCodeButton onClick={() => this.setState({...this.state, showQueryInPython: true})}>
                Python
              </GetCodeButton>
              <GetCodeButton onClick={() => this.setState({...this.state, showQueryAsCurl: true})}>
                Curl
              </GetCodeButton>
            </div>
          </div>
          <GraphiQL fetcher={graphQLFetcher} query={query} />
        </div>
      </div>
    );
  }
}
