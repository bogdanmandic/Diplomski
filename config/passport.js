var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = 'SomeSuperSecret';
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({ _id: jwt_payload._id}, function(err, user) {
              if (err) {
                  return done(err, false);
              }
              if (user) {
                  //user.password = '';
                  done(null, user);
              } else {
                  console.log('usao u else');
                  done(null, false);
              }
          });
      }));

}