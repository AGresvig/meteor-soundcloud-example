// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: "soundcloud"
});
ServiceConfiguration.configurations.insert({
  service: "soundcloud",
  clientId : Meteor.settings.authentication.soundcloud.clientId,
  secret : Meteor.settings.authentication.soundcloud.secret
});

Meteor.startup(function () {
    // code to run on server at startup
});
