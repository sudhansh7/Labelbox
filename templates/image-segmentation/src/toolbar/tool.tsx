import * as React from 'react';
/* import { Circle } from './circle';*/
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { ToolType } from '../labeling-screen/segment-image';

export function Tool(
  { color, name, count, onClick, selected, visible, visibilityToggle, toolName }: {
    color: string,
    name: string,
    toolName: ToolType,
    count: number,
    onClick: Function,
    selected: boolean,
    visible: boolean,
    visibilityToggle: () => void
  }
) {
  return (
    <div style={{
      display: 'flex',
      flexGrow: '1',
      minHeight: '40px',
    } as any}>
      <Button
        style={{
          width: '50px',
          minWidth: '50px',
          padding: '10px 0px',
          paddingBottom: '5px',
          cursor: 'pointer',
          textTransform: 'none',
          borderRadius: '0px',
          borderBottom: '1px solid #c1c1c1',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'none',
        } as any}
        onClick={visibilityToggle}
      >
        <Icon
          style={{
            color: visible ? color : 'black',
            opacity: visible ? 1 : 0.2
          }}
        >
          visibility
        </Icon>
      </Button>
      <Button
        style={{
          display: 'flex',
          flexGrow: '1',
          alignItems: 'center',
          width: '100%',
          padding: '10px 0px',
          paddingBottom: '5px',
          cursor: 'pointer',
          textTransform: 'none',
          borderRadius: '0px',
          borderBottom: '1px solid #c1c1c1'
        } as any}
        color={selected ? 'primary' : 'inherit'}
        raised={selected}
        onClick={() => onClick()}
      >
        <div
          style={{display: 'flex', flexGrow: '1', alignItems: 'center'} as any}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '15px',
            lineHeight: '15px',
            alignItems: 'start',
            textAlign: 'left',
            width: '100%'
          } as any}>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
              <div style={{maxWidth: '140px'}}>{name}</div>
              <div style={{marginLeft: '5px', paddingRight: '10px'}}>({count})</div>
            </div>
            {
              selected && <div style={{fontSize: '9px'}}>
                Draw a {toolName}
              </div>
            }
          </div>
          <div style={{display: 'flex', flexGrow: '1'} as any}></div>
        </div>
      </Button>
    </div>
  );
}
