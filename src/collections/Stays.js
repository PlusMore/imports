Stays = new Meteor.Collection('stays', {
  connection: HotelService
});

// Allow/Deny

Stays.allow({
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
