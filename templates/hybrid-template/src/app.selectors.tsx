import {
  AppState,
  userCompletedBoundingBox,
  userDeselectedAnnotation,
  userClickedAnnotation,
  Action,
  Annotation,
  ClassificationField,
} from './app.reducer';
import { guid } from './utils/utils';
import { MapClick } from './labeling-screen/segment-image';

export const getSelectedRectangleTool = (state: AppState) => {
  return state.tools.find((tool) => tool.tool === 'rectangle' && tool.id === state.currentToolId);
}

export const selectIntentFromMapClick = (state: AppState, click: MapClick): Action | undefined => {
  const selectedRectangleTool = getSelectedRectangleTool(state);
  if (
    selectedRectangleTool &&
    Array.isArray(state.drawnAnnotationBounds) &&
    state.drawnAnnotationBounds.length === 2
  ) {
    return userCompletedBoundingBox();
  } else if (!state.currentToolId && !click.shapeId){
    return userDeselectedAnnotation();
  } else if (click.shapeId){
    return userClickedAnnotation(click.shapeId);
  }
  return undefined;
}


function parseIfPossible(str: string){
  try {
    return JSON.parse(str);
  } catch(e) {
    return undefined;
  }
}


const selectToolByName = (state: AppState, toolName: string) => {
  return state.tools.find((tool) => tool.name === toolName);
}


export const selectAnnotationsFromLabel = (state: AppState, label: string): Annotation[] => {
  const classes = parseIfPossible(label);
  if (!classes){
    return [];
  }

  return Object.keys(classes).reduce((annotations, className) => {
    const tool = selectToolByName(state, className);
    if (!tool){
      console.log('Tool not found', className, state);
      return annotations
    }
    const newAnnotations = classes[className].map((shape: {x: number, y: number}[]) => {
      const toCoord = ({y, x}:{x: number, y: number}) => ({lat: y, lng: x});
      const geometry = Array.isArray(shape) ? shape.map(toCoord) : toCoord(shape);
      return {
        id: guid(),
        geometry,
        color: tool.color,
        editing: false,
        toolName: tool.tool,
        toolId: tool.id
      }
    });

    return [...annotations, ...newAnnotations];
  }, []);
}


export const selectClassificationFieldsFromLabel = (state: AppState, label: string): ClassificationField[] => {
  const info = parseIfPossible(label);
  if (!info){
    return state.classificationFields;
  }

  return state.classificationFields.map((field) => {
    if (info[field.name]){
      return {
        ...field,
        userAnswer: info[field.name]
      };
    } else {
      return field;
    }
  });
}


export const selectLabelFromState = (state: AppState) => {
  const getPoints = ({geometry}: Annotation) => {
    const toPoint = ({lat, lng}: {lat: number, lng: number}) => ({
      // These leaflet Latlngs have like 13 decimal points
      // pixels locations dont have decimal points
      x: Math.round(lng),
      y: Math.round(lat)
    });
    return Array.isArray(geometry) ? geometry.map(toPoint) : toPoint(geometry);
  };

  const annotationsByTool = state.annotations.reduce((annotationsByToolTemp, annotation) => {
    if (!annotationsByToolTemp[annotation.toolId]) {
      annotationsByToolTemp[annotation.toolId] = []
    }

    return {
      ...annotationsByToolTemp,
      [annotation.toolId]: [
        ...annotationsByToolTemp[annotation.toolId],
        annotation
      ]
    };
  }, {})

  const labelWithAnnotations = Object.keys(annotationsByTool).reduce((labelTemp, toolId) => {
    const tool = state.tools.find(({id}) => id === toolId);
    if (!tool) {
      throw new Error('tool not foudn' + toolId);
    }
    return {
      ...labelTemp,
      [tool.name]: annotationsByTool[toolId].map(getPoints),
    }

  }, {})

  const labelWithClassifications = state.classificationFields.reduce((classifications, field) => {
    if (field.userAnswer) {
      return {
        ...classifications,
        [field.name]: field.userAnswer
      };
    } else {
      return classifications;
    }
  }, {});

  return JSON.stringify(Object.assign({}, labelWithAnnotations, labelWithClassifications));
}
