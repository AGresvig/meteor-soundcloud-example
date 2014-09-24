var dep = new Deps.Dependency;

Soundcloud = {
  getLikes: function() {
    dep.depend();
    console.log("Getting likes");

    //Set access token so we can query the Soundcloud API
    var user = Meteor.user();
    if(user && user.services.soundcloud){
        var accessToken = user.services.soundcloud.accessToken;
        if(accessToken){
            console.log('setting access token');
            SC.accessToken(accessToken);
        }
    } else {
      throw new Error("You need to be connected to Soundcloud to do this!");
    }
    
    if(typeof this.likes === 'undefined') {
      this.likes = [];

      //Call the API
      SC.get("/me/favorites", {limit: 5} ,_.bind(function(response){
        if(response.errors){
            throw new Error("Error getting likes");
            return;
        }
        this.likes = response;
        dep.changed();
      }, this));
    }
    return this.likes;
  }
};