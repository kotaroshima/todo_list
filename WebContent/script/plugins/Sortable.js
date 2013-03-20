// Generated by CoffeeScript 1.4.0
(function() {

  define(['jQueryUITouchPunch'], function($) {
    return {
      setup: function() {
        if ((typeof options !== "undefined" && options !== null ? options.sortable : void 0) !== false) {
          this.setSortable(true);
        }
      },
      setSortable: function(isSortable) {
        var _this = this;
        if (isSortable) {
          if (this._sortableInit) {
            this.$el.sortable("enable");
          } else {
            this.$el.sortable({
              start: function(event, ui) {
                ui.item.startIndex = ui.item.index();
              },
              stop: function(event, ui) {
                var collection, model, models, newIndex;
                collection = _this.collection;
                models = collection.toJSON();
                model = models[ui.item.startIndex];
                newIndex = ui.item.index();
                models.splice(ui.item.startIndex, 1);
                models.splice(newIndex, 0, model);
                collection.update(models);
              }
            });
            this._sortableInit = true;
          }
        } else {
          if (this._sortableInit) {
            this.$el.sortable("disable");
          }
        }
      },
      teardown: function() {
        if (this._sortableInit) {
          this.$el.sortable("destroy");
        }
      }
    };
  });

}).call(this);
