/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import Invites from '../Invites/Invites';
import validate from '../../../modules/validate';

class EventEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: (props.event && props.event.date) || moment() };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        date: {
          required: true,
        },
        description: {
          required: true,
        },
        locationName: {
          required: true,
        },
        locationAddress: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need an event title, bub.',
        },
        date: {
          required: 'How about a date?',
        },
        description: {
          required: 'Describe the event for attendees.',
        },
        locationName: {
          required: 'Where is this happening?',
        },
        locationAddress: {
          required: 'What is the address for this event?',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingEvent = this.props.event && this.props.event._id;
    const methodToCall = existingEvent ? 'events.update' : 'events.insert';
    const event = {
      title: this.title.value.trim(),
      date: this.state.date.utc().format(),
      description: this.description.value.trim(),
      location: {
        name: this.locationName.value.trim(),
        address: this.locationAddress.value.trim(),
      },
    };

    if (existingEvent) event._id = existingEvent;

    Meteor.call(methodToCall, event, (error, eventId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingEvent ? 'Event updated!' : 'Event added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/events/${eventId}/edit`);
      }
    });
  }

  render() {
    const { event } = this.props;
    return (<div className="EventEditor">
      <form ref={form => (this.form = form)} onSubmit={submitEvent => submitEvent.preventDefault()}>
        <Row>
          <Col xs={12} sm={6}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <input
                type="text"
                name="title"
                ref={title => (this.title = title)}
                defaultValue={event && event.title}
                className="form-control"
                placeholder="Glastonbury Guitar Swap"
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6}>
            <FormGroup>
              <ControlLabel>Date</ControlLabel>
              <DateTimePicker
                value={this.state.date}
                dateFormat="MMMM Do, YYYY"
                timeFormat="[at] hh:mm a"
                inputProps={{ name: 'date' }}
                onChange={date => this.setState({ date })}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <textarea
                name="description"
                ref={description => (this.description = description)}
                defaultValue={event && event.description}
                className="form-control"
                placeholder="Bring an axe to sell or some cash to take one off someone's hands!"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            <FormGroup>
              <ControlLabel>Location Name</ControlLabel>
              <input
                type="text"
                name="locationName"
                ref={locationName => (this.locationName = locationName)}
                defaultValue={event && event.location && event.location.name}
                className="form-control"
                placeholder="Glastonbury Flea Market"
              />
            </FormGroup>
          </Col>
          <Col xs={7}>
            <FormGroup>
              <ControlLabel>Location Address</ControlLabel>
              <input
                type="text"
                name="locationAddress"
                ref={locationAddress => (this.locationAddress = locationAddress)}
                defaultValue={event && event.location && event.location.address}
                className="form-control"
                placeholder="239 Country Club Road, Glastonbury, CT 06073"
              />
            </FormGroup>
          </Col>
        </Row>
        <Button bsStyle="success" type="submit" block>{event ? 'Save Event' : 'Add New Event'}</Button>
      </form>
      {event ? <Invites event={event._id} /> : ''}
    </div>);
  }
}

EventEditor.defaultProps = {
  event: {},
};

EventEditor.propTypes = {
  event: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default EventEditor;
