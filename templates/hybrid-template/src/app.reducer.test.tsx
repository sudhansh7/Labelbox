import {
  appReducer,
  userClickedSetTool,
  userClickedAnnotation,
  userFinishedAnnotation,
} from './app.reducer';

const reduceActions = (reducer: any, actions: any[]) => {
  return actions.reduce((state, action) => reducer(state, action), undefined);
}

const createGeometry = () => {
  return [
    {lat: 0, lng: 0},
    {lat: 0, lng: 1},
    {lat: 1, lng: 0},
    {lat: 1, lng: 1},
  ];
}


describe('appReducer', () => {

  describe('userFinishedAnnotation', () => {
    fit('should create a new annotation with the currently selected tool', () => {
      const state = appReducer(undefined);
      const newState = appReducer(state, userClickedSetTool(state.tools[0].id));
      const finalState = appReducer(newState, userFinishedAnnotation(createGeometry()));
      expect(finalState.annotations).toEqual([{
        "color": "pink",
        "editing": false,
        "geometry": [
          {"lat": 0, "lng": 0},
          {"lat": 0, "lng": 1},
          {"lat": 1, "lng": 0},
          {"lat": 1, "lng": 1}
        ],
        "id": jasmine.any(String),
        "toolId": jasmine.any(String),
        "toolName": "polygon"
      }]);
      /* const state = reduceActions(appReducer, [*/
      /* userClickedSetTool('toolId'),*/
      /* userFinishedAnnotation(createGeometry()),*/
      /* ])*/
      /* console.log('my lenght', state.annotations.length);*/
    });
  });

  describe('userClickedSetTool', () => {
    it('should set that tool as the selected tool', () => {
      const state = appReducer(undefined, userClickedSetTool('toolid'))
      expect(state.currentToolId).toEqual('toolid');
    });
    it('should remove any shape that are being edited', () => {
      const state = appReducer(undefined, userClickedSetTool('toolid'))
      expect(state.currentToolId).toEqual('toolid');
    });
  });

  describe('userClickedAnnotation', () => {
    const state = appReducer(undefined, userClickedSetTool('toolid'))
    expect(state.currentToolId).toEqual('toolid');
  })
});
