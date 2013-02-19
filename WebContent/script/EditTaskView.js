// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jQuery', 'Underscore', 'Backbone.localStorage', 'EditTaskView', 'TaskModel', 'text!template/EditTaskView.html'], function($, _, Backbone, EditTaskView, TaskModel, editTaskViewTemplate) {
    return EditTaskView = (function(_super) {

      __extends(EditTaskView, _super);

      function EditTaskView() {
        return EditTaskView.__super__.constructor.apply(this, arguments);
      }

      EditTaskView.prototype.el = "#dialogContainer";

      EditTaskView.prototype.template = _.template(editTaskViewTemplate);

      EditTaskView.prototype.events = {
        "click #saveTaskBtn": "onSaveButtonClicked",
        "click #cancelTaskBtn": "onCancelButtonClicked"
      };

      EditTaskView.prototype.initialize = function() {
        return pubsub.on("SHOW_TASK_EDITOR", this.show, this);
      };

      EditTaskView.prototype.render = function() {
        var attrs;
        attrs = this._model ? this._model.attributes : {
          text: ""
        };
        attrs["tagStr"] = _.reduce(attrs["tags"], function(memo, tag, idx) {
          if (idx > 0) {
            memo += ", ";
          }
          memo += tag;
          return memo;
        }, "");
        $(this.el).html(this.template(attrs));
        return this;
      };

      EditTaskView.prototype.show = function(model) {
        var title;
        title = model ? "Edit Task" : "Create New Task";
        this._model = model;
        return this.render().$el.dialog({
          title: title,
          width: 600,
          height: 300
        });
      };

      EditTaskView.prototype.onSaveButtonClicked = function() {
        var prop, tagArr, task;
        tagArr = _.chain($("#tagField").val().split(",")).map($.trim).reject(function(tag) {
          return !tag || tag.length === 0;
        }).value();
        prop = {
          text: $("#newTaskTextField").val(),
          tags: tagArr
        };
        if (this._model) {
          task = this._model;
          task.set(prop);
        } else {
          prop["createdAt"] = new Date().getTime();
          task = new TaskModel(prop);
          this.collection.add(task);
        }
        task.save();
        this._model = null;
        return $(this.el).dialog('close');
      };

      EditTaskView.prototype.onCancelButtonClicked = function() {
        this._model = null;
        return $(this.el).dialog('close');
      };

      EditTaskView.prototype.destroy = function() {
        pubsub.off("SHOW_TASK_EDITOR", this.show);
        return Backbone.View.prototype.remove.call(this);
      };

      return EditTaskView;

    })(Backbone.View);
  });

}).call(this);
