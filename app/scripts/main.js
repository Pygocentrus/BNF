// Libs
import React from 'react'
import ReactDOM from 'react-dom'
import Router, { Route, DefaultRoute, NotFoundRoute, Redirect } from 'react-router'

// Utils & components
import AppComponent from './components/appComponent'

// Create a new Todo collection and render the **App** into `#todoapp`.
ReactDOM.render(
  <AppComponent />,
  document.getElementById('bnf-app')
)
