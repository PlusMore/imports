var mailgunAuth = function (api_key, token, timestamp, sig) {
  var msg = timestamp + token;
  return sig === CryptoJS.HmacSHA256(msg, api_key).toString();
}

JsonRoutes.add("post", "/arrivals/mailgun", function (req, res, next) {
  // for testing
  // if (mailgunAuth(Meteor.settings.mailgun.key, "93ebb35370edd2edc6f44cc4e62f25c12c83a45e622b7822ab", "1433969067", "c3125ef05474e2abf7b6924dcf48dcd65d8eeddd1142b7193c46559eef2691c8")) {
  if (mailgunAuth(Meteor.settings.mailgun.key, req.body.token, req.body.timestamp, req.body.sig)) {
    console.log(req.body);
    JsonRoutes.sendResult(res, 200, {});
  } else {
    JsonRoutes.sendResult(res, 401, {});
  }
});
