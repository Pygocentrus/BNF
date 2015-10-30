// Packages
import React from 'react';
import { Navbar, Nav, NavBrand, CollapsibleNav, NavItem } from 'react-bootstrap';

class HeaderComponent extends React.Component {

  render() {

    return (
      <header role="header">
        <Navbar toggleNavKey={0}>
          <NavBrand><a href="#">BNF - Dashboard d'administration</a></NavBrand>
          <CollapsibleNav eventKey={0}>
            <Nav navbar right>
              <NavItem eventKey={1} href="#">Live</NavItem>
              <NavItem eventKey={2} href="#">Tweets validés</NavItem>
              <NavItem eventKey={3} href="#">Tweets refusés</NavItem>
            </Nav>
          </CollapsibleNav>
        </Navbar>
      </header>
    )

  }

}

export default HeaderComponent;
