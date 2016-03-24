(function($, _, Backbone) {

  var Game = new Backbone.Marionette.Application();

  Game.addRegions({
    app: "#app",
    board: "#board"
  });

  Game.round = 0;

  Game.on('start', function(options) {

    Game.Player = new playerModel();
    Game.Avatar = new playerView({
      model: Game.Player
    });

    /*
        create the mockups for the models
        this will create 24 tiles, placed in four rows
    */
    var tileData = (function() {
      var data = [];
      var i = 0;

      /**
       * Select 30 random colors, no closer that 100 color units
       */
      var cs = Colors.get(30, 50);

      for (var x = 0; x < 4; x++) {
        for (var y = 0; y < 6; y++) {
          data.push({
            x: x,
            y: y,
            color: cs[i++]
          });

        }

      }
      return data;

    })();

    console.log(tileData);


    var tiles = new tileCollection(tileData);



    var tc = new TileCollectionView({
      collection: tiles,
    });

    tiles.on('selected', function(model) {

      Game.currentColor = model.get('color');

      Game.Player.set({
        x: model.get('x'),
        y: model.get('y')
      });

    });

    Game.board.show(tc);

    $("#board").append(Game.Avatar.render().el);

    Game.pulse = setInterval(function() {
      if (!Game.currentColor) return;

      Game.Player.absorb(Game.currentColor);

    }, 800);

    tiles.at(12).set({
      'active': true
    });

  });


  Game.start();

}(jQuery, _, Backbone));
