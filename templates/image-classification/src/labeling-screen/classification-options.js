import React from 'react';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import screenText from './screen-text';

export default class ClassificationForm extends React.Component {
  state = {
    customization: screenText
  }

  componentWillMount(){
    // TODO need to cleanup
    console.log('running');
    window.Labelbox.getTemplateCustomization().subscribe((customization) => {
      console.log('Im guessing this message comes up more and more as more callbacks get registered: TODO add unsubscribe to cleanup');
      console.log('res', customization);
      this.setState({...this.state, customization: JSON.parse(customization)})
    })
  }

  render(){

    return (
      <div>
        <FormControl component="fieldset" required>
          <FormLabel component="legend">{screenText.instructions}</FormLabel>
          <RadioGroup
            value={this.props.value}
            onChange={(event, value) => this.props.onSelect(value)}
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
}
