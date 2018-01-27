import React, { Component } from 'react';
import { Circle } from './circle';
import Icon from 'material-ui/Icon';

export function Tool({color, name, count, onClick, selected}) {
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
    }}
    onClick={onClick}
  >
      <div style={{display: 'flex', flexGrow: '1', alignItems: 'center', margin: '0px 15px'}}>
        <Circle color={color}/>
        <div style={{marginLeft: '15px'}}>{name}</div>
        <div style={{marginLeft: '5px'}}>({count})</div>
        <div style={{display: 'flex', flexGrow: '1'}}></div>
        <Icon style={{color: 'grey', marginRight: '10px'}}>visibility</Icon>
      </div>
    </div>
  );
}
