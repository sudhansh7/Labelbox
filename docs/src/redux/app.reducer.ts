export interface AppReducerState{
  apiKey?: string;
}

enum ActionNames {
  UserSetApiKey = 'UserSetApiKey'
}

export function appReducer(state: AppReducerState = {}, {type, payload}: {type: ActionNames, payload: any}){
  console.log('here2', payload)
  if (type === ActionNames.UserSetApiKey){
    return {
      ...state,
      apiKey: payload.apiKey
    };
  } else {
    return state;
  }
}

export function userSetApiKey(apiKey: string){
  console.log('here');
  return {
    type: ActionNames.UserSetApiKey,
    payload: {apiKey}
  }
}
