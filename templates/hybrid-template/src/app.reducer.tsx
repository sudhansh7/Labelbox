import { ToolType } from './labeling-screen/segment-image';
import { MouseMove } from './labeling-screen/segment-image';
import { screenText } from './customization';
import { getSelectedRectangleTool } from './app.selectors';
const addId = (item: any) => ({id: guid(), ...item});

const defaultState = {
  loading: true,
  imageInfo: undefined,
  currentToolId: undefined,
  annotations: [],
  drawnAnnotationBounds: [],
  hiddenTools: [],
  deletedAnnotations: [],
  tools: screenText.tools.map(addId),
  classifications: screenText.classifications
};

export type Action = {type: any, payload?: any};

enum Actions {
  // TODO this is just a temporary action so I can move everything into redux
  SYNC = 'SYNC',
  USER_CLICKED_SET_TOOL = 'USER_CLICKED_SET_TOOL',
  USER_CLICKED_ANNOTATION = 'USER_CLICKED_ANNOTATION',
  USER_FINISHED_CREATING_ANNOTATION = 'USER_FINISHED_CREATING_ANNOTATION',
  USER_COMPLETED_BOUNDING_BOX = 'USER_COMPLETED_BOUNDING_BOX',
  USER_DESELECTED_ANNOTATION = 'USER_DESELECTED_ANNOTATION',
}

// TODO delete
export function syncState(newState: AppState){
  console.log('TODO your done yet you need to remove this action');
  return {
    type: Actions.SYNC,
    payload: {
      state: newState
    }
  }
}

export function userDeselectedAnnotation(){
  return {
    type: Actions.USER_DESELECTED_ANNOTATION,
    payload: {}
  }
}

export function userClickedSetTool(toolId: string) {
  return {
    type: Actions.USER_CLICKED_SET_TOOL,
    payload: {toolId}
  }
}

export function userFinishedAnnotation(geometry: Geometry){
  return {
    type: Actions.USER_FINISHED_CREATING_ANNOTATION,
    payload: {geometry}
  }
}

export function userClickedAnnotation(annotationId: string) {
  return {
    type: Actions.USER_CLICKED_ANNOTATION,
    payload: {annotationId}
  }
}

export const userCompletedBoundingBox = () => {
  return {
    type: Actions.USER_COMPLETED_BOUNDING_BOX,
    payload: {}
  }
}

export const appReducer = (state: AppState = defaultState, action: any = {}) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SYNC: {
      return payload.state;
    }
    case Actions.USER_CLICKED_SET_TOOL: {
      return {
        ...deselectAllAnnotations(state),
        currentToolId: payload.toolId
      };
    }
    case Actions.USER_FINISHED_CREATING_ANNOTATION: {
      return onNewAnnotation(state, payload.geometry);
    }
    case Actions.USER_CLICKED_ANNOTATION: {
      return userSelectedAnnotationToEdit(state, payload.annotationId);
    }
    case Actions.USER_COMPLETED_BOUNDING_BOX: {
      return finalizeTempBoundingBox(state);
    }
    case Actions.USER_DESELECTED_ANNOTATION: {
      return deselectAllAnnotations(state);
    }
    default: {
      return state;
    }
  }
}


type Geometry = {lat: number, lng:number}[] | {lat: number, lng: number};

export enum FieldTypes {
  CHECKLIST = 'checklist',
  RADIO = 'radio',
}

export interface ClassificationField {
  name: string,
  instructions: string,
  required: boolean,
  type: FieldTypes,
  options: {
    label: string, value: string
  }[],
};


export interface Annotation {
  id: string;
  color: string;
  geometry: Geometry;
  editing: boolean;
  toolName: ToolType;
  toolId: string;
}

export type Tool = {
  id: string;
  name: string;
  color: string;
  tool: ToolType;
};

export interface AppState {
  imageInfo: {url: string, height: number, width: number} | undefined;
  currentToolId: string | undefined;
  annotations: Annotation[];
  hiddenTools: string[];
  deletedAnnotations: Annotation[];
  loading: boolean;
  tools: Tool[];
  drawnAnnotationBounds: Geometry;
  classifications: ClassificationField[]
  existingLabel?: {
    typeName: 'Any' | 'Skip',
    createdBy: string,
    createdAt: string,
  };
  previousLabel?: string;
  nextLabel?: string;
  rectangleInProgressId?: string;
  errorLoadingImage?: string;
  label?: string;
}

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export const toggleVisiblityOfTool = (state: AppState, toolId: string) => {
  const removeItem = (arr: string[], index: number) => [ ...arr.slice(0, index), ...arr.slice(index + 1) ];
  const currentHiddenTools = state.hiddenTools || [];
  const foundIndex = currentHiddenTools.indexOf(toolId);
  const hiddenTools = foundIndex === -1 ?
    [...currentHiddenTools, toolId] :
    removeItem(currentHiddenTools, foundIndex);

  return {...state, hiddenTools};
};


export function onNewAnnotation(state: AppState, geometry: Geometry): AppState {
  const currentTool = state.tools.find(({id}) => id === state.currentToolId);
  if (currentTool === undefined) {
    throw new Error('should not be able to add an annotation without a tool');
  }
  return {
    ...state,
    currentToolId: undefined,
    drawnAnnotationBounds: [],
    annotations: [
      ...state.annotations,
      {
        id: guid(),
        geometry,
        color: currentTool.color,
        editing: false,
        toolName: currentTool.tool,
        toolId: currentTool.id
      }
    ]
  };
};

export const deleteSelectedAnnotation = (state: AppState): AppState => {
  const deleteAnnotationIndex = state.annotations.findIndex(({editing}) => editing === true);
  if (deleteAnnotationIndex !== -1) {
    return {
      ...state,
      annotations: [
        ...state.annotations.slice(0, deleteAnnotationIndex),
        ...state.annotations.slice(deleteAnnotationIndex + 1),
      ],
      deletedAnnotations: [
        {...state.annotations[deleteAnnotationIndex], editing: false},
        ...state.deletedAnnotations
      ]
    };
  } else {
    return state;
  }
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

export const generateAnnotationsFromLabel = (state: AppState, label: string): Annotation[] => {
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

export const generateLabel = (state: AppState) => {
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

  const label = Object.keys(annotationsByTool).reduce((labelTemp, toolId) => {
    const tool = state.tools.find(({id}) => id === toolId);
    if (!tool) {
      throw new Error('tool not foudn' + toolId);
    }
    return {
      ...labelTemp,
      [tool.name]: annotationsByTool[toolId].map(getPoints),
    }

  }, {})

  return JSON.stringify(label);
}


export function selectToolbarState(currentTools: Tool[], annotations: Annotation[], hiddenTools: string[]) {
  return currentTools
    .map(({id, name, color, tool}) => {
      return {
        id,
        name,
        color,
        tool,
        count: annotations.filter(({toolId}) => toolId === id).length,
        visible: hiddenTools.indexOf(id) === -1
      };
    });
}

export const updateAnnotation = (state: AppState, annotationId: string, fields: Partial<Annotation>): AppState => {
  const index = state.annotations.findIndex(({id}) => id === annotationId);
  if (index === undefined) {
    return state;
  }
  return {
    ...state,
    annotations: [
      ...state.annotations.slice(0, index),
      {
        ...state.annotations.find(({id}) => annotationId === id),
        ...fields
      } as Annotation,
      ...state.annotations.slice(index + 1),
    ]
  };
};

export function deselectAllAnnotations(state: AppState) {
  return state.annotations.filter(({editing}) => editing)
    .reduce((appState, annotation) => updateAnnotation(appState, annotation.id, {editing: false}), state);
}


export function userSelectedAnnotationToEdit(state: AppState, annotationId: string) {
  return updateAnnotation(
    deselectAllAnnotations(state),
    annotationId,
    {editing: true}
  )
};


export const removeTempBoundingBox = (state: AppState) => {
  return {
    ...state,
    annotations: state.annotations.filter(({id}) => id !== state.rectangleInProgressId),
    rectangleInProgressId: undefined,
    drawnAnnotationBounds: [],
  }
}

const updateTempBoundingBox = (state: AppState, {location: {lat: mouseLat, lng: mouseLng}}: MouseMove) => {
  const rectangleTool = getSelectedRectangleTool(state);
  if (!rectangleTool){
    return state;
  }
  const rectId = state.rectangleInProgressId ? state.rectangleInProgressId : guid();

  // tslint:disable-next-line
  const [{lat: startLat, lng: startLng}] = state.drawnAnnotationBounds as {lat: number, lng: number}[];
  const boxAnnotation:Annotation = {
    id: rectId,
    color: rectangleTool.color,
    geometry: [
      {lat: startLat, lng: startLng},
      {lat: mouseLat, lng: startLng},
      {lat: mouseLat, lng: mouseLng},
      {lat: startLat, lng: mouseLng},
    ],
    editing: false,
    toolName: 'rectangle',
    toolId: rectangleTool.id
  };

  const index = state.annotations.findIndex(({id}) => state.rectangleInProgressId === id);
  const newAnnotations = index !== -1 ? [
    ...state.annotations.slice(0, index),
    ...state.annotations.slice(index + 1),
    boxAnnotation
  ] : [
    ...state.annotations,
    boxAnnotation
  ];
  return {
    ...state,
    rectangleInProgressId: rectId,
    annotations: newAnnotations
  }
}

function finalizeTempBoundingBox(state: AppState) {
  return {
    ...state,
    drawnAnnotationBounds: [],
    currentToolId: undefined,
    rectangleInProgressId: undefined,
  }
}

export const mouseMove = (state: AppState, move: MouseMove):AppState | undefined => {
  const selectedRectangleTool = getSelectedRectangleTool(state);
  if (selectedRectangleTool && Array.isArray(state.drawnAnnotationBounds) && state.drawnAnnotationBounds.length === 1) {
    return updateTempBoundingBox(state, move);
  }
  return;
}
