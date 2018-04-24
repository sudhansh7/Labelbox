import { combineReducers, createStore } from "redux";
import { appReducer, AppReducerState } from './app.reducer';

const rootReducer = combineReducers({
  app: appReducer
});

export interface AppState {
  app: AppReducerState
}

export const store = createStore(rootReducer);
export const dispatch = store.dispatch;
