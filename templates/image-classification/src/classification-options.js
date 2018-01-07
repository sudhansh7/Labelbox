import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

class RadioButtonsGroup extends React.Component {
  state = {
    value: ''
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">Select the car model</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="model_s" control={<Radio />} label="Tesla Model S" />
            <FormControlLabel value="model_3" control={<Radio />} label="Tesla Model 3" />
            <FormControlLabel value="model_x" control={<Radio />} label="Tesla Model X" />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

export default RadioButtonsGroup;
