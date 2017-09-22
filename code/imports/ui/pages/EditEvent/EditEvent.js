import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Events from '../../../api/Events/Events';
import EventEditor from '../../components/EventEditor/EventEditor';
import NotFound from '../NotFound/NotFound';

const EditEvent = ({ event, history }) => (event ? (
  <div className="EditEvent">
    <Row>
      <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
        <div className="page-header clearfix">
          <h4 className="pull-left">{`Editing "${event.title}"`}</h4>
          <Link className="btn btn-default pull-right" to={`/events/${event._id}`}>View Event</Link>
        </div>
        <EventEditor
          event={event}
          history={history}
        />
      </Col>
    </Row>
  </div>
) : <NotFound />);

EditEvent.defaultProps = {
  doc: null,
};

EditEvent.propTypes = {
  event: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('events.view', eventId);

  return {
    loading: !subscription.ready(),
    event: Events.findOne(eventId),
  };
}, EditEvent);
