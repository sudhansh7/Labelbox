import * as React from 'react';
import { Query } from '../components/query/query';
import {stripIndent} from 'common-tags';
import { ApiKeyPrompt } from '../components/api-key-prompt';
import { AppState } from '../redux/index';
import { Title, Paragraph, Warning, Content } from '../components/layout';

export function LabelTutorial({state}: {state: AppState}) {
  const apiKey = state.app.apiKey;

  return (
    <Content>
      <Title>Label Create & Update Tutorial</Title>
      <Warning>The api calls below may change in the future</Warning>

      {!apiKey && <ApiKeyPrompt />}

      <Paragraph>
        All operations in labelbox go through our <a href="https://graphql.org/">GraphQL API</a>.
        Click the play button below to query information about the first label from each of your Labelbox projects.
      </Paragraph>

      <Query apiKey={apiKey} query={stripIndent`
          query {
            projects {
              name,
              labels(first:1) {
                id,
                label
              }
            }
          }
        `}
      />

      <Paragraph>
        To update an existing label, we'll need the ID of the label. To perform the label update, use the `updateLabel` Mutation:
      </Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
          mutation {
            updateLabel(
                where:{
                  id:"<INSERT_LABEL_ID_HERE>"
                }
                data: {
                  label:"<INSERT_LABEL_DATA_STRING_HERE>"
                }
            ) {
            id
            label
            }
          }
        `}
      />

      <Paragraph>
        To create a new label for a data row, we'll need:
        <ul>
          <li>the organization ID</li>
          <li>your user ID (createdBy)</li>
          <li>the data row ID</li>
          <li>the project ID</li>
          <li>the label type, which is Any unless it's Skip</li>
        </ul>
      </Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
          mutation {
            createLabel(
              data: {
                label:"<INSERT_LABEL_DATA_STRING_HERE>",
                secondsToLabel: 42,
                deleted:false,
                organization: {
                  connect: {
                    id: "<INSERT_ORGANIZATION_ID_HERE>"
                  }
                },
                createdBy: {
                  connect: {
                    id: "<INSERT_USER_ID_HERE>"
                  }
                },
                dataRow: {
                  connect: {
                    id: "<INSERT_DATA_ROW_ID_HERE>"
                  }
                },
                project: {
                  connect: {
                    id: "<INSERT_PROJECT_ID_HERE>"
                  }
                },
                type: {
                  connect: {
                    name: "Any"
                  }
                }
              })  {
                id
                label
             }
           }
        `}
      />

    </Content>
  );
}
