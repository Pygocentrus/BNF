// Packages
import React from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Jumbotron, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';

// TODO: Flux architecture
// import DashboardDailyTweets from '../stores/DashboardDailyTweets';

class MainComponent extends React.Component {

  render() {

    return (
      <section id="intro" className="container">
        <Jumbotron>
          <PageHeader>
            Opération BNF
          </PageHeader>
          <p>Interface d'administration</p>

          <ListGroup>
            <LinkContainer to="/live">
              <ListGroupItem href="#">Live</ListGroupItem>
            </LinkContainer>
            <LinkContainer to="/queue">
              <ListGroupItem href="#">File d'attente</ListGroupItem>
            </LinkContainer>
            <LinkContainer to="/validated">
              <ListGroupItem href="#">Tweets validés</ListGroupItem>
            </LinkContainer>
            <LinkContainer to="/rejected">
              <ListGroupItem href="#">Tweets refusés</ListGroupItem>
            </LinkContainer>
          </ListGroup>
        </Jumbotron>
      </section>
    )

  }

}

export default MainComponent;
