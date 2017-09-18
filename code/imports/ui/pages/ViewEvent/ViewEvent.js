import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Events from '../../../api/Events/Events';

const ViewEvent = ({ event }) => (
  <div className="ViewEvent">
    <Row>
      <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
        <div className="page-header">
          <h4>{event.title}</h4>
          <Button bsStyle="success">RSVP</Button>
        </div>
        <div className="event-map" />
        <p>{event.description}</p>
      </Col>
    </Row>
  </div>
);

ViewEvent.defaultProps = {
  event: {},
};

ViewEvent.propTypes = {
  event: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('events.view', eventId);
  return {
    loading: !subscription.ready(),
    event: Events.findOne(eventId),
  };
}, ViewEvent);
