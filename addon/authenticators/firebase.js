import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';

/**
 * Custom ember-simple-auth authenticator to support firebase login
 */
export default Base.extend({

  restore: function(data) {
    var _this = this;
    var ref = this.get('firebase');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authData = ref.getAuth();

      if(!data.token) return reject();
      if(authData) return resolve(data);

      ref.authWithCustomToken(data.token, function(error, authData){
        if(error) reject(error);
        resolve(authData);
      });
    });
  },

  authenticate: function(options) {
    var ref = this.get('firebase');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      ref.authWithPassword({
        email: options.email,
        password: options.password
      }, function(error, authData) {
        if (error) {
          reject(error);
        } else {
          resolve(authData);
        }
      });
    });
  },

  invalidate: function(/* data */) {
    var ref = this.get('firebase');
    return new Ember.RSVP.Promise(function(resolve /* , reject */) {
      ref.unauth();
      resolve();
    });
  }

});
