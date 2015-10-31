// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class NotFoundComponent extends React.Component {

  render() {

    return (
      <section id="intro" className="container">
        <Jumbotron>
          <PageHeader>
            404 <small>- Not found</small>
          </PageHeader>
        </Jumbotron>
      </section>
    )

  }

}

export default NotFoundComponent;
