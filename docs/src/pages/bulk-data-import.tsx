import * as React from 'react';
import { Query } from '../components/query/query';
import {stripIndent} from 'common-tags';
import { ApiKeyPrompt } from '../components/api-key-prompt';
import { AppState } from '../redux/index';
import { Title, Paragraph, Warning, Content } from '../components/layout';

export function BulkDataImport({state}: {state: AppState}) {
  const apiKey = state.app.apiKey;

  return (
    <Content>
      <Title>Bulk Data Import Tutorial (beta)</Title>
      <Warning>The api calls below may change in the future</Warning>

      {!apiKey && <ApiKeyPrompt />}

      <Paragraph>If you want to import thousands of assets at the same time you can give Labelbox a CSV file to import.</Paragraph>

    TODO how to pull current dataset ids

    TODO how to create a new dataset

    TODO make a python file that does all of this end to end

      <Query apiKey={apiKey} query={stripIndent`
          mutation CreateTask {
            createTask(
              data:{
                name: "Upload Data Test",
                status: IN_PROGRESS,
                createdBy: {
                  connect: {
                    id: "cjgcj7ujahr710105jd2a2zz5"
                  }
                },
                completionPercentage: 0,
                organization: {
                  connect: {
                    id: "cjgcj7uayh1jl0198rjsoarja"
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
                        id: "cjgcj7ujahr710105jd2a2zz5"
                      }
                    },
                    organization: {
                      connect: {
                        id: "cjgcj7uayh1jl0198rjsoarja"
                      }
                    }
                    parameters: "{\"csvUrl\":\"https://storage.googleapis.com/labelbox-example-datasets/tesla_dataset.csv\", \"csvDataColumnIndex\":0, \"csvExternalIdIndex\":-1, \"datasetId\":\"cjhv2pnbbms9b0779mr1ncq6w\"}"
                  }
                }
              }
            ){
              id
            }
          }
        `}
      />


    </Content>
  );
}
