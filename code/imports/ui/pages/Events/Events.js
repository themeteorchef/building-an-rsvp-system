import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import EventsCollection from '../../../api/Events/Events';
import Loading from '../../components/Loading/Loading';

import './Events.scss';

const Events = ({ loading, events, match, history }) => (!loading ? (
  <div className="Events">
    <div className="page-header clearfix">
      <h4 className="pull-left">Events</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add New Event</Link>
    </div>
    {events.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th className="text-center">Guests Confirmed</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {events.map(({ _id, title, attendees }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td className="text-center">{attendees.length}</td>
            <td>
              <Button
                bsStyle="default"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >View</Button>
            </td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}/edit`)}
                block
              >Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No events yet!</Alert>}
  </div>
) : <Loading />);

Events.propTypes = {
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('events');
  return {
    loading: !subscription.ready(),
    events: EventsCollection.find().fetch(),
  };
}, Events);
