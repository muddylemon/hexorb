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
  var cs = Colors.get(30,100)

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


console.log("TD", tileData)


var TileView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  className: 'tile',
  model: tileModel,
  template: _.template('<span class="tile-color" ><%= x %>,<%=y%></span>'),
  onRender: function(){
      this.$el.css({
          "background-color":this.model.get('color')
      })
  }
});

var TileCollectionView = Backbone.Marionette.CollectionView.extend({
  tagName: 'ul',
  className: 'board',
  childView: TileView
});


var tileModel = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0,
    color: 0x00000
  },

});

var tileCollection = Backbone.Collection.extend({
  model: tileModel,
  sort: 'x'
});



var tiles = new tileCollection(tileData);

console.log(tiles);
