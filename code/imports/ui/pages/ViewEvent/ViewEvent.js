import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import queryString from 'query-string';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Events from '../../../api/Events/Events';
import Loading from '../../components/Loading/Loading';
import RSVPModal from '../../components/RSVPModal/RSVPModal';

import './ViewEvent.scss';

class ViewEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showRSVPModal: !!props.inviteId || false };
    this.renderedEvent = this.renderEvent.bind(this);
  }

  getMapUrl(event) {
    const apiKey = Meteor.settings.public.googleMaps.apiKey;
    return `http://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${event.location.name} ${event.location.address} ${event.location.city} ${event.location.state} ${event.location.postalCode}&center=${event.location.latitude},${event.location.longitude}`;
  }

  renderEvent() {
    const { event, inviteId } = this.props;
    return (event && event._id ? <div className="ViewEvent">
      <Row>
        <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
          <div className="page-header clearfix">
            <h4 className="pull-left">{event.title}</h4>
            {inviteId ? <Button
              bsStyle="success"
              className="pull-right"
              onClick={() => { this.setState({ showRSVPModal: true }); }}
            >RSVP</Button> : ''}
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
        inviteId={inviteId}
        show={this.state.showRSVPModal}
        event={event}
        onHide={() => { this.setState({ showRSVPModal: false }); }}
      />
    </div> : <Alert bsStyle="warning">{'Sorry, we couldn\'t find that event!'}</Alert>);
  }

  render() {
    const { loading } = this.props;
    return (!loading ? (this.renderEvent()) : <Loading />);
  }
}

ViewEvent.defaultProps = {
  event: {},
};

ViewEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  inviteId: PropTypes.string.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const queryParams = queryString.parse(location.search);
  const inviteId = queryParams.invite;
  const subscription = Meteor.subscribe('events.view', eventId, inviteId);

  return {
    loading: !subscription.ready(),
    event: Events.findOne(eventId),
    inviteId,
  };
}, ViewEvent);
