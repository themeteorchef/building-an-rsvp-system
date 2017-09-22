import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Invites = new Mongo.Collection('Invites');

Invites.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Invites.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const InvitesSchema = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First name of the invitee.',
  },
  lastName: {
    type: String,
    label: 'Last name of the invitee.',
  },
  emailAddress: {
    type: String,
    label: 'The email address where this invite is being sent.',
  },
  event: {
    type: String,
    label: 'The ID of the event this invite is for.',
  },
  lastSent: {
    type: String,
    label: 'The date this event was last sent.',
    optional: true,
  },
  response: {
    type: String,
    allowedValues: ['Yes, +1', 'Yes', 'No'],
    label: 'What was this invitees resposne?',
    optional: true,
  },
});

Invites.attachSchema(InvitesSchema);

export default Invites;
