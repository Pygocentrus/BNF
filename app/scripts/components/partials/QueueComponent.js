// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class QueueComponent extends React.Component {

  render() {

    return (
      <section id="validated-tweets" className="container">
        <Jumbotron>
          <PageHeader>
            File d'attente
          </PageHeader>
          <p>Tweets validés en attente d'affichage sur la BNF</p>
        </Jumbotron>
      </section>
    )

  }

}

export default QueueComponent;
