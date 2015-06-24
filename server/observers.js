HotelDDP = Cluster.discoverConnection('hotel');

ArrivalImports.find({
  registered: false
}).observe({
  added: function(doc) {
    console.log("observed new doc");

    HotelDDP.call('getHotelImportData', doc.from, function(err, importData) {
      if (err) {
        console.log(err)
      } else {
        switch (doc.format) {
          case 'oracleXML':
            Meteor.call('preregisterOracleXMLArrivals', importData, doc.reservations, function(err, res) {
              if (err) {
                console.log(err);
              } else {
                ArrivalImports.update(doc._id, {
                  registered: true
                });
              }
            });
            break;
          default:
            console.log('ERROR! Format ' + doc.format + ' is not supported');
            console.log('DOC ID: ' + doc._id);
        }
      }
    });
  }
});
