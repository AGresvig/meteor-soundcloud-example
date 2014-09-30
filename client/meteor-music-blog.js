Router.configure({layoutTemplate: 'masterLayout'});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('importLikes', {path: '/import'});
  this.route('edit', {path: '/edit'});
});

Template._loginButtonsLoggedInDropdown.events({
    'click #soundcloud-login': function(event) {
        event.stopPropagation();
        Template._loginButtons.toggleDropdown();
        Meteor.loginWithSoundcloud(function(evt) {
            console.log("Logged in");
        });
    }
});

Template.importLikes.likes = function() {
    Session.set("selectedTracks", null);
    return Soundcloud.getLikes();
}

Template.importLikes.selectedLikes = function() {
    return Session.get("selectedTracks");
}

Template.importLikes.events({
    'click .like-track': function (event) {
        var track = this;
        var selectedTracks = Session.get("selectedTracks") ? Session.get("selectedTracks").slice() : [];

        //Meteor._debug("Removing tag \"" + this + "\", index: " + index, ", typeof(this) = " + typeof(this).toString());

        //If we have this track selected already
        if(_.findWhere(selectedTracks, {id: track.id})) {
            //..then unselect it
            track.selected = false;
            Session.set("selectedTracks", _.without(selectedTracks, _.findWhere(selectedTracks, {id: track.id})));
        } else {
            //..otherwise select it
            track.selected = true;
            Session.set("selectedTracks", selectedTracks.concat(track));
        }
        //Toggle 'active' css class on the list-group item for styling 
        $(event.target).closest('.like-track').toggleClass('active');
    },

    'click #importLikesBtn': function(event) {
        var now = new Date();
        _.each(Session.get("selectedTracks"), function(track) {
            var metadata = {
                dateAdded: now,
                lastModified: now,
                addedBy: Meteor.user()
            };
            track.blogMetadata = metadata;

            Meteor.call('createTrack', track, function(error, result){
                console.log("Saved track: " + track.title);
                Router.go('home');
            });
        });
        $('#confirmModal').modal('hide');
    }
});

var getMyTracks = function() {
    return Tracks.find({'blogMetadata.addedBy': Meteor.user() });
}

Template.home.userHasTracks = function() {
    return getMyTracks().count() > 0;
}

Template.trackGrid.tracks = function() {
    return getMyTracks().fetch();
}

Template.edit.tracks = function() {
    return Tracks.find().fetch();
}

Template.edit.events = ({
    'click .edit-save': function() {
        var track = this,
            $trackForm = $(event.target).closest('.track'),
            editableProperties = ['title', 'description'];
        
        track.editing = !track.editing;
        if(track.editing) return;        
        console.log("Updating track "+track._id);
        Tracks.update(track._id, {$set: {editing: !track.editing }});

        _.each(editableProperties, function(propName) {
            var newVal = $trackForm.find("[name='"+propName+"']").text().trim();
            //track[propName] = newVal;
            console.log(propName + ": " + newVal);
            Tracks.update(track.id, {$set: {propName: newVal }});
        });
        track.lastModified = new Date();
    }
});