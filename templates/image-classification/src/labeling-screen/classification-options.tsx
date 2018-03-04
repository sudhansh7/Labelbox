import * as React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import screenText from './screen-text';
import Checkbox from 'material-ui/Checkbox';
import List from 'material-ui/List';

enum FieldTypes {
  CHECK = 'check',
  RADIO = 'radio',
}

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
        if (Array.isArray(customization)) {
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
        {
          this.state.customization.map((field: {instructions: string, required: boolean, type: FieldTypes, options: {label: string, value: string}[]}) => {
            return (
              <FormControl component="fieldset" {...{required: field.required}} key={field.instructions} style={{paddingBottom: '20px'}}>
                <FormLabel component="legend">{field.instructions}</FormLabel>
                {
                  field.type === FieldTypes.RADIO ?
                    ( <RadioGroup
                      value={this.props.value}
                      onChange={(event, value) => this.props.onSelect(value)}
                      >
                      {
                        field.options.map(({value, label}:{value: string, label: string}) => (
                          <FormControlLabel value={value} control={<Radio color="primary" />} label={label} key={value}/>
                        ))
                      }
                    </RadioGroup> ) :
                    ( <List >
                      {
                        field.options.map(({value, label}:{value: string, label: string}) => (
                          <FormControlLabel value={value} control={<Checkbox color="primary" />} label={label} key={value}/>
                        ))
                      }
                    </List> )
                }
              </FormControl>
            )
          })
        }
      </div>
    );
  }
}
