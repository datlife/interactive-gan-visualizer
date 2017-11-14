import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Spinner from 'react-spinkit';

import Uploader from './containers/uploader';
import Content from './containers/main';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="main-app container-fluid">
          <header id="header">
            <div className="container">
                <hr className="my-3" />
                <h4 className="display-4 font-weight-bold text-right">Interactive Image Generator</h4>
                <p className="lead text-right">with Generative Adversarial Network</p>
                <hr className="my-3" />
            </div>
          </header>

              <Uploader/>
              <Content/>

          <footer className="footer">
            <div className="text-center">
                  <p className="lead">UC Davis - Fall 2017</p>
            </div>
          </footer>        
        </div>
      </MuiThemeProvider>
    )
  }
}
export default App;