// tslint:disable
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './redux';

const render = () => ReactDOM.render(
  <App state={store.getState()['app']} />,
  document.getElementById('root') as HTMLElement
);

render();
store.subscribe(render);
