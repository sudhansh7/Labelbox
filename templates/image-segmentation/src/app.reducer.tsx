// tslint:disable
import { ToolNames } from './labeling-screen/segment-image';

export interface Annotation {
  id: string;
  color: string;
  bounds: {lat: number, lng:number}[];
  editing: boolean;
  toolName: ToolNames;
  toolId: string;
}

export type Tool = {
  id: string;
  name: string;
  color: string;
  tool: ToolNames;
};

export interface AppState {
  imageInfo: {url: string, height: number, width: number} | undefined;
  currentToolId: string | undefined;
  annotations: Annotation[];
  hiddenTools: string[];
  deletedAnnotations: Annotation[];
  loading: boolean;
  tools: Tool[];
  errorLoadingImage?: string;
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


export const onNewAnnotation = (state: AppState, bounds: {lat: number, lng: number}[]) => {
  const currentTool = state.tools.find(({id}) => id === state.currentToolId);
  if (currentTool === undefined) {
    throw new Error('should not be able to add an annotation without a tool');
  }
  return {
    ...state,
    currentToolId: undefined,
    annotations: [
      ...state.annotations,
      {
        id: guid(),
        bounds,
        color: currentTool.color,
        editing: false,
        toolName: currentTool.tool,
        toolId: currentTool.id
      }
    ]
  };
};
