import React, { Component } from 'react';
import { Tool } from './tool';

export function Toolbar() {
  return (
    <div className="toolbar">
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{margin: '20px 15px 10px', fontWeight: '700'}}>Select a class below</div>
        <Tool name="Sidewalk" color="pink" count={1} />
        <Tool name="Paved Road" color="purple" count={1} />
        <Tool name="Vegetation" color="green" count={3} />
        <Tool name="Buildings" color="orange" count={2} />
      </div>
      <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'}}></div>
    </div>
  );
}
