import {
  appReducer,
  userClickedSetTool,
  userClickedAnnotation,
  userFinishedAnnotation,
  AppState,
} from './app.reducer';

const reduceActions = (reducer: any, actions: any[], startingState: AppState | undefined = undefined) => {
  return actions.reduce((state, action) => reducer(state, action), startingState);
}

const createGeometry = () => {
  return [
    {lat: 0, lng: 0},
    {lat: 0, lng: 1},
    {lat: 1, lng: 0},
    {lat: 1, lng: 1},
  ];
}

type Action = {type: any, payload?: any};

const selectFirstTool = (state: AppState): Action => {
  return userClickedSetTool(state.tools[0].id);
}

describe('appReducer', () => {

  describe('userFinishedAnnotation', () => {
    fit('should create a new annotation with the currently selected tool', () => {
      const geometry = createGeometry();
      const state = appReducer(undefined);
      const finalState = reduceActions(appReducer, [
        selectFirstTool(state),
        userFinishedAnnotation(geometry),
      ], state);

      expect(finalState.annotations.length).toEqual(1);
      expect(finalState.annotations[0].geometry).toEqual(geometry);
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
