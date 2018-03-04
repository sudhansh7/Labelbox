import * as React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import classificationOptions, { FieldTypes } from './screen-text';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem } from 'material-ui/List';

interface ClassificationField {
  name: string,
  instructions: string,
  required: boolean,
  type: FieldTypes,
  options: {
    label: string, value: string
  }[],
};

export default class ClassificationForm extends React.Component {
  public state: {
    customization: ClassificationField[]
  } = {
    customization: classificationOptions
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
      <div style={{overflowY: 'auto'}}>
        {
          this.state.customization.map((field) => {
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
                    ( <List>
                      {
                        field.options.map(({value, label}:{value: string, label: string}) => (
                          <ListItem value={value} disableGutters={true} style={{padding: '0px'}}>
                            <FormControlLabel
                              control={
                                <Checkbox color="primary" onChange={(e) => console.log('checkbox change', e)} />
                              }
                              label={label}
                            />
                          </ListItem>
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
