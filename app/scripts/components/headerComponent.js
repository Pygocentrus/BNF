// Packages
import React from 'react';
import { Navbar, Nav, NavBrand, CollapsibleNav, NavItem, NavDropdown, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';

// Modules
import AppDispatcher from '../dispatchers/AppDispatcher';
import LivestreamConstants from '../constants/LivestreamConstants';

class HeaderComponent extends React.Component {

  constructor(props) {}

  componentWillMount() {
    this.setState({
      counter: 0
    });
  }

  componentDidMount() {}

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
                <NavItem eventKey={1} href="#">
                  <Glyphicon glyph="dashboard" />&nbsp;
                  Dashboard
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/live">
                <NavItem eventKey={2} href="#">
                  <Glyphicon glyph="globe" />&nbsp;
                  Live
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/queue">
                <NavItem eventKey={3} href="#">
                  <Glyphicon glyph="list-alt" />&nbsp;
                  File d'attente BNF
                </NavItem>
              </LinkContainer>
              <NavDropdown eventKey={4} title="Tweets" id="collapsible-navbar-dropdown">
                <LinkContainer to="/displayed">
                  <NavItem eventKey={5} href="#">
                    <Glyphicon glyph="ok" />&nbsp;
                    Affichés
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/rejected">
                  <NavItem eventKey={6} href="#">
                    <Glyphicon glyph="remove" />&nbsp;
                    Refusés
                  </NavItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </CollapsibleNav>
        </Navbar>
      </header>
    )

  }

}

export default HeaderComponent;
