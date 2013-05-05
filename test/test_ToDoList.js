/**
 * 
 */

var isHidden = function(node){
    return node.width() === 0 && node.height() === 0;
};

var DLG_DELAY = 800;

module("Add Task");

asyncTest("Open and cancel Create Task dialog", function(){
    console.log("Open and cancel Create Task dialog");
    expect(2);
    $("#addTaskContainer BUTTON").click();
    setTimeout(function(){
        // Create Task dialog opened
        equal(!isHidden($("#newTaskTextField")), true, "Dialog should be opened with New Task button");

        $("#cancelTaskBtn").click();
        setTimeout(function(){
            equal(isHidden($("#newTaskTextField")), true, "Dialog should be closed with Cancel button");
            start();
        }, DLG_DELAY);
    }, DLG_DELAY);
});

asyncTest("Add Task", function(){
    console.log("Add Task");
    expect(2);
    $("#addTaskContainer BUTTON").click();
    setTimeout(function(){
        // set values for the task
        var taskDesc = "Test task "+new Date().getTime();
        $("#newTaskTextField").val(taskDesc);
        $("#tagField").val("test, task");

        $("#saveTaskBtn").click();
        setTimeout(function(){
            equal(isHidden($("#newTaskTextField")), true, "Dialog should be closed with Save button");
            equal($("#taskListView .taskText:contains('"+taskDesc+"')").length, 1, "Task should be created successfully");
            start();
        }, DLG_DELAY);
    }, DLG_DELAY);
});

module("Edit Task");

/*
asyncTest("Mouse Over Task", function(){
    console.log("Mouse Over Task");
    expect(4);
    var lastNode = $("#taskListView").last();
    var editBtn = lastNode.find(".taskActions .editBtn");
    var deleteBtn = lastNode.find(".taskActions .deleteBtn");

    var mouseOverHandler = function(evt){
        console.log("mouseOverHandler");
        equal(!isHidden(editBtn), true, "Edit button should be visible on mouseover");
        equal(!isHidden(deleteBtn), true, "Delete button should be visible on mouseover");
    };
    // somehow, mouseout/mouseleave doesn't work...
    var mouseOutHandler = function(evt){
        console.log("mouseOutHandler");
        equal(isHidden(editBtn), true, "Edit button should be hidden on mouseout");
        equal(isHidden(deleteBtn), true, "Delete button should be hidden on mouseout");
        start();
    };
    lastNode.on("mouseover", mouseOverHandler).trigger("mouseover").off("mouseover", mouseOverHandler);
    lastNode.on("mouseleave", mouseOutHandler).trigger("mouseleave").off("mouseleave", mouseOutHandler);
});
*/
asyncTest("Edit Task", function(){
    console.log("Edit Task");
    expect(4);
    var lastNode = $("#taskListView .taskView").last();
    var editBtn = lastNode.find(".taskActions .editBtn");
    var taskDesc = lastNode.find(".taskText").text();

    var mouseOverHandler = function(evt){
        editBtn.click();
        setTimeout(function(){
            equal(!isHidden($("#newTaskTextField")), true, "Dialog should be opened with Edit Task button");
            equal($("#newTaskTextField").val(), taskDesc, "Correct task description should be displayed : "+taskDesc);
            var newTaskDesc = "Test task "+new Date().getTime();
            $("#newTaskTextField").val(newTaskDesc);
            $("#tagField").val("test_edit, task_edit");

            $("#saveTaskBtn").click();
            setTimeout(function(){
                equal(isHidden($("#newTaskTextField")), true, "Dialog should be closed with Save button");
                lastNode = $("#taskListView .taskView").last();
                equal(lastNode.find(".taskText").text(), newTaskDesc, "Task should be updated successfully");
                start();
            }, DLG_DELAY);
        }, DLG_DELAY);
    };

    lastNode.bind("mouseover", mouseOverHandler).trigger("mouseover").unbind("mouseover", mouseOverHandler);
});

module("Delete Task");

asyncTest("Delete Task", function(){
    console.log("Delete Task");
    expect(1);
    var lastNode = $("#taskListView .taskView").last();
    var deleteBtn = lastNode.find(".taskActions .deleteBtn");
    var taskDesc = lastNode.find(".taskText").text();

    var mouseOverHandler = function(evt){

        // hack confirm
        var origConfirm = window.confirm;
        window.confirm = function(msg){
            setTimeout(function(){
                equal($("#taskListView .taskText:contains('"+taskDesc+"')").length, 0, "Task should be deleted successfully");

                // restore original confirm
                window.confirm = origConfirm;

                start();
            }, DLG_DELAY);
            return true;
        };

        deleteBtn.click();
    };

    lastNode.bind("mouseover", mouseOverHandler).trigger("mouseover").unbind("mouseover", mouseOverHandler);
});