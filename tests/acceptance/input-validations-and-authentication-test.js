import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

/* globals MockFirebase */

var application,
    fbRef,
    session;

module('Acceptance: InputValidationsAndAuthentication', {
  beforeEach: function() {
    MockFirebase.override();

    application = startApp();

    var applicationRoute = application.__container__.lookup('route:application');
    fbRef = applicationRoute.get('firebase');
    session = applicationRoute.get('session');

    fbRef.autoFlush();
  },

  afterEach: function() {
    invalidateSession();
    MockFirebase.restore();
    Ember.run(application, 'destroy');
  }
});

test('signup validates and logs the user in', function(assert) {
  visit('/signup');

  andThen(function() {
    assert.equal(currentPath(), 'signup');
    assert.ok(!session.isAuthenticated);
  });

  var testUid = 'testUid' + Math.random().toString(36).substr(2, 5),
      testerEmail = testUid + '@test.com',
      testerPassword = 'testerpassword';

  andThen(function() {
    assert.equal(find('.input-error').length, 0);
  });

  click('button[type="submit"]');

  andThen(function() {
    assert.equal(find('.input-error').length, 3);
  });

  // name-group
  fillIn('.name-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.name-group .input-error').length, 1);
  });

  fillIn('.name-group > input', 'Tester');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.name-group .input-error').length, 0);
  });

  // email-group
  fillIn('.email-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', 'asd');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', 'asd@qwe');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', testerEmail);
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 0);
  });

  // password-group
  fillIn('.password-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 1);
  });

  fillIn('.password-group > input', '12');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 1);
  });

  andThen(function() {
    assert.ok(!session.isAuthenticated, 'the global session is not authenticated yet');
    assert.ok(!fbRef.getEmailUser(testerEmail), 'no user created yet');
    assert.ok(!fbRef.getAuth(), 'firebase is logged out');
  });


  fillIn('.password-group > input', testerPassword);
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 0, 'correct password input');
  });

  andThen(function() {
    Ember.run(function() {
      fbRef.changeAuthState({
        uid: testUid,
        provider: 'custom',
        token: 'authToken',
        expires: Math.floor(new Date() / 1000) + 24 * 60 * 60,
        auth: {
          isAdmin: false
        }
      });
    });
  });

  andThen(function() {
    assert.ok(session.isAuthenticated, 'user was authenticated on the global session');
    assert.ok(fbRef.getEmailUser(testerEmail), 'user created on firebase\'s login');
    assert.ok(fbRef.getAuth(), 'firebase is logged in');
  });
});



test('login validates and logs the user in, and logout button works', function(assert) {
  visit('/signin');

  andThen(function() {
    assert.equal(currentPath(), 'signin');
    assert.ok(!session.isAuthenticated);
  });

  var testUid = 'testUid' + Math.random().toString(36).substr(2, 5),
      testerEmail = testUid + '@test.com',
      testerPassword = 'testerpassword';

  andThen(function() {
    assert.equal(find('.input-error').length, 0);
  });

  click('button[type="submit"]');

  andThen(function() {
    assert.equal(find('.input-error').length, 2);
  });

  // email-group
  fillIn('.email-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', 'asd');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', 'asd@qwe');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', testerEmail);
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 0);
  });

  // password-group
  fillIn('.password-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 1);
  });

  andThen(function() {
    assert.ok(!session.isAuthenticated, 'the global session is not authenticated yet');
    assert.ok(!fbRef.getAuth(), 'firebase is logged out');
  });


  fillIn('.password-group > input', testerPassword);
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 0, 'correct password input');
  });

  andThen(function() {
    Ember.run(function() {
      fbRef.changeAuthState({
        uid: testUid,
        provider: 'custom',
        token: 'authToken',
        expires: Math.floor(new Date() / 1000) + 24 * 60 * 60,
        auth: {
          isAdmin: false
        }
      });
    });
  });

  andThen(function() {
    assert.ok(session.isAuthenticated, 'user was authenticated on the global session');
    assert.ok(fbRef.getAuth(), 'firebase is logged in');
  });

  click('button.logout-button');

  andThen(function() {
    assert.ok(!session.isAuthenticated, 'the global session is not authenticated');
    assert.ok(!fbRef.getAuth(), 'firebase is logged out');
  });
});



test('forgot-password validates', function(assert) {
  visit('/forgot-password');

  andThen(function() {
    assert.equal(currentPath(), 'forgot-password');
    assert.ok(!session.isAuthenticated);
  });

  var testUid = 'testUid' + Math.random().toString(36).substr(2, 5),
      testerEmail = testUid + '@test.com';

  andThen(function() {
    assert.equal(find('.input-error').length, 0);
  });

  click('button[type="submit"]');

  andThen(function() {
    assert.equal(find('.input-error').length, 1);
  });

  // email-group
  fillIn('.email-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', 'asd');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', 'asd@qwe');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 1);
  });

  fillIn('.email-group > input', testerEmail);
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.email-group .input-error').length, 0);
  });
});



test('reset-password validates and logs the user in', function(assert) {
  var testUid = 'testUid' + Math.random().toString(36).substr(2, 5),
      testerEmail = testUid + '@test.com',
      testerPassword = 'testerpassword',
      newTesterPassword = 'newtesterpassword';

  // create a user
  andThen(function() {
    new Ember.RSVP.Promise(function(resolve, reject) {
      fbRef.createUser({
        email: testerEmail,
        password: testerPassword
      }, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  visit('/reset-password?userEmail=' + testerEmail + '&resetCode=' + testerPassword);

  andThen(function() {
    assert.equal(currentPath(), 'reset-password');
    assert.ok(!session.isAuthenticated);
  });

  andThen(function() {
    assert.equal(find('.input-error').length, 0);
  });

  click('button[type="submit"]');

  andThen(function() {
    assert.equal(find('.input-error').length, 1, 'form has errors');
  });

  // password-group
  fillIn('.password-group > input', '');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 1, 'password must be present');
  });

  fillIn('.password-group > input', '12');
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 1);
  });

  andThen(function() {
    assert.ok(!session.isAuthenticated, 'the global session is not authenticated yet');
    assert.ok(!fbRef.getAuth(), 'firebase is logged out');
  });


  fillIn('.password-group > input', newTesterPassword);
  click('button[type="submit"]');
  andThen(function() {
    assert.equal(find('.password-group .input-error').length, 0, 'correct password input');
  });

  andThen(function() {
    Ember.run(function() {
      fbRef.changeAuthState({
        uid: testUid,
        provider: 'custom',
        token: 'authToken',
        expires: Math.floor(new Date() / 1000) + 24 * 60 * 60,
        auth: {
          isAdmin: false
        }
      });
    });
  });

  andThen(function() {
    assert.ok(session.isAuthenticated, 'user was authenticated on the global session');
    assert.ok(fbRef.getAuth(), 'firebase is logged in');
  });
});
