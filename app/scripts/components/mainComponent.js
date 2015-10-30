// Packages
import React from 'react';
import { Link } from 'react-router';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class MainComponent extends React.Component {

  render() {

    return (
      <section id="intro" className="container">
        <Jumbotron>
          <PageHeader>
            Opération BNF <small>- Interface d'administration</small>
          </PageHeader>
          <Link to="/live">Live</Link>
        </Jumbotron>
      </section>
    )

  }

}

export default MainComponent;
