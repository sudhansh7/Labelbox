import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

export default function ClassificationForm(props){
  return (
    <div>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">Select the car model</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={props.value}
          onChange={(event, value) => props.onSelect(value)}
        >
          <FormControlLabel value="model_s" control={<Radio />} label="Tesla Model S" />
          <FormControlLabel value="model_3" control={<Radio />} label="Tesla Model 3" />
          <FormControlLabel value="model_x" control={<Radio />} label="Tesla Model X" />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
