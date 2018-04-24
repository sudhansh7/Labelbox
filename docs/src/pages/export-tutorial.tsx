import * as React from 'react';
import { Title, Paragraph, Warning, Content, SubTitle } from '../components/layout';
import {stripIndent} from 'common-tags';
import { ApiKeyPrompt } from '../components/api-key-prompt';
import { Query } from '../components/query/query';
import { AppState } from '../redux/index';

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
    </Content>
  );
}
