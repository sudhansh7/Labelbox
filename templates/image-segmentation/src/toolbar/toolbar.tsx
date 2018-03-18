// tslint:disable
import * as React from 'react';
import { Tool } from './tool';
import Button from 'material-ui/Button';
import { ToolType } from '../labeling-screen/segment-image';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import styled from 'styled-components';
/* import ExpandMoreIcon from 'material-ui-icons/ExpandMore';*/

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 15px;
  min-height: 36px;
`;

export function ToolMenu(
  {
    tools,
    toolChange,
    currentTool,
    visibilityToggle,
    disableSubmit,
    onSubmit,
    onSkip,
    editing,
    pendingEdits,
    onReset,
  }: {
    tools: {id: string, name: string, color: string, count: number, visible: boolean, tool: ToolType}[];
    toolChange: (id: string | undefined) => void;
    currentTool: string | undefined;
    visibilityToggle: (toolIndex: string) => void;
    disableSubmit: boolean;
    onSubmit: () => void;
    onSkip: () => void;
    onReset: () => void;
    editing: boolean;
    pendingEdits: boolean;
  }) {
  return (
    <div className="toolbar">
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', width: '100%'} as any}>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          {/* tslint:disable-next-line */}
          <div style={{margin: '20px 15px 10px', fontWeight: '700'} as any}>Select a class below</div>
          <div style={{overflowY: 'auto'}}>
            {tools.map(({id, name, color, count, visible, tool}, index) => (
              <Tool
                key={index}
                name={name}
                toolName={tool}
                color={color}
                count={count}
                visible={visible}
                visibilityToggle={() => visibilityToggle(id)}
                onClick={() => toolChange(id !== currentTool ? id : undefined)}
                selected={id === currentTool}
              />
            ))}
          </div>
        </div>
        <div style={{display: 'flex', flexGrow: '1'} as any}></div>

        <ExpansionPanel style={{boxShadow: 'none', borderBottom: '1px solid #e0e0e0'}}>
          <ExpansionPanelSummary expandIcon={<Icon>keyboard_arrow_up</Icon>}>
            <Typography>Keyboard Shortcuts</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{display: 'flex', flexDirection: 'column', padding: '0px', overflowY: 'auto', maxHeight: '60vh'}}>
            {
              tools.slice(0, 9).map(({name}, index) => (
                <div key={index} style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
                  <div style={{display: 'flex', flexGrow: '1'} as any}>
                    <div style={{flex: '60'}}>{name}</div>
                    <div style={{flex: '40'}}>{index + 1}</div>
                  </div>
                </div>
              ))
            }
            <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
              <div style={{display: 'flex', flexGrow: '1'} as any}>
                <div style={{flex: '60'}}>Complete Shape</div>
                <div style={{flex: '40'}}>f</div>
              </div>
            </div>
            <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
              <div style={{display: 'flex', flexGrow: '1'} as any}>
                <div style={{flex: '60'}}>Undo</div>
                <div style={{flex: '40'}}>cmd/ctrl z</div>
              </div>
            </div>
            <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
              <div style={{display: 'flex', flexGrow: '1'} as any}>
                <div style={{flex: '60'}}>Delete</div>
                <div style={{flex: '40'}}>backspace</div>
              </div>
            </div>
            <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
              <div style={{display: 'flex', flexGrow: '1'} as any}>
                <div style={{flex: '60'}}>Deselect Tool</div>
                <div style={{flex: '40'}}>escape</div>
              </div>
            </div>
            <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
              <div style={{display: 'flex', flexGrow: '1'} as any}>
                <div style={{flex: '60'}}>Submit</div>
                <div style={{flex: '40'}}>e</div>
              </div>
            </div>
            <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey', minHeight: '10px'} as any}>
              <div style={{display: 'flex', flexGrow: '1'} as any}>
                <div style={{flex: '60'}}>Skip</div>
                <div style={{flex: '40'}}>a</div>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {
          editing ?
            (
              <ActionButtons>
                <Button disabled={!pendingEdits} onClick={() => onReset()}>Reset</Button>
                <Button disabled={!pendingEdits} color="primary" raised={true} onClick={() => onSubmit()}>Save</Button>
              </ActionButtons>
            ) :
            (
              <ActionButtons>
                <Button onClick={() => onSkip()}>Skip</Button>
                <Button color="primary" raised={true} disabled={disableSubmit} onClick={() => onSubmit()}>Submit</Button>
              </ActionButtons>
            )
        }
      </div>

    </div>
  );
}
