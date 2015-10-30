// Packages
import React from 'react';
import { Navbar, Nav, NavBrand, CollapsibleNav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';

class HeaderComponent extends React.Component {

  render() {

    return (
      <header role="header">
        <Navbar toggleNavKey={0}>
          <NavBrand>
            <Link to="/">BNF - Dashboard d'administration</Link>
          </NavBrand>
          <CollapsibleNav eventKey={0}>
            <Nav navbar right>
              <LinkContainer to="/dashboard">
                <NavItem eventKey={1} href="#">Dashboard</NavItem>
              </LinkContainer>
              <LinkContainer to="/live">
                <NavItem eventKey={2} href="#">Live</NavItem>
              </LinkContainer>
              <LinkContainer to="#">
                <NavItem eventKey={3} href="#">Tweets validés</NavItem>
              </LinkContainer>
              <LinkContainer to="#">
                <NavItem eventKey={4} href="#">Tweets refusés</NavItem>
              </LinkContainer>
            </Nav>
          </CollapsibleNav>
        </Navbar>
      </header>
    )

  }

}

export default HeaderComponent;
