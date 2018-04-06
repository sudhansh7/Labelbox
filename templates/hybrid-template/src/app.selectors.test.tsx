import {
  appReducer,
  userFinishedAnnotation,
} from './app.reducer';
import {
  createMockGeometry,
  selectFirstTool,
  reduceActions,
} from './app.reducer.test';
import { selectLabelFromState } from './app.selectors';


// TODO finish these tests
describe('app.selectors', () => {
  describe('selectIntentFromMapClick', () => {
    it('should complete the bounding box if the user is currently drawing', () => {
      expect(1).toEqual(1);
    });
    it('should deselect an annotation if they arent clicking a new shape', () => {
      expect(1).toEqual(1);
    });
    it('should select a shape if they click on it', () => {
      expect(1).toEqual(1);
    });
    it('should return undefined if the click is on a blank map', () => {
      expect(1).toEqual(1);
    });
  });

  describe('selectLabelFromState', () => {
    it('should return a blank string if there are no labels', () => {
      expect(selectLabelFromState(appReducer())).toEqual('{}');
    });

    it('should return a segmentation as xy', () => {
      const state = appReducer(undefined);
      const finalState = reduceActions(appReducer, [
        selectFirstTool(state),
        userFinishedAnnotation(createMockGeometry()),
      ], state);
      expect(selectLabelFromState(finalState)).toEqual('{\"Vegetation\":[[{\"x\":0,\"y\":0},{\"x\":1,\"y\":0},{\"x\":0,\"y\":1},{\"x\":1,\"y\":1}]]}');
    });

  });

});
