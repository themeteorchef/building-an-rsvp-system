import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Events from '../Events';
import Invites from '../../Invites/Invites';

Meteor.publish('events', function events() {
  return Events.find({ owner: this.userId });
});

Meteor.publish('events.view', function eventsView(eventId, inviteId) {
  check(eventId, Match.Maybe(String));
  check(inviteId, Match.Maybe(String));
  const event = Events.find({ _id: eventId });

  if (
    !Invites.findOne({ _id: inviteId, event: eventId }) &&
    event.fetch()[0].owner !== this.userId
  ) return this.ready();

  return event;
});

Meteor.publish('events.invites', function eventsView(event) {
  check(event, Match.Maybe(String));
  if (Events.findOne({ _id: event, owner: this.userId })) {
    return Invites.find({ event });
  }
  return this.ready();
});
