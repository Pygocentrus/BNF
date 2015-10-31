import React from 'react';

let AppDispatcher = new React.Dispatcher();

// TODO: All actions
AppDispatcher.handleViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

export default AppDispatcher;
