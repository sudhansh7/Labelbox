import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export function LabelingUI({label, data, onLabelUpdate}) {
  return (
    <div>
      <div>Data: {data}</div>
      <br/>
      <br/>
      <FormControl component="fieldset" required>
        <FormLabel component="legend">This section can contain any labeling interface.</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={label}
          onChange={(e) => onLabelUpdate(e.target.value)}
        >
          <FormControlLabel value="one" control={<Radio color="primary"/>} label="One" />
          <FormControlLabel value="two" control={<Radio color="primary"/>} label="Two" />
          <FormControlLabel value="three" control={<Radio color="primary"/>} label="Three" />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
