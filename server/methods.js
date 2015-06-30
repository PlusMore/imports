Meteor.methods({
  'preregisterOracleXMLArrivals': function(importData, resArr) {
    check(importData, Object);

    var zone = moment().zone();

    _.each(resArr, function(res) {
      var year = parseInt('20' + res.ARRIVAL[6] + res.ARRIVAL[7]);
      var month = parseInt(res.ARRIVAL[0]+res.ARRIVAL[1]);
      var day = parseInt(res.ARRIVAL[0]+res.ARRIVAL[4]);
      var startDate = new Date(year, month, day);

      year = parseInt('20' + res.DEPARTURE[6] + res.DEPARTURE[7]);
      month = parseInt(res.DEPARTURE[0]+res.DEPARTURE[1]);
      day = parseInt(res.DEPARTURE[0]+res.DEPARTURE[4]);
      var endDate = new Date(year, month, day);

      var name = res.FULL_NAME.split(',');

      Stays.insert({
        hotelId: importData.hotelId,
        "preReg.guestLastName": name[0],
        "preReg.startDate": startDate,
        "preReg.endDate": endDate,
        zone: zone,
        active: false
      });

    });
  },
  'insertOracleXMLArrivals': function(emailDetails, resArr) {
    check(emailDetails, Object);
    check(resArr, Array);

    _.extend(emailDetails, {
      registered: false,
      format: 'oracleXML'
    });

    return ArrivalImports.insert({
      from: emailDetails.from,
      date: emailDetails.date,
      registered: emailDetails.registered,
      format: emailDetails.format,
      reservations: resArr
    });
  }
});
