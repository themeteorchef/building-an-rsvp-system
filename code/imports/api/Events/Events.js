import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Events = new Mongo.Collection('Events');

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const EventsSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'The ID of the user that created this event.',
  },
  title: {
    type: String,
    label: 'The title of the event.',
  },
  description: {
    type: String,
    label: 'The description of the event.',
  },
  date: {
    type: String,
    label: 'The ISO-8601 formatted date for the event.',
  },
  location: {
    type: Object,
    label: 'The location details for the event.',
  },
  'location.name': {
    type: String,
    label: 'The name of the event\'s location.',
  },
  'location.address': {
    type: String,
    label: 'The street address of the event\'s location.',
  },
  'location.city': {
    type: String,
    label: 'The city of the event\'s location.',
  },
  'location.state': {
    type: String,
    label: 'The state of the event\'s location.',
  },
  'location.postalCode': {
    type: String,
    label: 'The postal code of the event\'s location.',
  },
  'location.latitude': {
    type: Number,
    label: 'The latitude coordinate of the event\'s location.',
  },
  'location.longitude': {
    type: Number,
    label: 'The longitude coordinate of the event\'s location.',
  },
  attendees: {
    type: Array,
    label: 'Confirmed attendees for the event.',
    defaultValue: [],
  },
  'attendees.$': {
    type: Object,
    label: 'An attendee for the event.',
  },
  'attendees.$.inviteId': {
    type: String,
    label: 'Invite ID of the attendee.',
  },
  'attendees.$.firstName': {
    type: String,
    label: 'First name of the attendee.',
  },
  'attendees.$.lastName': {
    type: String,
    label: 'Last name of the attendee.',
  },
  'attendees.$.emailAddress': {
    type: String,
    label: 'Email address of the attendee.',
  },
  'attendees.$.plusOne': {
    type: Boolean,
    label: 'Should we expect an additional guest for the attendee?',
  },
});

Events.attachSchema(EventsSchema);

export default Events;
