Meteor.methods({
  'preregisterOracleXMLArrivals': function(importData, resArr) {
    check(importData, Object);

    /*
    return Stays.insert({
      hotelId: hotelId,
      importId: importArrivalId,
      "preReg.guestLastName": '==LASTNAME==',
      "preReg.startDate": '==STARTDATE==',
      "preReg.endDate": '==ENDDATE==',
      zone: '==DATE ZONE==',
      active: false
    });
    */
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
