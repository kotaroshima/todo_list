/**
 * ToDo list application that uses localStorage
 */

// used for pub/sub pattern
var pubsub = _.extend({}, Backbone.Events);

var Task = Backbone.Model.extend({
    hasTag: function(tag){
        var tags = this.model.tags;
        return tags ? tags.indexOf(tag) >= 0 : false;
    }
});

var TaskList = Backbone.Collection.extend({
    model: Task,
    STORE_KEY: "TaskList",
    localStorage: new Store(this.STORE_KEY),
    
    load: function(options){
        //var KEY_NAME = this.STORE_KEY;
        var KEY_NAME = "undefined"; // don't know why key gets "undefined"...
        var models = null;
        if (localStorage[KEY_NAME]){
            var arr = localStorage[KEY_NAME].split(",");
            models = _.map(arr, function(KEY){
                return JSON.parse(localStorage[KEY_NAME + "-" + KEY]);
            });
        }
        this.reset(models);
    }
});

var TaskView = Backbone.View.extend({
    template: _.template('<div class="taskView">'+
            '<span class="taskText"><%- text %></span><span class="tagContainer"></span><span class="createdAt"><%= formattedTime %></span><span class="taskActions"><button class="editBtn">Edit</button><button class="deleteBtn">Delete</button></span>'+
            '</div>'),

    events: {
        "click .editBtn": "onEditButtonClicked",
        "click .deleteBtn": "onDeleteButtonClicked"
    },

    initialize: function(){
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.remove, this);
    },

    render: function(){
        var attrs = this.model.attributes;
        var d = new Date(attrs["createdAt"]);
        attrs["formattedTime"] = _.template("<%=month%>/<%=day%>/<%=year%> <%=hours%>:<%=minutes%>", { year:d.getFullYear(), month:d.getMonth()+1, day:d.getDate(), hours:d.getHours(), minutes:d.getMinutes() });
        $(this.el).html(this.template(attrs));

        // append tag nodes
        var tagContainer = $(this.el).find(".tagContainer");
        _.each(
            attrs["tags"],
            function(tag, idx){
                if(idx > 0){ tagContainer.append("&nbsp;"); }
                var anchor = $(document.createElement("a")).prop({ href:"javascript:void(0)" }).text(tag).click(function(evt){
                    pubsub.trigger("UPDATE_TASK_LIST", { tag:tag });
                });
                tagContainer.append(anchor);
            }
        );

        return this;
    },

    onEditButtonClicked: function(){
        pubsub.trigger("SHOW_TASK_EDITOR", this.model);
    },

    onDeleteButtonClicked: function(){
        if(confirm(_.template("Are you sure you want to delete '<%=text%>'?", this.model.attributes))){
            this.model.destroy();
        }
    },
    
    destroy: function(){
        this.model.off("change", this.render);
        this.model.off("destroy", this.remove);
        Backbone.View.prototype.destroy.call(this);
    }
});

var TaskListView = Backbone.View.extend({
    el: "#taskListView",

    initialize: function(){
        this.collection.on("add", this.addTaskView, this);
        this.collection.on("reset", this.render, this);
        pubsub.on("UPDATE_TASK_LIST", this.render, this);
    },

    render: function(options){
        var models = this.collection.models;

        // filter by tag/date
        if(options){
            // currently, only particular date is supported,
            // but we may enhance it so that we can:
            // - specify both date and time
            // - specify before/after/between the specified date/time
            var targetDate = options.date;
            if(targetDate){
                models = models.filter(function(model){
                    var d = new Date(model.get("createdAt"));
                    return d.getFullYear() === targetDate.getFullYear() && d.getMonth() === targetDate.getMonth() && d.getDate() === targetDate.getDate();
                });
            }else if(options.tag){
                models = models.filter(function(model){
                    var tagArr =  model.get("tags");
                    return tagArr && $.isArray(tagArr) ? tagArr.indexOf(options.tag) >= 0 : false;
                });
            }
        }
        $(this.el).html("");

        if(models.length>0){
            _.each(models, this.addTaskView, this);
        }else{
            $(this.el).append($(document.createTextNode("No Tasks")));
        }
    },

    addTaskView: function(task){
        var view = new TaskView({ model: task });
        $(this.el).append(view.render().$el);
    },

    destroy: function(){
        this.collection.off("add", this.addTaskView);
        this.collection.off("reset", this.render);
        pubsub.off("UPDATE_TASK_LIST", this.collection.load);
        Backbone.View.prototype.destroy.call(this);
    }
});

var EditTaskView = Backbone.View.extend({
    el: "#dialogContainer",

    template: _.template('<div class="editTaskView"><table><tbody>'+
            '<tr><th><label for="newTaskTextField">Description</label>:</th><td><input id="newTaskTextField" type="text" value="<%=text%>" /></td></tr>'+
            '<tr><th><label for="tagField">Tags</label>:<div>(comma-separated)</div></th><td><textarea id="tagField" type="text"><%=tagStr%></textarea></td></tr>'+
            '</tbody></table><div class="editTaskButtonContainer"><button id="cancelTaskBtn">Cancel</button><button id="saveTaskBtn">Save</button></div></div>'),

    events: {
        "click #saveTaskBtn": "onSaveButtonClicked",
        "click #cancelTaskBtn": "onCancelButtonClicked"
    },
            
    initialize: function(){
        pubsub.on("SHOW_TASK_EDITOR", this.show, this);
    },

    render: function(){
        var attrs = this._model ? this._model.attributes : { text:"" };

        // generate a comma-separated string from an array
        attrs["tagStr"] = _.reduce(
            attrs["tags"],
            function(memo, tag, idx){
                if(idx > 0){ memo += ", "; }
                memo += tag;
                return memo;
            },
            ""
        );

        $(this.el).html(this.template(attrs));
        return this;
    },

    show: function(model){
        var title = model ? "Edit Task" : "Create New Task";
        this._model = model;
        this.render().$el.dialog({
            title: title,
            width: 600,
            height: 300
        });
    },

    onSaveButtonClicked: function(){
        var tagArr = _.chain($("#tagField").val().split(",")).map($.trim).reject(function(tag){ return !tag || tag.length===0; }).value();
        var prop = { text: $("#newTaskTextField").val(), tags: tagArr };

        var task = null;
        if (this._model){
            // edit
            task = this._model;
            task.save(prop);
        }else{
            // add new
            prop["createdAt"] = new Date().getTime();
            task = new Task(prop);
            this.collection.add(task);
            task.save();
        }

        this._model = null;
        $(this.el).dialog('close');
    },
    
    onCancelButtonClicked: function(){
        this._model = null;
        $(this.el).dialog('close');
    },

    destroy: function(){
        pubsub.off("SHOW_TASK_EDITOR", this.show);
        Backbone.View.prototype.destroy.call(this);
    }
});

$(function(){
    var taskList = new TaskList();
    new EditTaskView({
        collection: taskList
    });
    new TaskListView({
        collection: taskList
    });

    pubsub.on("UPDATE_TASK_LIST", function(options){
        var hasFilter = false;
        if(options){
            if(options.tag){
                title = _.template("Tasks with tag '<%= tag %>'", options);
                hasFilter = true;
            }else if(options.dateText){
                title = _.template("Tasks created at '<%= dateText %>'", options);
                hasFilter = true;
            }
        }
        if(hasFilter){
            $('#showAllLink').css("display", "block");
        }else{
            $('#showAllLink').css("display", "none");
            $('#datePicker').val("");
            title = "All Tasks";
        }
        $("#taskListTitle").text(title);
    });
    $('#datePicker').datepicker({
        onSelect: function(dateText, inst){
            pubsub.trigger("UPDATE_TASK_LIST", { dateText:dateText, date:$('#datePicker').datepicker("getDate") });
        },
        onClose: function(dateText, inst){
            if(!dateText || dateText.length === 0){
                pubsub.trigger("UPDATE_TASK_LIST"); // publish so that task list gets refreshed with no date filter
            }
        }
    });
    $('#newTaskBtn').on("click", function(){
        pubsub.trigger("SHOW_TASK_EDITOR");
    });
    $('#showAllLink').on("click", function(){
        pubsub.trigger("UPDATE_TASK_LIST");
    });

    taskList.load();
    pubsub.trigger("UPDATE_TASK_LIST");
});