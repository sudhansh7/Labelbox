import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { store } from './redux/index';

const render = () => ReactDOM.render(
  <App store={store as any} />,
  document.getElementById('root') as HTMLElement
);

render();
store.subscribe(render);
