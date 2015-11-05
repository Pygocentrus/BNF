// Packages
import React from 'react';
import { Navbar, Nav, NavBrand, CollapsibleNav, NavItem, NavDropdown, Glyphicon, Badge } from 'react-bootstrap';
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

  componentDidMount() {
    // Register dispatcher callback
    AppDispatcher.register((payload) => {
      let action = payload.action;

      switch(action.actionType) {
        case LivestreamConstants.LIVESTREAM_RETWEETS_ALL:
          if (action.retweets.length) {
            this.setState({ counter: action.retweets.length });
          }
          break;
        case LivestreamConstants.LIVESTREAM_RETWEETS_NEW:
          this.setState({ counter: this.state.counter + 1 });
          break;
        case LivestreamConstants.LIVESTREAM_RETWEETS_VALIDATE:
          this.setState({ counter: this.state.counter - 1 });
          break;
        case LivestreamConstants.LIVESTREAM_RETWEETS_REJECT:
          this.setState({ counter: this.state.counter - 1 });
          break;
        default:
          return true;
      }
      return true;
    });
  }

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
                  Live&nbsp;<Badge>{ this.state.counter }</Badge>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/queue">
                <NavItem eventKey={3} href="#">
                  <Glyphicon glyph="list-alt" />&nbsp;
                  File d'attente BNF
                </NavItem>
              </LinkContainer>
              <NavDropdown eventKey={4} title="Tweets" id="collapsible-navbar-dropdown">
                <LinkContainer to="/validated">
                  <NavItem eventKey={5} href="#">
                    <Glyphicon glyph="ok" />&nbsp;
                    Validés
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
