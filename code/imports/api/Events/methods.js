import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from './Events';

Meteor.methods({
  'events.insert': function eventsInsert(event) {
    check(event, Object);
    return Events.insert(event);
  },
  'events.update': function eventsUpdate(event) {
    check(event, Object);
    return Events.update(event._id, { $set: event });
  },
  'events.rsvp': function eventsUpdate(attendee) {
    check(attendee, Object);
    const hasRSVPd = Events.findOne({ _id: event._id, 'attendees.inviteId': attendee.inviteId });

    if (hasRSVPd) {
      return Events.update({
        _id: event._id,
        'attendees.inviteId': attendee.inviteId,
      }, {
        $pull: { 'attendeeds.$.inviteId': attendee.inviteId },
      });
    }

    return Events.update(event._id, { $addToSet: { attendees: attendee } });
  },
});
