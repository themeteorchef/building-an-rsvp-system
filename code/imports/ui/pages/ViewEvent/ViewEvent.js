import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Events from '../../../api/Events/Events';
import Loading from '../../components/Loading/Loading';
import RSVPModal from '../../components/RSVPModal/RSVPModal';

import './ViewEvent.scss';

class ViewEvent extends React.Component {
  getMapUrl(event) {
    const apiKey = Meteor.settings.public.googleMaps.apiKey;
    return `http://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${event.location.name} ${event.location.address} ${event.location.city} ${event.location.state} ${event.location.postalCode}&center=${event.location.latitude},${event.location.longitude}`;
  }

  render() {
    const { loading, event } = this.props;
    return (!loading ? (
      <div className="ViewEvent">
        <Row>
          <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
            <div className="page-header clearfix">
              <h4 className="pull-left">{event.title}</h4>
              <Button bsStyle="success" className="pull-right">RSVP</Button>
            </div>
            <div className="event-map">
              <iframe
                title="event-map"
                width="100%"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                src={this.getMapUrl(event)}
                allowFullScreen
              />
            </div>
            <Row>
              <Col xs={12} sm={4}>
                <strong>Event Address</strong>
                <addr>
                  <p>{event.location.name}</p>
                  <p>{event.location.address}</p>
                  <p>{event.location.city}, {event.location.state} {event.location.postalCode}</p>
                </addr>
              </Col>
              <Col xs={12} sm={8}>
                <p>{event.description}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <RSVPModal
          show
          event={event}
          onClose={() => {}}
        />
      </div>
    ) : <Loading />);
  }
}

ViewEvent.defaultProps = {
  event: {},
};

ViewEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
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
