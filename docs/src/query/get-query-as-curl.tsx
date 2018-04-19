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

const getCurlForQuery = (query: string):string => {
  return codeBlock`
    curl 'https://api.labelbox.io/graphql'
      -H 'Authorization: Bearer <JWT_HERE>'
      -d '{"query":""${query.replace(/\n/g, '').replace(/ /g, '')}""}'
  `;
}


export function GetQueryAsCurl({ onClose, query }: {query: string; onClose: () => void}){
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
            value={getCurlForQuery(query)}
          />

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary" autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
