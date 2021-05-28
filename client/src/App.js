import React from 'react';

import {Container} from '@material-ui/core';
import {BrowserRouter,Switch,Route} from 'react-router-dom';

import Home from './components/Home';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
function App () {
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Switch>
          <Route exact path="/"><Navbar/><Home /></Route>
          <Route exact path="/auth"><Navbar/><Auth/></Route>
        </Switch>
        
      </Container>
      </BrowserRouter>
    
  );
}

export default App;
