// tslint:disable
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

export function Classification({field}: {field: ClassificationField}){
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
          // TODO will need to fill in check and on change
          ( <RadioGroup
            value={''}
            onChange={(event, value) => console.log('field changed', event, value)}
            >
            {
              field.options.map(({value, label}:{value: string, label: string}) => (
                <FormControlLabel value={value} control={<Radio color="primary" />} label={label} key={value}/>
              ))
            }
          </RadioGroup> ) :
          ( <List>
            {
              // TODO will need to fill in check and on change
              field.options.map(({value, label}:{value: string, label: string}) => (
                <ListItem value={value} disableGutters={true} style={{padding: '0px'}} key={value}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={false}
                        onChange={(e) => console.log(field.name, e.target.checked, value)}
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
