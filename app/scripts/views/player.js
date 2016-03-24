var playerModel = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0,
    color: "FFFFFF"
  },
  absorb: function(currentColor) {

    var mColor = this.get('color');

    var abb = Colors.absorb(currentColor, mColor);

    console.log("Absorbing to ", mColor, currentColor, abb);

    this.set('color', '#' + Colors.rgb2hex(abb).toString(16));

    // get the current tile color,
    // change my color to something closer to the tile

  }
});

var playerView = Backbone.Marionette.ItemView.extend({
  initialize: function() {

    this.listenTo(this.model, 'change:color', function() {
      console.log("CCCC", this.model.get('color'));

      this.$el.css({
        "background-color": this.model.get('color')
      });
      this.render();
    });

    this.listenTo(this.model, 'change:x change:y', function() {

      var top = (this.model.get('x') * 100),
        left = (this.model.get('y') * 100) + 25;

      this.$el.css({
        top: top,
        left: left
      });
      this.render();
    });

  },
  model: playerModel,
  className: 'player',
  template: _.template('<%= x %>,<%=y%><br><%= color %>')
});
