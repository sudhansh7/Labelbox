enum FieldTypes {
  CHECKLIST = 'checklist',
  RADIO = 'radio',
}

export const screenText = {
  "tools": [
    {"name": "Car", "color": "navy", "tool": "polygon"},
    {"name": "Tree", "color": "green", "tool": "polygon"},
    {"name": "Road Sign", "color": "orange", "tool": "polygon"},
    {"name": "Person", "color": "pink", "tool": "rectangle"},
    {"name": "Corner of Building", "color": "red", "tool": "point"}
  ],
  "classifications": [
    {
      "name": "model",
      "instructions": "Select the car model",
      "type": FieldTypes.RADIO,
      "options": [
        {
          "value": "model_s",
          "label": "Tesla Model S"
        },
        {
          "value": "model_3",
          "label": "Tesla Model 3"
        },
        {
          "value": "model_x",
          "label": "Tesla Model X"
        }
      ]
    },
    {
      "name": "image_problems",
      "instructions": "Select all that apply",
      "type": FieldTypes.CHECKLIST,
      "options": [
        {
          "value": "blur",
          "label": "Blurry"
        },
        {
          "value": "saturated",
          "label": "Over Saturated"
        },
        {
          "value": "pixelated",
          "label": "Pixelated"
        }
      ]
    }
  ]
};
