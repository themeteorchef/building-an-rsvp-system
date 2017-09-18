import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from '../Events';

Meteor.publish('events.view', (eventId) => {
  check(eventId, String);
  return Events.find({ _id: eventId });
});
