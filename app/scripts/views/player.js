var playerModel = Backbone.Model.extend({
  defaults: {
    x: 0,
    y: 0,
    color: [255, 255, 255],
    rgb: 'rgb(255,255,255)'
  },
  toRGB: function() {
    var c = this.get('color');
    this.set('rgb','rgb('+c[0]+','+c[1]+','+c[2]+')');
    return this.get('rgb');
  },
  absorb: function(currentColor) {
    this.set('color', Colors.absorb(currentColor, this.get('color')));
    this.toRGB();
  }
});

var playerView = Backbone.Marionette.ItemView.extend({
  initialize: function() {

    this.listenTo(this.model, 'change:color', function() {

      this.$el.css({
        "background-color": this.model.toRGB()
      });
      this.render();
    });

    this.listenTo(this.model, 'change:x change:y', _.debounce(function() {

      var top = (this.model.get('x') * 100),
        left = (this.model.get('y') * 100) + 25;

      this.$el.css({
        top: top,
        left: left
      });
      this.render();
    },500));

  },
  model: playerModel,
  className: 'player',
  template: _.template('<%= x %>,<%=y%><br><%= rgb %>')
});
