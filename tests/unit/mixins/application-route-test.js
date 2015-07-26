import Ember from 'ember';
import ApplicationRouteMixin from 'op-firebase-auth/mixins/application-route';
import { module, test } from 'qunit';

/* globals MockFirebase */

module('ApplicationRouteMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var ApplicationRouteObject = Ember.Object.extend(ApplicationRouteMixin);

  // mock firebase injection
  ApplicationRouteObject.reopen({
    firebase: new MockFirebase()
  });

  var subject = ApplicationRouteObject.create();
  assert.ok(subject);
});
