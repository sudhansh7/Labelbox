import * as React from 'react';
import { Query } from '../components/query/query';
import {stripIndent} from 'common-tags';
import { ApiKeyPrompt } from '../components/api-key-prompt';
import { AppState } from '../redux/index';
import { Title, Paragraph, Warning, Content } from '../components/layout';

export function ImportingData({state}: {state: AppState}) {
  const apiKey = state.app.apiKey;

  return (
    <Content>
      <Title>Data Import Tutorial (beta)</Title>
      <Warning>The api calls below may change in the future</Warning>

      {!apiKey && <ApiKeyPrompt />}

      <div style={{fontSize: '18px', marginBottom: '10px'}}>Video Walkthrough</div>
      <iframe width="630" height="394" src="https://www.useloom.com/embed/0bb22477372a4f2ebeea3f696594b84e" frameBorder="0" allowFullScreen></iframe>

      <Paragraph>
        All operations in labelbox go through our <a href="https://graphql.org/">GraphQL API</a>.
        Click the play button below to see an example query.
      </Paragraph>

      <Query apiKey={apiKey} query={stripIndent`
          query {
            user {
              email
            }
          }
        `}
      />


      <Paragraph>
        In order to import data you will need the following IDs...
        <ul>
          <li>Your User ID</li>
          <li>Your Organization ID</li>
          <li>A Project ID</li>
        </ul>
        Use this query to collect those IDs
      </Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
          query {
            user {
              id
              organization{
                id,
                projects(where:{deleted:false}){
                  id,
                  name
                }
              }
            }
          }
        `}
      />

      <Paragraph>You can create a new dataset with this query. Then save the ID for the datarow query below.</Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
          mutation {
            createDataset(
              data:{
                name: "<INSERT_NAME_HERE>",
                projects: {
                  connect: [{id: "<INSERT_PROJECT_ID_HERE>"}]
                },
                createdBy: {
                  connect: {
                    id: "<INSERT_YOUR_USER_ID_FROM_ABOVE_HERE>",
                  }
                }
                organization: {
                  connect: {
                    id: "<INSERT_YOUR_ORGANIZATION_ID_FROM_ABOVE_HERE>"
                  }
                },
                deleted: false,
              }
            ) {
              id
            }
          }
        `}
      />

      <Paragraph>A datarow represents a single piece of data that needs to be labeled. For example if you have a CSV with 100 rows you will have 100 datarows.</Paragraph>
      <Warning style={{marginBottom: '20px'}}>The Labelbox API is rate limited at 300 requests per minute. We recommend sending datarow import requests one after another and not in batch.</Warning>
      <Query apiKey={apiKey} query={stripIndent`
          mutation {
            createDataRow(
              data: {
                rowData: "<DATA_THAT_NEEDS_TO_BE_LABELED>",
                dataset: {
                  connect: {
                    id: "<DATASET_ID_HERE>"
                  }
                },
                createdBy: {
                  connect: {
                    id: "<INSERT_YOUR_USER_ID_FROM_ABOVE_HERE>",
                  }
                }
                organization: {
                  connect: {
                    id: "<INSERT_YOUR_ORGANIZATION_ID_FROM_ABOVE_HERE>"
                  }
                },
              }
            ) {
              id
            }
          }
        `}
      />

    <Paragraph>Lastly, after you've imported you'll need to rebuild the queue.</Paragraph>
    <Query apiKey={apiKey} query={stripIndent`
        mutation {
          updateProject(
            where: { id: "<PROJECT_ID>" }
            data: { queueIsBuilding: true },
          ) {
            id
          }
        }
      `}
    />

    </Content>

  );
}
