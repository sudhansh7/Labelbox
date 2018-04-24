import * as React from 'react';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import { dispatch } from '../redux/index';
import { userSetApiKey } from '../redux/app.reducer';

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

export class ApiKeyPrompt extends React.Component {
  public state: {
    apiKey?: string;
  } = {
    apiKey: undefined
  };

  render(){
    return (
      <AlertBanner>
        <Input placeholder="API Key"
          onKeyUp={(e:any) => e.keyCode === 13 && this.state.apiKey && dispatch(userSetApiKey(this.state.apiKey))}
          onChange={(e) => this.setState({...this.state, apiKey: e.target.value})} />
        <div style={{fontSize: '12px', marginTop: '10px'}}>
          Enter your api key to have the below queries run against the data in your account.
          If you don't have an API Key please contact our support team.
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
          <Button
            disabled={!this.state.apiKey || this.state.apiKey.length < 5}
            color="primary"
            variant="raised"
            onClick={() => this.state.apiKey && dispatch(userSetApiKey(this.state.apiKey))}
          >Confirm</Button>
        </div>
      </AlertBanner>
    );
  }
}
