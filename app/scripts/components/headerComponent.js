// Packages
import React from 'react';

class HeaderComponent extends React.Component {

  render() {

    return (
      <header role="header">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </header>
    )

  }

}

export default HeaderComponent;
