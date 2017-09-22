import { monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Events from './Events';
import Invites from '../Invites/Invites';
import sendEmail from '../../modules/server/send-email';

const geocoder = require('node-geocoder')(); // Invoke the returned method immediately.

const getEventWithAddress = (owner, { title, date, description, location }) => {
  return new Promise((resolve, reject) => {
    geocoder.geocode(location.address, (error, address) => {
      if (error) {
        reject(error);
      } else {
        const { latitude, longitude, streetNumber, streetName, city, administrativeLevels: { level1short }, zipcode } = address[0]; // eslint-disable-line
        resolve({
          owner,
          title,
          date,
          description,
          location: {
            name: location.name,
            address: `${streetNumber} ${streetName}`,
            city,
            state: level1short, // This maps to the state. Couldn't tell you why. Ask Google!
            postalCode: zipcode,
            latitude,
            longitude,
          },
        });
      }
    });
  });
};

Meteor.methods({
  'events.insert': function eventsInsert(event) {
    check(event, Object);
    return getEventWithAddress(this.userId, event)
      .then(Meteor.bindEnvironment((eventToInsert) => {
        const eventId = Events.insert(eventToInsert);
        return eventId;
      }))
      .catch((error) => {
        throw new Meteor.Error('500', `${error}`);
      });
  },
  'events.update': function eventsUpdate(event) {
    check(event, Object);
    return Events.update({
      _id: event._id,
      owner: this.userId,
    }, { $set: getEventWithAddress(this.userId, event) });
  },
  'events.sendInvite': function eventsSendInvite(invitationId) {
    check(invitationId, String);
    const invitation = Invites.findOne(invitationId);
    const event = Events.findOne(invitation.event);
    return sendEmail({
      to: invitation.emailAddress,
      from: 'Eventually <demo@themeteorchef.com>',
      subject: '[Eventually] You\'re Invited!',
      template: 'invite',
      templateVars: {
        firstName: invitation.firstName,
        eventTitle: event.title,
        eventDate: monthDayYearAtTime(event.date),
        rsvpUrl: Meteor.absoluteUrl(`events/${event._id}?invite=${invitation._id}`),
      },
    })
      .then(Meteor.bindEnvironment(() => {
        Invites.update(invitationId, { $set: { lastSent: (new Date()).toISOString() } })
      }))
      .catch((error) => {
        throw new Meteor.Error('500', `${error}`);
      });
  },
  'events.rsvp': function eventsRSVP(rsvp) {
    check(rsvp, Object);
    const { event, inviteId, response } = rsvp;
    const invite = Invites.findOne({ _id: inviteId });
    const hasRSVPd = Events.findOne({ _id: event, 'attendees.inviteId': inviteId });

    if (invite) {
      const attendee = {
        inviteId,
        emailAddress: invite.emailAddress,
        plusOne: (response === 'yesPlusOne'),
      };

      if (hasRSVPd) {
        const update = response === 'no' ?
          { $pull: { attendees: { inviteId } } } :
          { $set: { 'attendees.$': attendee } };

        return Events.update({
          _id: event,
          'attendees.inviteId': inviteId,
        }, update);
      }

      return Events.update({ _id: event }, { $addToSet: { attendees: attendee } });
    }

    throw new Meteor.Error('500', 'Sorry we couldn\'t find an invite with that ID.');
  },
});
