import * as React from 'react';
import { Query } from '../query/query';
import {stripIndent} from 'common-tags';
import Input from 'material-ui/Input';
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

const AlertBanner = styled.div`
  margin: 50px 20px;
  padding: 20px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  background-color: #eeeeee;
  font-weigh: 300;
  box-shadow: -1px 2px 5px #cbcbcb;
`;


export class ImportingData extends React.Component {
  // TODO install redux and move this into state
  public state: {
    apiKey?: string;
  } = {
    apiKey: undefined
  }

  render(){
    return (
      <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
        <Title>Data Import Tutorial (beta)</Title>
        <Warning>The api calls below may change in the future</Warning>

        {!this.state.apiKey && <AlertBanner>
          <Input placeholder="API Key" />
          <div style={{fontSize: '12px', marginTop: '10px'}}>
            Enter your api key to have the below queries run against the data in your account.
            If you don't have an API Key please contact our support team.
          </div>
        </AlertBanner>}


        <Paragraph>
          All operations in labelbox go through our <a href="https://graphql.org/">GraphQL API</a>.
          Click the play button below to see an example query.
        </Paragraph>

        <Query apiKey={this.state.apiKey} query={stripIndent`
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
        <Query apiKey={this.state.apiKey} query={stripIndent`
            query {
              user {
                id
                organization{
                  id
                  projects(filter:{deleted:false}){
                    id
                    name
                  }
                }
              }
            }
          `}
        />

        <Paragraph>You can create a new dataset with this query. Then save the ID for the datarow query below.</Paragraph>
        <Query apiKey={this.state.apiKey} query={stripIndent`
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

        <Paragraph>A datarow represents a single piece of data that needs to be labeled. For example if you have a CSV with 100 rows you will have 100 datarows.</Paragraph>
        <Warning style={{marginBottom: '20px'}}>The Labelbox API is rate limited at 300 requests per minute. We recommend sending datarow import requests one after another and not in batch.</Warning>
        <Query apiKey={this.state.apiKey} query={stripIndent`
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
}
