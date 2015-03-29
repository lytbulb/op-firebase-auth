import config from '../config/environment';

export function initialize(container, application) {
  /**
   * Updated to work without EmberFire and use Firebase directly.
   *
   * It's important to have just one Firebase ref on the app to avoid bugs
   * mocking it on the tests.
   * Firebase has to be a global for MockFirebase to work.
   */
  var ref = new Firebase(config.firebase_url);
  application.register('service:firebase', ref, { instantiate: false });
  application.inject('route', 'firebase', 'service:firebase');
  application.inject('model', 'firebase', 'service:firebase');
  application.inject('controller', 'firebase', 'service:firebase');
  application.inject('component', 'firebase', 'service:firebase');
  application.inject('authenticator', 'firebase', 'service:firebase');
}

export default {
  name: 'firebase-service',
  before: 'simple-auth',
  initialize: initialize
};
