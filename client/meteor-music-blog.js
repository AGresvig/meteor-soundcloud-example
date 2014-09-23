Router.configure({layoutTemplate: 'masterLayout'});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('importLikes', {path: '/import'});
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