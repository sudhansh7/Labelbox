import * as React from 'react';
import { Query } from '../../components/query/query';
import AceEditor from 'react-ace';
import {stripIndent} from 'common-tags';
import { ApiKeyPrompt } from '../../components/api-key-prompt';
import { AppState } from '../../redux/index';
import { Title, Paragraph, Warning, Content } from '../../components/layout';
import { getPythonForBulkImport } from './get-python-for-bulk-import';

export function BulkDataImport({state}: {state: AppState}) {
  const apiKey = state.app.apiKey;

  return (
    <Content>
      <Title>Bulk Data Import Tutorial (beta)</Title>
      <Warning>The api calls below may change in the future</Warning>

      {!apiKey && <ApiKeyPrompt />}

      <Paragraph>
        If you want to import thousands of assets at the same time you can give Labelbox a CSV file to import.
        This will be much faster then sending a reqeust for each asset as explained in the data import tutorial.
      </Paragraph>

      <Paragraph>
        In order to run the bulk import function you'll need to collect...
        <ul>
          <li>UserId</li>
          <li>OrganizationId</li>
          <li>DatasetId</li>
          <li>Url to CSV file</li>
        </ul>
        With the query below you can retrieve a userId, organizationId, and datasetId.
      </Paragraph>

      <Query apiKey={apiKey} query={stripIndent`
          query {
            user{
              id
              organization{
                id
                datasets{
                  id
                  name
                }
              }
            }
          }
        `}
      />

      <Paragraph>
        If don't want to a append this new data to an existing dataset you can create a new dataset with the query below.
      </Paragraph>
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

      <Paragraph>
        Now you can fill in the ID's (USER-ID, ORGANIZATION-ID, DATASET-ID, CSV-URL) into the below query to append a CSV to a given dataset. Here is an example <a href="https://storage.googleapis.com/labelbox-example-datasets/tesla_dataset.csv" target="_blank">CSV url</a>.<br/>
      </Paragraph>

      <Paragraph>
        In the below example "parameters" is stringified JSON and csvDataColumnIndex and csvExternalIdIndex are numbers that tell this function how to read the CSV. If "-1" is used for csvExternalIdIndex that column will not be populated.
      </Paragraph>

      <Query apiKey={apiKey} query={stripIndent`
          mutation AppendCSVToDataset {
            createTask(
              data:{
                name: "Example Bulk Import Task",
                status: IN_PROGRESS,
                createdBy: {
                  connect: {
                    id: "<USER-ID>"
                  }
                },
                completionPercentage: 0,
                organization: {
                  connect: {
                    id: "<ORGANIZATION-ID>"
                  }
                },
                notifyOnCompletion: false,
                assigned: {
                  create:{
                    function: {
                      connect: {
                        name: "CSV Proccessor"
                      }
                    },
                    createdBy: {
                      connect: {
                        id: "<USER-ID>"
                      }
                    },
                    organization: {
                      connect: {
                        id: "<ORGANIZATION-ID>"
                      }
                    }
                    parameters: "{\"csvUrl\":\"<CSV-URL>\", \"csvDataColumnIndex\":0, \"csvExternalIdIndex\":-1, \"datasetId\":\"<DATASET-ID>\"}"
                  }
                }
              }
            ){
              id
            }
          }
        `}
      />


    <Paragraph>
      Here is a full a full example in python.
    </Paragraph>
    <AceEditor
      mode="python"
      theme="github"
      value={getPythonForBulkImport({apiKey})}
      width="100%"
    />

    </Content>
  );
}
