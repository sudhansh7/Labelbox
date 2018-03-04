export default [
  {
    instructions: "Select the car model",
    type: 'radio',
    required: true,
    options: [
      { value: "model_s", label: "Tesla Model S"},
      { value: "model_3", label: "Tesla Model 3"},
      { value: "model_x", label: "Tesla Model X"},
    ]
  },
  {
    instructions: "Select all that apply",
    type: 'checklist',
    required: false,
    options: [
      { value: "blur", label: "Blurry"},
      { value: "saturated", label: "Over Saturated"},
      { value: "pixelated", label: "Pixelated"},
    ]
  }
]
