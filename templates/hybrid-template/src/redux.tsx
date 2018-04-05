// tslint:disable
import { combineReducers, createStore } from "redux";

const appReducer = (state: any = {}, action: any = {}) => {
  console.log('appReducer', state, action);
  return state;
}

const rootReduer = combineReducers({ app: appReducer });
export const store = createStore(rootReduer);
export const dispatch = store.dispatch;
