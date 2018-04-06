import * as React from 'react';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import List, { ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import  { FieldTypes, ClassificationField } from '../app.reducer';

// TODO I will need to update this
export interface ClassificationLabel {
  [classificationName: string]: string | string[]
}

function toggleValue(items: string[] = [], item: string){
  console.log(items, item)
  const index = items.findIndex((str) => str === item);
  if (index === -1){
    return [...items, item];
  } else {
    return [
      ...items.slice(0, index),
      ...items.slice(index + 1),
    ]
  }
}

export function Classification(
  {field, answer, onAnswer}:
  {field: ClassificationField, answer?: string | string[], onAnswer: (answer: string | string[]) => void}
){
  return (
    <FormControl component="fieldset" {...{required: field.required}} key={field.instructions} style={{
      paddingLeft: '15px',
      marginTop: '15px',
      width: '100%',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <FormLabel component="legend">{field.instructions}</FormLabel>
      {
        field.type === FieldTypes.RADIO ?
          ( <RadioGroup
            value={answer as string}
            onChange={(_, value) => onAnswer(value)}
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
                        checked={((answer || []) as string[]).indexOf(value) !== -1}
                        onChange={(e) => onAnswer(toggleValue(answer as string[], value))}
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
}
