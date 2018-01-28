// tslint:disable
import * as React from 'react';
/* import { Circle } from './circle';*/
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import { ToolNames } from '../labeling-screen/segment-image';

export function Tool(
  { color, name, count, onClick, selected, visible, visibilityToggle, toolName }: {
    color: string,
    name: string,
    toolName: ToolNames,
    count: number,
    onClick: Function,
    selected: boolean,
    visible: boolean,
    visibilityToggle: () => void
  }
) {
  const handleClick = (e: any) => {
    if (e.target.classList.contains('material-icons')) {
      visibilityToggle()
    } else {
      onClick()
    }
  }

  return (
    <Button
      style={{
        display: 'flex',
        flexGrow: '1',
        alignItems: 'center',
        width: '100%',
        padding: '10px 0px',
        paddingBottom: selected ? '5px' : '10px',
        cursor: 'pointer',
        textTransform: 'none',
        borderRadius: '0px',
        borderBottom: '1px solid #c1c1c1'
        // tslint:disable-next-line
      } as any}
      color={selected ? 'primary' : 'inherit'}
      raised={selected}
      onClick={handleClick}
    >
      <div
        style={{display: 'flex', flexGrow: '1', alignItems: 'center'} as any}
      >
        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '15px', lineHeight: '15px', alignItems: 'start'} as any}>
          <div style={{display: 'flex'}}>
            <div >{name}</div>
            <div style={{marginLeft: '5px'}}>({count})</div>
          </div>
          {
            selected && <div style={{fontSize: '9px'}}>
              Draw a {toolName}
            </div>
          }
        </div>
        {/* tslint:disable-next-line */}
        <div style={{display: 'flex', flexGrow: '1'} as any}></div>
      </div>
      <Icon
        style={{
          color: selected ? 'white' : color,
          marginRight: '20px',
          opacity: visible ? 1 : 0.2
        }}
      >
        visibility
      </Icon>
    </Button>
  );
}
