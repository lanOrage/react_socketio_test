import React,{Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

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