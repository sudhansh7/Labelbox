// tslint:disable
import { ToolType } from './labeling-screen/segment-image';
import { MapClick, MouseMove } from './labeling-screen/segment-image';

type Geometry = {lat: number, lng:number}[] | {lat: number, lng: number};

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


export const onNewAnnotation = (state: AppState, geometry: Geometry): AppState => {
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

  const annotations = Object.keys(classes).reduce((annotations, className) => {
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

  return annotations;
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

  const annotationsByTool = state.annotations.reduce((annotationsByTool, annotation) => {
    if (!annotationsByTool[annotation.toolId]) {
      annotationsByTool[annotation.toolId] = []
    }

    return {
      ...annotationsByTool,
      [annotation.toolId]: [
        ...annotationsByTool[annotation.toolId],
        annotation
      ]
    };
  }, {})

  const label = Object.keys(annotationsByTool).reduce((label, toolId) => {
    const tool = state.tools.find(({id}) => id === toolId);
    if (!tool) {
      throw new Error('tool not foudn' + toolId);
    }
    return {
      ...label,
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

export const editShape = (state: AppState, annotationId?: string) => {
  let updatedState = state.annotations.filter(({editing}) => editing)
    .reduce((appState, annotation) => updateAnnotation(appState, annotation.id, {editing: false}), state);

  if (annotationId) {
    updatedState = updateAnnotation(updatedState, annotationId, {editing: true})
  }

  return updatedState;
};


const getSelectedRectangleTool = (state: AppState) => {
  return state.tools.find((tool) => tool.tool === 'rectangle' && tool.id === state.currentToolId);
}

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

const finalizeTempBoundingBox = (state: AppState) => {
  return {
    ...state,
    drawnAnnotationBounds: [],
    currentToolId: undefined,
    rectangleInProgressId: undefined,
  }
}

export const userClickedMap = (state: AppState, click: MapClick) => {
  const selectedRectangleTool = getSelectedRectangleTool(state);
  if (selectedRectangleTool && Array.isArray(state.drawnAnnotationBounds) && state.drawnAnnotationBounds.length === 2) {
    return finalizeTempBoundingBox(state);
  } else if (!state.currentToolId && !click.shapeId){
    return editShape(state);
  } else if (click.shapeId){
    return editShape(state, click.shapeId);
  }
  return state;
}

export const mouseMove = (state: AppState, move: MouseMove):AppState | undefined => {
  const selectedRectangleTool = getSelectedRectangleTool(state);
  if (selectedRectangleTool && Array.isArray(state.drawnAnnotationBounds) && state.drawnAnnotationBounds.length === 1) {
    return updateTempBoundingBox(state, move);
  }
  return;
}
