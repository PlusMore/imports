Meteor.methods({
  'preregisterOracleXMLArrival': function(hotelId, importArrivalId) {
    check(hotelId, String);
    check(importArrivalId, String);

    var hotel = Hotels.findOne(hotelId);

    var importArrival = ImportArrivals.findOne(importArrivalId);
    var resDetails = importArrival.reservation;

    return Stays.insert({
      hotelId: hotelId,
      importId: importArrivalId,
      "preReg.guestLastName": '==LASTNAME==',
      "preReg.startDate": '==STARTDATE==',
      "preReg.endDate": '==ENDDATE==',
      zone: '==DATE ZONE=='
      active: false
    });
  }
});
