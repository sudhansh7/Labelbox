import * as React from 'react';
import { Tool } from './tool';
import Button from 'material-ui/Button';
import { ToolNames } from '../labeling-screen/segment-image';

export function Toolbar(
  {
    tools,
    toolChange,
    currentTool,
    visibilityToggle,
    disableSubmit,
    onSubmit
  }: {
    tools: {id: string, name: string, color: string, count: number, visible: boolean, tool: ToolNames}[];
    toolChange: (id: string | undefined) => void;
    currentTool: string | undefined;
    visibilityToggle: (toolIndex: string) => void;
    disableSubmit: boolean;
    onSubmit: () => void;
  }) {
  return (
    <div className="toolbar">
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
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>

        {/* tslint:disable-next-line */}
        <div style={{margin: '20px 15px 10px', fontWeight: '700'} as any}>Keyboard shortcuts</div>
        {/* tslint:disable-next-line */}
        <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey'} as any}>
          {/* tslint:disable-next-line */}
          <div style={{display: 'flex', flexGrow: '1'} as any}>
            <div style={{flex: '60'}}>Deselect Tool</div>
            <div style={{flex: '40'}}>escape</div>
          </div>
        </div>
        {/* tslint:disable-next-line */}
        <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey'} as any}>
          {/* tslint:disable-next-line */}
          <div style={{display: 'flex', flexGrow: '1'} as any}>
            <div style={{flex: '60'}}>Undo</div>
            <div style={{flex: '40'}}>cmd/ctrl z</div>
          </div>
        </div>
        {/* tslint:disable-next-line */}
        <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey'} as any}>
          {/* tslint:disable-next-line */}
          <div style={{display: 'flex', flexGrow: '1'} as any}>
            <div style={{flex: '60'}}>Delete</div>
            <div style={{flex: '40'}}>backspace</div>
          </div>
        </div>
      </div>
      {/* tslint:disable-next-line */}
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'} as any}></div>
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '15px'}}>
        <Button color="primary" raised={true} disabled={disableSubmit} onClick={() => onSubmit()}>Submit</Button>
      </div>
    </div>
  );
}
