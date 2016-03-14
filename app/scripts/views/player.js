var playerModel = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0,
        color: "#FFFFFF"
    }
});

var playerView = Backbone.Marionette.ItemView.extend({
    initialize: function() {

    },
    model: playerModel,
    className: 'player',
    template: _.template('<%= x %>,<%=y%>'),
    onRender: function() {
        this.$el.css({
            "background-color":this.model.get('color')
        });
    }
});

var Player = new playerModel();
