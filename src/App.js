import React,{Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import Login from './containers/login/login'
import Register from './containers/register/register'
import Main from './containers/main/main'

export default class App extends Component {
  render(){
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <Route component={Main}/>
          </Switch>
        </BrowserRouter>
    </Provider>
    );
  }
}