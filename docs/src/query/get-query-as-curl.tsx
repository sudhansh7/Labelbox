import * as React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import AceEditor from 'react-ace';
import { codeBlock } from 'common-tags';
import 'brace/mode/python';
import 'brace/theme/github';

const getCurlForQuery = (query: string, apiKey?: string):string => {
  return codeBlock`
    curl 'https://api.labelbox.io/graphql'
      -H 'Authorization: Bearer ${apiKey ? apiKey : '<API_KEY_HERE>'}'
      -d '{"query":""${query.replace(/\n/g, '').replace(/ /g, '')}""}'
  `;
}


export function GetQueryAsCurl({ onClose, query, apiKey }: {query: string; onClose: () => void, apiKey?: string}){
  return (
    <Dialog
      open={true}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Query as CURL</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <AceEditor
            theme="github"
            value={getCurlForQuery(query, apiKey)}
          />

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary" autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
