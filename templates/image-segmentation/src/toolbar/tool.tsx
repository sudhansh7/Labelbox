// tslint:disable
import * as React from 'react';
import { Circle } from './circle';
import Icon from 'material-ui/Icon';

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
  return (
    <div
      style={{
        display: 'flex',
        flexGrow: '1',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid #c1c1c1',
        padding: '10px 0px',
        cursor: 'pointer',
        backgroundColor: selected ? '#e4e4e4ad' : 'inherit'
        // tslint:disable-next-line
      } as any}
    >
      {/* tslint:disable-next-line */}
      <div
        style={{display: 'flex', flexGrow: '1', alignItems: 'center', marginLeft: '15px'} as any}
        onClick={() => { console.log('click did register'); onClick()}}
      >
        <Circle color={color}/>
        <div style={{marginLeft: '15px'}}>{name}</div>
        <div style={{marginLeft: '5px'}}>({count})</div>
        {/* tslint:disable-next-line */}
        <div style={{display: 'flex', flexGrow: '1'} as any}></div>
      </div>
      <Icon
        style={{
          color: 'grey',
          marginRight: '20px'
        }}
        onClick={(e) => visibilityToggle()}
      >
        visibility
      </Icon>
    </div>
  );
}
