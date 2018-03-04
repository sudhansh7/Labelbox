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
    instructions: "Select the colors the car contains.",
    type: 'checklist',
    required: false,
    options: [
      { value: "red", label: "Red"},
      { value: "blue", label: "Blue"},
      { value: "black", label: "Black"},
    ]
  }
]
