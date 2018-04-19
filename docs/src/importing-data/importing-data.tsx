import * as React from 'react';
import { Query } from '../query/query';
import {stripIndent} from 'common-tags';

const query = stripIndent`
  query {
    user {
      id
      email
    }
  }
`

export function ImportingData() {
  return (
    <div>
      hi
      <Query query={query}/>
    </div>
  );
}