var mailgunAuth = function(api_key, token, timestamp, sig) {
  var msg = timestamp + token;
  return sig === CryptoJS.HmacSHA256(msg, api_key).toString();
}

JsonRoutes.add("post", "/arrivals/mailgun", function(req, res, next) {
  console.log('INCOMING EMAIL\n===========');
  console.log('From: '+req.body['From']);
  console.log('Subject: '+req.body['subject']);
  console.log('Date: '+req.body['Date']);

  // for testing
  // if (mailgunAuth(Meteor.settings.mailgun.key, "93ebb35370edd2edc6f44cc4e62f25c12c83a45e622b7822ab", "1433969067", "c3125ef05474e2abf7b6924dcf48dcd65d8eeddd1142b7193c46559eef2691c8")) {
  if (mailgunAuth(Meteor.settings.mailgun.key, req.body.token, req.body.timestamp, req.body.signature)) {

    console.log('Mailgun Auth: true');
    JsonRoutes.sendResult(res, 200, {});

    if (req.body.attachments) {
      console.log('Attachments: true');
      var attachments = JSON.parse(req.body.attachments);

      _.each(attachments, function(attachment) {
        if (attachment["content-type"] === "file/xml") {
          console.log('Found XML attachment: downloading...');
          var file = HTTP.get(attachment.url, {auth: "api:"+Meteor.settings.mailgun.key});
          var fileJson = xml2js.parseStringSync(file.content, {explicitArray: false});
          var resArr = fileJson.RES_DETAIL.LIST_G_GROUP_BY1.G_GROUP_BY1.LIST_G_RESERVATION.G_RESERVATION;
          if (resArr) {
            console.log('Reservations: ' + resArr.length);
            //console.log(resArr);
          } else {
            console.log('XML not in expected format');
          }
        } else {
          console.log('Found non-XML attachment: ignoring...')
        }
      });
    }

  } else {
    console.log('Mailgun Auth: false');
    console.log('Email Rejected\n===========');
    JsonRoutes.sendResult(res, 401, {});

  }
});
