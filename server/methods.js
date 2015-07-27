Meteor.methods({
  'preregisterOracleXMLArrivals': function(importData, resArr) {
    check(importData.hotelId, String);
    var hotelId = importData.hotelId;
    var staysToInsert = [];

    _.each(resArr, function(res) {
      var startDateMoment = moment(res.ARRIVAL);
      var startDate = startDateMoment.toDate();

      var endDateMoment = moment(res.DEPARTURE);
      var endDate = endDateMoment.toDate();

      var name = res.FULL_NAME.split(',');

      console.log('checking if stay already exists in system', name, hotelId);

      var upcomingStay = Stays.findOne({
        hotelId: hotelId,
        "preReg.guestFirstName": name[1],
        "preReg.guestLastName": name[0],
        "preReg.startDate": startDate,
        "preReg.endDate": endDate,
        active: false
      });

      if (! upcomingStay) {
        console.log('stay needs to be inserted', name, hotelId);

        staysToInsert.push({
          hotelId: hotelId,
          guestFirstName: name[1],
          guestLastName: name[0],
          startDate: startDate,
          endDate: endDate,
          active: false
        });
      }

    });

    // Other way had 100s of separate connections, more efficient to send all
    // stays to be imported to hotel service
    if (staysToInsert.length > 0) {
      console.log('number of stays to be inserted:', staysToInsert.length);
      HotelService.call('registerImportedStays', staysToInsert);
    }
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
