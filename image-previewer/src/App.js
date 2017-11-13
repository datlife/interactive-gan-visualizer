import React, {Component} from 'react';
import Header from './components/header';
import Uploader from './components/uploader';
import Content from './components/main';
import Footer from './components/footer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Spinner from 'react-spinkit';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="main-app container-fluid">
          <Header/>
          <Uploader/>
          <Content/>
          <Footer/>
        </div>
      </MuiThemeProvider>
    )
  }
}
export default App;