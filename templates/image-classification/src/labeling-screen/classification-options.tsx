import * as React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import classificationOptions, { FieldTypes } from './screen-text';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem } from 'material-ui/List';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import { reject, equals } from 'ramda';

const Sidebar = styled.div`
  box-shadow: 2px 0px 13px #bfbfbf;
  background-color: white;
  min-width: 240px;
  max-width: 240px;
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  padding: 20px;
`;

const Divider = styled.div`
  display: flex;
  flex-grow: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;


export interface Label {
  [classificationName: string]: string | string[]
}

interface ClassificationField {
  name: string,
  instructions: string,
  required: boolean,
  type: FieldTypes,
  options: {
    label: string, value: string
  }[],
};

const remove = (arr: string[], value: string) => {
  return reject(equals(value), arr);
}

const canUserSubmitForm = (formFields: ClassificationField[], label: Label): boolean => {
  const hasCompletedRequiredFields = formFields
    .filter(({required}) => required === true)
    .every(({name}) => Boolean(label[name]));
  return hasCompletedRequiredFields;
}

const isChecked = (label: Label, checkboxName: string, checkboxValue: string) => {
  return Boolean(label[checkboxName] && label[checkboxName].indexOf(checkboxValue) > -1);
}

export default class ClassificationForm extends React.Component {
  public state: {
    customization: ClassificationField[]
  } = {
    customization: classificationOptions
  }
  props: {
    label: Label,
    onLabelUpdate: Function,
    onSubmit: Function,
    onSkip: Function,
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
    const updateLabelAfterCheckboxChange = (fieldName: string, isCheckboxOn: boolean, checkboxValue: string) => {
      const currentValues = (this.props.label[fieldName] as string[] || []);
      this.props.onLabelUpdate({
        ...this.props.label,
        [fieldName]: isCheckboxOn ?
          [...currentValues, checkboxValue] :
          remove(currentValues, checkboxValue)
      });
    }
    return (
      <Sidebar>
        <div style={{overflowY: 'auto'}}>
          {
            this.state.customization.map((field) => {
              return (
                <FormControl component="fieldset" {...{required: field.required}} key={field.instructions} style={{paddingBottom: '20px'}}>
                  <FormLabel component="legend">{field.instructions}</FormLabel>
                  {
                    field.type === FieldTypes.RADIO ?
                      ( <RadioGroup
                        value={this.props.label[field.name] as string || ''}
                        onChange={(event, value) => this.props.onLabelUpdate({...this.props.label, [field.name]: value})}
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
                            <ListItem value={value} disableGutters={true} style={{padding: '0px'}} key={value}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="primary"
                                    checked={isChecked(this.props.label, field.name, value)}
                                    onChange={(e) => updateLabelAfterCheckboxChange(field.name, e.target.checked, value)}
                                  />
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
        <Divider />
        <ActionButtons>
          <Button onClick={() => this.props.onSkip()} >Skip</Button>
          <Button
            variant="raised"
            color="primary"
            disabled={!canUserSubmitForm(this.state.customization, this.props.label)}
            onClick={() => this.props.onSubmit()}
          >Submit</Button>
        </ActionButtons>
      </Sidebar>
    );
  }
}
