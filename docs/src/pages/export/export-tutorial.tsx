import * as React from 'react';
import { Title, Paragraph, Warning, Content, SubTitle } from '../../components/layout';
import {stripIndent} from 'common-tags';
import { ApiKeyPrompt } from '../../components/api-key-prompt';
import { Query } from '../../components/query/query';
import { AppState } from '../../redux/index';
import { getPythonForLabelExport } from './get-all-labels-python';
import AceEditor from 'react-ace';

export function ExportTutorial({state}: {state: AppState}){

  const apiKey = state.app.apiKey;
  return (
    <Content>
      <Title>Data Export Tutorial (beta)</Title>
      <Warning>The api calls below may change in the future</Warning>

      {!apiKey && <ApiKeyPrompt />}

      <SubTitle>Export the labels in a project</SubTitle>
      <Paragraph>Get the projectId you want to export from.</Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
          query {
            user {
              organization {
                projects {
                  id
                  name
                }
              }
            }
          }
        `}/>

      <Paragraph>Using the project ID from the above query you can pull all the labels created in that project.</Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
          query {
            Project(id: "<INSERT_PROJECT_ID_HERE>") {
              labels(first: 5){
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
        `}/>

      <Paragraph>If you remove the "first: 5" parameter in the above query you'll get the first page of 1000 labels. In order to get all label pages you can use the below code.</Paragraph>
      <AceEditor
        mode="python"
        theme="github"
        value={getPythonForLabelExport({apiKey})}
        width="100%"
      />
      <SubTitle>Example Label Filters</SubTitle>
      <Paragraph>Here are some common filter you might want to apply to your export</Paragraph>
      <Query apiKey={apiKey} query={stripIndent`
        query {
          Project(id: "<INSERT_PROJECT_ID_HERE>") {
            labels(
              first: 5,
              filter: {
                createdBy:{id:"USER_ID"},
                createdAt_lt:"2018-04-24T22:09:21.753Z",
                createdAt_gt:"2018-04-01T22:09:21.753Z",
                type:{id:"TYPE_ID"}, # Skipped vs Submitted
                agreement_gt:0,
                agreement_lt:0.5,
                dataRow:{
                  dataset:{
                    id:"SOME_DATASET_ID"
                  }
                }
              }
            ){
              id
              label
            }
          }
        }
      `}/>

    </Content>
  );
}
