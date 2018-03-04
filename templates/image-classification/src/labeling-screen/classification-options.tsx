import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import screenText from './screen-text';

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
      <div>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">{this.state.customization.instructions}</FormLabel>
          <RadioGroup
            value={this.props.value}
            onChange={(event, value) => this.props.onSelect(value)}
            >
            {
              this.state.customization.options.map(({value, label}) => (
                <FormControlLabel value={value} control={<Radio />} label={label} key={value}/>
              ))
            }
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}
