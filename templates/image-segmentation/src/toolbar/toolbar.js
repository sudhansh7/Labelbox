import React, { Component } from 'react';
import { Tool } from './tool';
import Button from 'material-ui/Button';

export class Toolbar extends React.Component {
  state = {
    selectedTool: 0
  }

  render() {
    const { colorChange } = this.props;
    const tools = [
      {name: "Vegetation", color: "pink"},
      {name: "Paved Road", color: "purple"},
      {name: "Sidewalk", color: "green"},
      {name: "Buildings", color: "orange"},
    ];

    const changeTool = (color, index) => {
      colorChange(color);
      this.setState({...this.state, selectedTool: index})
    };

    return (
      <div className="toolbar">
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{margin: '20px 15px 10px', fontWeight: '700'}}>Select a class below</div>
          {
            tools.map(({name, color}, index) => (
              <Tool
                key={index}
                name={name}
                color={color}
                count={1}
                onClick={() => changeTool(color, index)}
                selected={index === this.state.selectedTool}
              />
            ))
          }
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <div style={{margin: '20px 15px 10px', fontWeight: '700'}}>Keyboard shortcuts</div>
          <div style={{display: 'flex', flexGrow: '1', borderBottom: '1px solid #c1c1c1', fontSize: '12px', padding: '10px 15px', color: 'grey'}}>
            <div style={{display: 'flex', flexGrow: '1'}}>
              <div style={{flex: '60'}}>Toggle Annotation</div>
              <div style={{flex: '40'}}>Spacebar</div>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexGrow: '1', flexDirection: 'column'}}></div>
        <div style={{display: 'flex', justifyContent: 'flex-end', margin: '15px'}}>
          <Button color="primary" raised={true}>Submit</Button>
        </div>
      </div>
    );
  }
}
