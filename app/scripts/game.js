
var Game = new Backbone.Marionette.Application();

Game.addRegions({
  app: "#app",
  stats: "#stats",
  board: "#board"
});

var GameColor = Backbone.Model.extend({
  defaults: {
    r:0,
    g:0,
    b:0
  },
  toRGB: function(){
    var compiled = _.template('rgb(<%= r%>,<%= g %>,<%= b %>,.8)');
    return compiled(this.toJSON());
  }
});

var GameStatus = Backbone.Model.extend({
  defaults: {
    round: 0,
    color: [0,0,0],
    x: 0,
    y: 0
  }
});

var GameStatusView = Backbone.Marionette.ItemView.extend({
  template: _.template('<li><%= round %></li><li><% print(color.toRGB()) %></li><li><%= x %></li><li><%= y %></li>'),
  tagName: 'ul',
  className: 'nav nav-pills pull-right'
});

Game.show(new GameStatusView({
  model: new GameStatus({
    color: new GameColor()
  })
}))
