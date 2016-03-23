
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
  deselectTile: function() {
    this.$el.removeClass('active');
    this.render();
  },
  selectTile: function() {
    this.$el.addClass('active');
    console.log("Activated", this.model)
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
    this.trigger("selected", model);
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
    this.trigger("deselected", this.selected);
    delete this.selected;
  }
});
