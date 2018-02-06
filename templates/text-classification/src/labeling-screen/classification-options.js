import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import screenText from './screen-text';
import Button from 'material-ui/Button';

export default class ClassificationForm extends React.Component {
  state = {
    customization: screenText
  }
  customizationSubscription;

  componentWillMount(){
    this.customizationSubscription = window.Labelbox.getTemplateCustomization()
      .subscribe((customization) => {
        if (customization.options) {
          this.setState({...this.state, customization});
        }
      });
  }

  componentWillUnmount(){
    this.customizationSubscription.unsubscribe();
  }

  render(){
    return (
      <div style={{display: 'flex', flexGrow: '1'}}>
        <FormControl component="fieldset" required style={{display: 'flex', flexGrow: '1'}}>
          <FormLabel component="legend" >{this.state.customization.instructions}</FormLabel>
          <div style={{display: 'flex', flexGrow: '1', justifyContent: 'space-between', marginTop: '20px'}}>
            {
              this.state.customization.options.map(({value, label}) => (
                <Button
                  onClick={() => this.props.onSelect(value)}
                  raised={true}
                  key={value}
                  style={{margin: '10px'}}
                  >{label}</Button>
              ))
            }
          </div>
        </FormControl>
      </div>
    );
  }
}
