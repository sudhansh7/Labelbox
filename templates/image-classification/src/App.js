import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="content">

          <div className="labeling-frame">
            <div>
              <img src="https://electrek.files.wordpress.com/2016/06/tesla-model-3-silver-prototype-promo-shot-headlands.jpg?quality=82&strip=all&w=1600" alt="classify-data" />
            </div>

            <div className="form-controls">
              <div className="classification-options">
                <div>Select the car model:</div>
                <div className="options">
                  <option>Tesla Model S</option>
                  <option>Tesla Model 3</option>
                  <option>Tesla Model X</option>
                </div>
              </div>
              <div className="form-buttons">
                <button>Skip</button>
                <button>Submit</button>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
}

export default App;
