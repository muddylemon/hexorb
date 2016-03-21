
(function($, _, Backbone) {

  var Game = new Backbone.Marionette.Application();

  console.log(Game)

  var Player = new playerModel();

  var tc = new TileCollectionView({
    collection: tiles
  });

  $(".game").html(tc.render().el);


}(jQuery, _, Backbone));
