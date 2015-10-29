// Packages
import React from 'react';
import _ from 'lodash';

// Components
import HeaderComponent from '../components/headerComponent';
import MainComponent from '../components/mainComponent';
import FooterComponent from '../components/footerComponent';

// Utils
import Utils from '../mixins/utils';

class AppComponent extends React.Component {

  constructor() {
    super();
    this.state = {};
    this._awesome = this._awesome.bind(this);
  }

  componentWillMount() {

  }

  render() {
    return (
      <div className="wrapper">
        <HeaderComponent/>
        <MainComponent/>
        <FooterComponent/>
      </div>
    )
  }

  _awesome() {
    // `this` now refers to `AppComponent`
  }

}

export default AppComponent;
