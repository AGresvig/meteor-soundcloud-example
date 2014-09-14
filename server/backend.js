// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: "soundcloud"
});
ServiceConfiguration.configurations.insert({
  service: "soundcloud",
  clientId: process.env.SC_CLIENTID,
  secret: process.env.SC_SECRET
});

Meteor.startup(function () {
    // code to run on server at startup
});
