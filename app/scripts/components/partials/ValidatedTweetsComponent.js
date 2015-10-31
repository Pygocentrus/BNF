// Packages
import React from 'react';
import { Button, Jumbotron, PageHeader } from 'react-bootstrap';

class ValidatedTweetsComponent extends React.Component {

  render() {

    return (
      <section id="validated-tweets" className="container">
        <Jumbotron>
          <PageHeader>
            Tweets acceptés
          </PageHeader>
        </Jumbotron>
      </section>
    )

  }

}

export default ValidatedTweetsComponent;
