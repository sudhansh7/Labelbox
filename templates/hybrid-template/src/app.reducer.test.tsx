import {
  appReducer,
  userClickedSetTool,
  userClickedAnnotation,
  userFinishedAnnotation,
  AppState,
  Action,
  userAnsweredClassification,
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


const selectFirstTool = (state: AppState): Action => {
  return userClickedSetTool(state.tools[0].id);
}

describe('appReducer', () => {

  describe('userFinishedAnnotation', () => {
    it('should create a new annotation with the currently selected tool', () => {
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
      const state = appReducer(undefined);
      const withAnnotation = reduceActions(appReducer, [
        selectFirstTool(state),
        userFinishedAnnotation(createGeometry()),
      ], state);
      const clickedAnnotationState = appReducer(
        withAnnotation,
        userClickedAnnotation(withAnnotation.annotations[0].id)
      );
      expect(clickedAnnotationState.annotations[0].editing).toEqual(true);
      const newToolSelected = appReducer(clickedAnnotationState, userClickedSetTool('toolid'));
      expect(newToolSelected.annotations[0].editing).toEqual(false);
    });
  });

  describe('userClickedAnnotation', () => {

    it('should select annotation',  () => {
      const state = appReducer(undefined);
      const withAnnotation = reduceActions(appReducer, [
        selectFirstTool(state),
        userFinishedAnnotation(createGeometry()),
      ], state);
      const clickedAnnotationState = appReducer(
        withAnnotation,
        userClickedAnnotation(withAnnotation.annotations[0].id)
      );
      expect(clickedAnnotationState.annotations[0].editing).toEqual(true);
    });
  });

  describe('userAnsweredClassification', () => {
    it('should change the classification for an item', () => {
      const defaultState = appReducer();
      const fieldId = defaultState.classificationFields[0].id;
      const state = appReducer(defaultState, userAnsweredClassification(fieldId, 'newValue'))
      const classification = state.classificationFields.find(({id}) => id === fieldId);
      expect(classification && classification.userAnswer).toEqual('newValue');
    });
  });

});
