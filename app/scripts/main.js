(function($, _, Backbone) {



  var tc = new TileCollectionView({
    collection: tiles
  });

  $(".game").html(tc.render().el);


}(jQuery, _, Backbone));
