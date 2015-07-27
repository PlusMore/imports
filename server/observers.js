ProcessedObservations = new Meteor.Collection('processedObservations');

var observationHasBeenProcessed = function(observation) {
  var processedObservation = ProcessedObservations.findOne(observation);
  return !! processedObservation;
};

Meteor.startup(function() {
  ArrivalImports.find({
    registered: false
  }).observe({
    added: function(doc) {
      var observation = {
        collectionName: ArrivalImports._name,
        hook: 'added',
        docId: doc._id
      };

      if (! observationHasBeenProcessed(observation)) {
        ProcessedObservations.insert(observation);

        console.log("new observation", ArrivalImports._name, 'added', doc._id);

        HotelService.call('getHotelImportData', doc.from, function(err, importData) {
        if (err) {
          console.log('Error retrieving hotel import data:');
          console.log(err)
        } else {
          switch (doc.format) {
            case 'oracleXML':
              console.log('detected format OracleXML, preregister arrivals');
              Meteor.call('preregisterOracleXMLArrivals', importData, doc.reservations, function(err, res) {
                if (err) {
                  console.log('error preregistering arrivals');
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


    }
  });

});
