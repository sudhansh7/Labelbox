import * as React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import './query.css'
import Icon from 'material-ui/Icon';

function graphQLFetcher(graphQLParams: any) {
  return fetch('https://api.labelbox.io/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

export class Query extends React.Component {
  public props: { query: string};
  private ref: any;
  render(){
    const { query } = this.props;

    return (
      <div style={{display: 'flex', flexGrow: 1, position: 'relative'}} ref={(e) => this.ref = e}>
        <Icon onClick={() => this.ref.querySelector('.execute-button').click()} style={{
          color: '#b6bbbf',
          fontSize: '40px',
          zIndex: 100,
          position:'absolute',
          marginLeft: 'calc(50% - 50px)',
          cursor: 'pointer',
        }}>play_circle_filled</Icon>
        <GraphiQL fetcher={graphQLFetcher} query={query} />
      </div>
    );
  }
}
