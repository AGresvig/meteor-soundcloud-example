Tracks = new Meteor.Collection('tracks');

// Methods
Meteor.methods({
  createTrack: function(track){
    Tracks.insert(track);
  },
  removeTrack: function(item){
    Tracks.remove(track._id);
  }
});