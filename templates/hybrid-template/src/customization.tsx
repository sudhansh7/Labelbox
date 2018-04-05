import { FieldTypes } from './app.reducer';

export const screenText = {
  tools: [
    {name: 'Vegetation', color: 'pink', tool: 'polygon'},
    {name: 'Paved Road', color: 'purple', tool: 'polygon'},
    {name: 'Buildings', color: 'orange', tool: 'rectangle'},
    {name: 'Sidewalk', color: 'green', tool: 'line'},
  ],
  classifications: [
    {
      name: 'model',
      instructions: "Select the car model",
      type: FieldTypes.RADIO,
      required: true,
      options: [
        { value: "model_s", label: "Tesla Model S"},
        { value: "model_3", label: "Tesla Model 3"},
        { value: "model_x", label: "Tesla Model X"},
      ]
    },
    {
      name: 'image_problems',
      instructions: "Select all that apply",
      type: FieldTypes.CHECKLIST,
      required: false,
      options: [
        { value: "blur", label: "Blurry"},
        { value: "saturated", label: "Over Saturated"},
        { value: "pixelated", label: "Pixelated"},
      ]
    }
  ]
};
