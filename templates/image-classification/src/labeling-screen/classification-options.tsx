import * as React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import screenText from './screen-text';

export default class ClassificationForm extends React.Component {
  state = {
    customization: screenText
  }
  props: {
    value: string,
    onSelect: Function,
  }
  customizationSubscription: {unsubscribe: Function};

  componentWillMount(){
    this.customizationSubscription = (window as any).Labelbox.getTemplateCustomization()
      .subscribe((customization: any) => {
        if (typeof customization === 'object') {
          if (!Array.isArray(customization)){
            // This is to support legacy templates when we only
            // had a single classifications
            this.setState({
              ...this.state,
              customization: [{
                ...customization,
                type: 'radio',
                required: true,
              }]
            });
          } else {
            this.setState({...this.state, customization});
          }
        }
      });
  }

  componentWillUnmount(){
    this.customizationSubscription.unsubscribe();
  }

  render(){
    return (
      <div>
        {
          this.state.customization.map((field: {instructions: string, required: boolean, options: {label: string, value: string}[]}) => {
            return (
              <FormControl component="fieldset" {...{required: field.required}} key={field.instructions} style={{paddingBottom: '20px'}}>
                <FormLabel component="legend">{field.instructions}</FormLabel>
                <RadioGroup
                  value={this.props.value}
                  onChange={(event, value) => this.props.onSelect(value)}
                  >
                  {
                    field.options.map(({value, label}:{value: string, label: string}) => (
                      <FormControlLabel value={value} control={<Radio />} label={label} key={value}/>
                    ))
                  }
                </RadioGroup>
              </FormControl>
            )
          })
        }
      </div>
    );
  }
}
