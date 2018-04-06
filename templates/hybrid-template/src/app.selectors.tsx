import {
  AppState,
  userCompletedBoundingBox,
  userDeselectedAnnotation,
  userClickedAnnotation,
  Action,
} from './app.reducer';
import { MapClick } from './labeling-screen/segment-image';

export const getSelectedRectangleTool = (state: AppState) => {
  return state.tools.find((tool) => tool.tool === 'rectangle' && tool.id === state.currentToolId);
}

export const selectIntentFromMapClick = (state: AppState, click: MapClick): Action | undefined => {
  const selectedRectangleTool = getSelectedRectangleTool(state);
  if (selectedRectangleTool && Array.isArray(state.drawnAnnotationBounds) && state.drawnAnnotationBounds.length === 2) {
    return userCompletedBoundingBox();
  } else if (!state.currentToolId && !click.shapeId){
    return userDeselectedAnnotation();
  } else if (click.shapeId){
    return userClickedAnnotation(click.shapeId);
  }
  return undefined;
}
