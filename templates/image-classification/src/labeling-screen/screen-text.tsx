export enum FieldTypes {
  CHECKLIST = 'checklist',
  RADIO = 'radio',
}

export default [
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
