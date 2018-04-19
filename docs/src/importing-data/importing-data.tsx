import * as React from 'react';
import { Query } from '../query/query';
import {stripIndent} from 'common-tags';

const query = stripIndent`
  query {
    user {
      email
    }
  }
`

export function ImportingData() {
  return (
    <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
      <div>Data Import Tutorial</div>

      <div>
        All operations in labelbox occur through our <a href="https://graphql.org/">GraphQL API</a>.
        Click the play button below to see an example query.
      </div>

      <Query query={query} />
    </div>
  );
}
