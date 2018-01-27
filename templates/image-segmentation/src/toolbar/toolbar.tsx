import * as React from 'react';
import { Tool } from './tool';
import Button from 'material-ui/Button';

export function Toolbar({tools, toolChange, currentTool}) {
  return (
    <div className="toolbar">
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{margin: '20px 15px 10px', fontWeight: '700'} as any}>Select a class below</div>
        {
          tools.map(({name, color}, index) => (
            <Tool
              key={index}
              name={name}
              color={color}
              count={1}
              onClick={() => toolChange(index)}
              selected={index === currentTool}
            />
          ))
        }
      </div>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{margin: '20px 15px 10px', fontWeight: '700'} as any}>Keyboard shortcuts</div>
        <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey'} as any}>
          <div style={{display: 'flex', flexGrow: '1'} as any}>
            <div style={{flex: '60'}}>Toggle Annotation</div>
            <div style={{flex: '40'}}>Spacebar</div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'} as any}></div>
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '15px'}}>
        <Button color="primary" raised={true}>Submit</Button>
      </div>
    </div>
  );
}
