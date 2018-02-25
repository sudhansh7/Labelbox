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
/* import ExpandMoreIcon from 'material-ui-icons/ExpandMore';*/

export function Toolbar(
  {
    tools,
    toolChange,
    currentTool,
    visibilityToggle,
    disableSubmit,
    onSubmit,
    onSkip,
    disabled,
  }: {
    tools: {id: string, name: string, color: string, count: number, visible: boolean, tool: ToolType}[];
    toolChange: (id: string | undefined) => void;
    currentTool: string | undefined;
    visibilityToggle: (toolIndex: string) => void;
    disableSubmit: boolean;
    onSubmit: () => void;
    onSkip: () => void;
    disabled: boolean;
  }) {
  return (
    <div className="toolbar">
      {disabled && (<div style={{padding: '16px', textAlign: 'center', color: '#4a4a4a'}}>Editing submitted labels coming soon.</div>)}
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column', width: '100%', ...disabled ? {pointerEvents: 'none', opacity: 0.3} : {}} as any}>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          {/* tslint:disable-next-line */}
          <div style={{margin: '20px 15px 10px', fontWeight: '700'} as any}>Select a class below</div>
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
        <div style={{display: 'flex', flexGrow: '1'} as any}></div>

        <ExpansionPanel style={{boxShadow: 'none', borderBottom: '1px solid #e0e0e0'}}>
          <ExpansionPanelSummary expandIcon={<Icon>keyboard_arrow_up</Icon>}>
            <Typography>Keyboard Shortcuts</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{display: 'flex', flexDirection: 'column', padding: '0px'}}>
            {
              tools.map(({name}, index) => (
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

        <div style={{display: 'flex', justifyContent: 'flex-end', margin: '15px', minHeight: '36px'}}>
          <Button onClick={() => onSkip()}>Skip</Button>
          <Button color="primary" raised={true} disabled={disableSubmit} onClick={() => onSubmit()}>Submit</Button>
        </div>
      </div>

    </div>
  );
}
