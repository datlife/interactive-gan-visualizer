import React  from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header   from './components/Header';
import Uploader from './containers/Uploader';
import Content  from './containers/Main';
import Footer   from './components/Footer';

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="main-app container-fluid">
              <Header />
              <Uploader/>
              <Content/>
              <Footer />
        </div>
      </MuiThemeProvider>
    )
  }
}
export default App;