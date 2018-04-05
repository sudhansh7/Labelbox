import { combineReducers, createStore } from "redux";
import { appReducer } from './app.reducer';

const rootReduer = combineReducers({ app: appReducer });
export const store = createStore(rootReduer);
export const dispatch = store.dispatch;
