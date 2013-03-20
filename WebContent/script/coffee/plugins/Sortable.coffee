# options
#   sortable : pass `false` if you don't want to make it sortable on initialization (default `true`)
define(
  ['jQueryUITouchPunch'],
  ($)->
    setup:->
      if options?.sortable isnt false
        @setSortable true
      return
  
    setSortable:(isSortable)->
      if isSortable
        if @_sortableInit
          @$el.sortable "enable"
        else
          # make the list sortable
          @$el.sortable
            start:(event, ui)->
              ui.item.startIndex = ui.item.index()
              return
            stop:(event, ui)=>
              collection = @collection
              models = collection.toJSON()
#              model = collection.at ui.item.startIndex
              model = models[ui.item.startIndex]
              newIndex = ui.item.index()
              models.splice ui.item.startIndex, 1
              models.splice newIndex, 0, model
#              collection.reset models
              collection.update models
#              collection.remove model
#              collection.add model, { at: newIndex }
              return
          @_sortableInit = true
      else
        if @_sortableInit
          @$el.sortable "disable"
      return

    teardown:->
      if @_sortableInit
        @$el.sortable "destroy"
      return
)