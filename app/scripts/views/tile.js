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
  var cs = Colors.get(30, 100)

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
  events: {
    "click": "touchme"
  },
  initialize: function() {
    this.listenTo(this.model, 'selected', this.selectTile);
    this.listenTo(this.model, 'deselected', this.deselectTile);
  },
  touchme: function() {
    this.model.select();
  },
  deselectTile: function(){
    $(".active").removeClass('active');
    this.render();
  },
  selectTile: function(){
          var p = new playerView({
        model: Player
      })
      this.$el.append(p.render().el);
      this.$el.addClass('active');
  },
  template: _.template('<span class="tile-color" ><%= x %>,<%=y%></span>'),
  onRender: function() {
    this.$el.removeClass('active');
    this.$el.css({
      "background-color": this.model.get('color')
    });
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
  // Select this model, and tell our
  // collection that we're selected
  select: function() {

    if (this.selected) {
      return;
    }

    this.selected = true;
    this.trigger("selected", this);

    if (this.collection) {
      this.collection.select(this);
    }
  },

  // Deselect this model, and tell our
  // collection that we're deselected
  deselect: function() {
    if (!this.selected) {
      return;
    }

    this.selected = false;
    this.trigger("deselected", this);

    if (this.collection) {
      this.collection.deselect(this);
    }
  },

  // Change selected to the opposite of what
  // it currently is
  toggleSelected: function() {
    if (this.selected) {
      this.deselect();
    } else {
      this.select();
    }
  }
});

var tileCollection = Backbone.Collection.extend({
  model: tileModel,
  sort: 'x',
  // Select a model, deselecting any previously
  // selected model
  select: function(model) {
    if (model && this.selected === model) {
      return;
    }

    this.deselect();

    this.selected = model;
    this.selected.select();
    this.trigger("select:one", model);
  },

  // Deselect a model, resulting in no model
  // being selected
  deselect: function(model) {
    if (!this.selected) {
      return;
    }

    model = model || this.selected;
    if (this.selected !== model) {
      return;
    }

    this.selected.deselect();
    this.trigger("deselect:one", this.selected);
    delete this.selected;
  }
});



var tiles = new tileCollection(tileData);

tiles.at(12).set({
  'active': true
});

console.log(tiles);
