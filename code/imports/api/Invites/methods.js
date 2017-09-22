import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Invites from './Invites';

Meteor.methods({
  'invites.insert': function invitesInsert(invite) {
    check(invite, Object);
    return Invites.insert(invite);
  },
  'invites.remove': function invitesInsert(inviteId) {
    check(inviteId, String);
    return Invites.remove(inviteId);
  },
});
