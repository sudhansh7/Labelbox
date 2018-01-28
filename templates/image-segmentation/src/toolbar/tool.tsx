// tslint:disable
import * as React from 'react';
/* import { Circle } from './circle';*/
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

export function Tool(
  { color, name, count, onClick, selected, visible, visibilityToggle }: {
    color: string,
    name: string,
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
        cursor: 'pointer',
        textTransform: 'none'
        // tslint:disable-next-line
      } as any}
      color={selected ? 'primary' : 'inherit'}
      raised={selected}
      onClick={handleClick}
    >
      <div
        style={{display: 'flex', flexGrow: '1', alignItems: 'center'} as any}
      >
        {/* <Circle color={color}/> */}
        <div style={{marginLeft: '15px'}}>{name}</div>
        <div style={{marginLeft: '5px'}}>({count})</div>
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
