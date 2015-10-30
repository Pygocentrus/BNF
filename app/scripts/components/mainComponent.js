// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class MainComponent extends React.Component {

  render() {

    return (
      <section id="intro" className="container">
        <Jumbotron>
          <PageHeader>
            Opération BNF <small>- Interface d'administration</small>
          </PageHeader>
        </Jumbotron>
      </section>
    )

  }

}

export default MainComponent;
