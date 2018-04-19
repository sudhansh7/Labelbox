import * as React from 'react';
import { Query } from '../query/query';
import {stripIndent} from 'common-tags';


export function ImportingData() {
  return (
    <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
      <div>Data Import Tutorial (beta)</div>
      <div style={{color: 'grey'}}>The api calls below may change in the future.</div>

      <div>
        All operations in labelbox go through our <a href="https://graphql.org/">GraphQL API</a>.
        Click the play button below to see an example query.
      </div>

      <Query query={stripIndent`
          query {
            user {
              email
            }
          }
        `}
      />

      <div>Pull the needed ID's for your data import query</div>
      <Query query={stripIndent`
          query {
            user {
              id
              organization{
                id
                projects{
                  id
                  name
                }
                datasets{
                  id
                  name
                }
              }
            }
          }
        `}
      />

      <div>Create a dataset</div>
      <Query query={stripIndent`
          mutation {
            createDataset(
              name: "<INSERT_NAME_HERE>",
              projectsIds: ["<INSERT_PROJECT_ID_HERE>"],
              createdById: "<INSERT_YOUR_USER_ID_FROM_ABOVE_HERE>",
              organizationId: "<INSERT_YOUR_ORGANIZATION_ID_FROM_ABOVE_HERE>",
              deleted: false,
            ) {
              id
            }
          }
        `}
      />

      <div>Create a datarow in a dataset</div>
      <Query query={stripIndent`
          mutation {
            createDataRow(
              rowData: "<DATA_THAT_NEEDS_TO_BE_LABELED>",
              datasetId: "<DATASET_ID_HERE>",
              createdById: "<INSERT_YOUR_USER_ID_FROM_ABOVE_HERE>",
              organizationId: "<INSERT_YOUR_ORGANIZATION_ID_FROM_ABOVE_HERE>",
            ) {
              id
            }
          }
        `}
      />

    </div>
  );
}
