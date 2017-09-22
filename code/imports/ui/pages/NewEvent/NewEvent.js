import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import EventEditor from '../../components/EventEditor/EventEditor';

const NewEvent = ({ history }) => (
  <div className="NewEvent">
    <Row>
      <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>
        <h4 className="page-header">Add New Event</h4>
        <EventEditor history={history} />
      </Col>
    </Row>
  </div>
);

NewEvent.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewEvent;
