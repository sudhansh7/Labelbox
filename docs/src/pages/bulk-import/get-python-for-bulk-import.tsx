import { codeBlock } from 'common-tags';

export const getPythonForBulkImport = ({apiKey = '<API_KEY_HERE>'}:{apiKey?: string}) => {
  return codeBlock`
    import json
    from graphqlclient import GraphQLClient
    client = GraphQLClient('https://api.labelbox.com/graphql')
    client.inject_token('Bearer ${apiKey}')

    def get_dataset_to_upload_on(client):
      dataset_info_query = '''
        query {
          user{
            id
            organization{
              id
              datasets(where:{deleted:false}){
                id
                name
              }
            }
          }
        }
      '''
      res = client.execute(dataset_info_query)
      data = json.loads(res)['data']
      return {
        "user_id": data['user']['id'],
        "organization_id": data['user']['organization']['id'],
        "dataset_id": data['user']['organization']['datasets'][0]['id'],
      }

    def append_csv_dataset(client, user_id, organization_id, dataset_id, csv_url):
      appendCSVMutation = '''
        mutation AppendCSVToDataset(
          $taskName: String!,
          $userId: ID!,
          $organizationId: ID!,
          $parameters: String!
        ) {
          createTask(
            data:{
              name: $taskName,
              status: IN_PROGRESS,
              createdBy: {
                connect: {
                  id: $userId
                }
              },
              completionPercentage: 0,
              organization: {
                connect: {
                  id: $organizationId
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
                      id: $userId
                    }
                  },
                  organization: {
                    connect: {
                      id: $organizationId
                    }
                  }
                  parameters: $parameters
                }
              }
            }
          ){
            id
          }
        }
      '''

      parameters = json.dumps({
        'csvUrl': csv_url,
        'csvDataColumnIndex': 0,
        'csvExternalIdIndex': -1,
        'datasetId': dataset_id
      })

      variables = {
        'taskName': 'Example Task Name Bulk Import',
        'organizationId': organization_id,
        'userId': user_id,
        'parameters': parameters,
      }
      res = client.execute(appendCSVMutation, variables)
      return json.loads(res)['data']

    info = get_dataset_to_upload_on(client)
    csv_url = 'https://storage.googleapis.com/labelbox-example-datasets/tesla_dataset.csv'
    result = append_csv_dataset(client, info['user_id'], info['organization_id'], info['dataset_id'], csv_url)
    print(result)
  `;
}
