// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class LiveComponent extends React.Component {

  render() {

    return (
      <section id="intro" className="container">
        <Jumbotron>
          <PageHeader>
            Livestream
          </PageHeader>
        </Jumbotron>
      </section>
    )

  }

}

export default LiveComponent;
