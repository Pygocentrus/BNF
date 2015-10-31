// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class RejectedTweetsComponent extends React.Component {

  render() {

    return (
      <section id="rejected-tweets" className="container">
        <Jumbotron>
          <PageHeader>
            Tweets refusés
          </PageHeader>
        </Jumbotron>
      </section>
    )

  }

}

export default RejectedTweetsComponent;
