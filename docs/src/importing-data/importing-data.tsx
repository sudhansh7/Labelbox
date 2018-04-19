import * as React from 'react';
import { Query } from '../query/query';
import {stripIndent} from 'common-tags';
import styled from 'styled-components';

const Title = styled.div`
   font-size: 26px;
`;

const Warning = styled.div`
  font-size: 12px;
  color: #E53935;
`;

const Paragraph = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
`;


export function ImportingData() {
  return (
    <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
      <Title>Data Import Tutorial (beta)</Title>
      <Warning>The api calls below may change in the future</Warning>

      <Paragraph>
        All operations in labelbox go through our <a href="https://graphql.org/">GraphQL API</a>.
        Click the play button below to see an example query.
      </Paragraph>

      <Query query={stripIndent`
          query {
            user {
              email
            }
          }
        `}
      />


      <Paragraph>Pull the needed ID's for your data import query</Paragraph>
      <Query query={stripIndent`
          query {
            user {
              id
              organization{
                id
                projects(filter:{deleted:false}){
                  id
                  name
                }
                datasets(filter:{deleted:false}){
                  id
                  name
                }
              }
            }
          }
        `}
      />

      <Paragraph>Create a dataset</Paragraph>
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


      <Paragraph>Create a datarow in a dataset</Paragraph>
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
