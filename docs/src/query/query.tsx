import * as React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';
import './query.css'

function graphQLFetcher(graphQLParams: any) {
  return fetch('https://api.labelbox.io/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

export function Query({query}: {query: string}) {
  return (
    <GraphiQL fetcher={graphQLFetcher} query={query} />
  );
}
