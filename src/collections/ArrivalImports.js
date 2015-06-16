ArrivalImports = new Meteor.Collection('arrivalImports');

// Allow/Deny

ArrivalImports.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return false;
  },
  remove: function(userId, doc) {
    return false;
  }
});

Meteor.methods({
  'insertOracleArrivals': function(emailDetails, resArr) {
    check(emailDetails, Object);
    check(resArr, Object);

    _.extend(emailDetails, {
      registered: false,
      format: 'oracleXML'
    });

    _.each(resArr, function(reservation) {
      ArrivalImports.insert({
        from: emailDetails.from,
        date: emailDetails.date,
        registered: emailDetails.registered,
        format: emailDetails.format,
        reservation: reservation
      });
    });

    return;
  }
});
