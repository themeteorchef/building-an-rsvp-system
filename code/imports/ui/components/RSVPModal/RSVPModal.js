import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import './RSVPModal.scss';

class RSVPModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeOption: 'yesPlusOne' };
    this.renderOptions = this.renderOptions.bind(this);
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
          className={`RSVPOption ${this.state.activeOption === value ? 'selected' : ''}`}
          onClick={() => { this.setState({ activeOption: value }); }}
        >
          <h4>{title}</h4>
          <p>{description}</p>
        </button>
      ))}
    </div>);
  }

  render() {
    const { show, onClose, event } = this.props;
    return (
      <div className="RSVPModal">
        <Modal.Dialog show={show} onClose={onClose}>
          <Modal.Header>
            <Modal.Title>Can you make it to {event.title}?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderOptions()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClose={onClose}>Cancel</Button>
            <Button bsStyle="success">Respond</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
}

RSVPModal.propTypes = {};

export default RSVPModal;
