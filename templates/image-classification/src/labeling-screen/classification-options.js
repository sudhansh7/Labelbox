import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import screenText from './screen-text';

export default function ClassificationForm(props){
  return (
    <div>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">{screenText.instructions}</FormLabel>
        <RadioGroup
          value={props.value}
          onChange={(event, value) => props.onSelect(value)}
        >
          {
            screenText.options.map(({value, label}) => (
              <FormControlLabel value={value} control={<Radio />} label={label} key={value}/>
            ))
          }
        </RadioGroup>
      </FormControl>
    </div>
  );
}
