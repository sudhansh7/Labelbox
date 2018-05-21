import { codeBlock } from 'common-tags';

export const getPythonForLabelExport = ({apiKey = '<API_KEY_HERE'}:{apiKey?: string}) => {
  return codeBlock`
    import json
    from graphqlclient import GraphQLClient
    client = GraphQLClient('https://api.labelbox.com/graphql')
    client.inject_token('${apiKey}')

    def get_page_of_labels(project_id, skip, page_size):
      page_query = '''
        query GetPageOfLabels($projectId: ID!, $skip: Int!, $first: Int!) {
          project(where:{id: $projectId}) {
            labels(skip: $skip, first: $first){
              id
              label
              createdBy{
                id
                email
              }
              type {
                id
                name
              }
              secondsToLabel
              agreement
              dataRow {
                id
                rowData
              }
            }
          }
        }
      '''
      res = client.execute(page_query, {'projectId': project_id, 'skip': skip, 'first': page_size})
      data = json.loads(res)['data']
      return data['Project']['labels'] or []

    def get_all_labels(project_id, skip = 0, page_size = 1000, all_labels = []):
      new_labels = get_page_of_labels(project_id, skip, page_size)
      if len(new_labels) == page_size:
        return get_all_labels(project_id, skip + page_size, page_size, all_labels + new_labels)
      else:
        return all_labels + new_labels

    project_id = '<PROJECT_ID_HERE>'
    all_labels = get_all_labels(project_id)
    print(len(all_labels))
  `
}
