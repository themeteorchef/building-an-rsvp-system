import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Events from '../../api/Events/Events';

const eventsSeed = userId => ({
  collection: Events,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 1,
  model() {
    return {
      owner: userId,
      title: 'Amelia & Josh\'s Wedding',
      description: 'Amelia and Josh are—finally—getting married. Join us for the ceremony and reception (and pat Josh on the back)!',
      date: moment().add(1, 'month').utc().format(),
      location: {
        name: 'Calistoga Wedding Venue',
        address: '755 Silverado Trail',
        city: 'Calistoga',
        state: 'California',
        postalCode: '94515',
        latitude: 38.5841474,
        longitude: -122.5709956,
      },
    };
  },
});

seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: true,
  data: [{
    email: 'amelia.webster@beaglebox.xyz',
    password: 'password',
    profile: {
      name: {
        first: 'Amelia',
        last: 'Webster',
      },
    },
    roles: ['user'],
    data(userId) {
      return eventsSeed(userId);
    },
  }],
});
