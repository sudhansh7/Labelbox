import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './redux';
import { AppState } from './app.reducer';

const render = () => ReactDOM.render(
  <App state={(store.getState() as {app: AppState}).app} />,
  document.getElementById('root') as HTMLElement
);

render();
store.subscribe(render);
