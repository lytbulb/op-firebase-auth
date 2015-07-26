import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:reset-password', 'ResetPasswordController', {
  // Specify the other units that are required for this test.
  needs: [
    'service:validations',
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/length'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});
