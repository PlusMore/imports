Hotels = new Meteor.Collection('hotels', {
  connection: Cluster.discoverConnection('hotel')
});

// Allow/Deny

Hotels.allow({
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
