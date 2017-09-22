import React from 'react';
import PropTypes from 'prop-types';
import { monthDayYearAtTime } from '@cleverbeagle/dates';
import { Row, Col, Panel, Button, Table, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { createContainer } from 'meteor/react-meteor-data';
import Icon from '../Icon/Icon';
import validate from '../../../modules/validate';
import InvitesCollection from '../../../api/Invites/Invites';

class Invites extends React.Component {
  constructor(props) {
    super(props);

    this.renderInvites = this.renderInvites.bind(this);
    this.renderAddInviteForm = this.renderAddInviteForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemoveInvite = this.handleRemoveInvite.bind(this);
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
        },
      },
      messages: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { event } = this.props;
    Meteor.call('invites.insert', {
      event,
      firstName: document.querySelector('[name="firstName"]').value,
      lastName: document.querySelector('[name="lastName"]').value,
      emailAddress: document.querySelector('[name="emailAddress"]').value,
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
    });
  }

  handleRemoveInvite(_id) {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('invites.remove', _id, (error, response) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Invite removed!', 'success');
        }
      });
    }
  }

  handleSendInvite(_id) {
    if (confirm('Send invite now?')) {
      Meteor.call('events.sendInvite', _id, (error, response) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Invite sent!', 'success');
        }
      });
    }
  }

  renderInvites() {
    const { invites } = this.props;
    return (invites.length > 0 ? (
      <Table bordered striped responsive>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th className="text-center">Email Address</th>
            <th className="text-center">Last Sent</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {invites.map(({ _id, firstName, lastName, emailAddress, lastSent }) => (
            <tr key={_id}>
              <td className="vertical-align">{firstName}</td>
              <td className="vertical-align">{lastName}</td>
              <td className="vertical-align text-center">{emailAddress}</td>
              <td className="vertical-align text-center">{lastSent ? monthDayYearAtTime(lastSent) : 'Not Sent'}</td>
              <td className="vertical-align" width="10%">
                <Button block bsStyle="primary" onClick={() => this.handleSendInvite(_id)}>
                  Send
                </Button>
              </td>
              <td className="vertical-algin" width="10%">
                <Button block bsStyle="danger" onClick={() => this.handleRemoveInvite(_id)}>
                  <Icon icon="remove" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : <Alert bsStyle="warning">No invitees added yet.</Alert>);
  }

  renderAddInviteForm() {
    return (<form ref={form => (this.form = form)}>
      <Panel className="AddInvitee">
        <Row>
          <Col xs={12} sm={3}>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="John"
            />
          </Col>
          <Col xs={12} sm={3}>
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="McEnroe"
            />
          </Col>
          <Col xs={12} sm={4}>
            <input
              type="text"
              name="emailAddress"
              className="form-control"
              placeholder="throwtheracket@gmail.com"
            />
          </Col>
          <Col xs={12} sm={2}>
            <Button type="submit" bsStyle="success" block><Icon icon="plus" /></Button>
          </Col>
        </Row>
      </Panel>
    </form>);
  }

  render() {
    return (
      <div className="Invites">
        <h4 className="page-header">Invites</h4>
        {this.renderAddInviteForm()}
        {this.renderInvites()}
      </div>
    );
  }
}

Invites.propTypes = {
  event: PropTypes.string.isRequired,
  invites: PropTypes.array.isRequired,
};

export default createContainer(({ event }) => {
  const subscription = Meteor.subscribe('events.invites', event);
  return {
    loading: !subscription.ready(),
    invites: InvitesCollection.find({ event }).fetch(),
  };
}, Invites);
