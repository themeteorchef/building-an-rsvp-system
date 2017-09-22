import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import './RSVPModal.scss';

class RSVPModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { response: 'yesPlusOne' };
    this.handleResponse = this.handleResponse.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  handleResponse() {
    const { event, inviteId, onHide } = this.props;
    const { response } = this.state;
    const formattedEventDate = monthDayYearAtTime(event.date);
    Meteor.call('events.rsvp', {
      event: event._id,
      inviteId,
      response,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert({
          yesPlusOne: `Great! We'll see you and your guest on ${formattedEventDate}`,
          yesAlone: `Great! We'll see you on ${formattedEventDate}`,
          no: 'Aw, too bad :( Thanks for letting us know!',
        }[response], 'success');
        onHide();
      }
    });
  }

  renderOptions() {
    const options = [
      { value: 'yesPlusOne', title: 'Yes!', description: 'Add a +1 for me.' },
      { value: 'yesAlone', title: 'Yes!', description: 'I\'ll be coming alone.' },
      { value: 'no', title: 'No, sorry.', description: 'I can\'t make it :(' },
    ];

    return (<div className="RSVPOptions clearfix">
      {options.map(({ value, title, description }) => (
        <button
          key={value}
          className={`RSVPOption ${this.state.response === value ? 'selected' : ''}`}
          onClick={() => { this.setState({ response: value }); }}
        >
          <h4>{title}</h4>
          <p>{description}</p>
        </button>
      ))}
    </div>);
  }

  render() {
    const { show, onHide, event } = this.props;
    return (
      <Modal className="RSVPModal" show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Can you make it to {event.title}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderOptions()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Cancel</Button>
          <Button onClick={this.handleResponse} bsStyle="success">Respond</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

RSVPModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  inviteId: PropTypes.string.isRequired,
};

export default RSVPModal;
