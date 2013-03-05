define(
  ['jQueryUITouchPunch', 'Underscore', 'Backbone'],
  ($, _, Backbone)->

    Backbone.View.extend
      itemClass: Backbone.View

      initialize:(options)->
        @itemClass = options.itemClass if options.itemClass
        @collection.on "add remove reset", @render, @
        pubsub.on "UPDATE_LIST", @render, @
        @_views = []

        # make the list draggable
        $(@el).sortable
          start:(event, ui)->
            ui.item.startIndex = ui.item.index()
            return
          stop:(event, ui)=>
            collection = @collection
            model = collection.at ui.item.startIndex
            newIndex = ui.item.index()
            collection.remove model
            collection.add model, { at: newIndex }
            return
        return

      render:(options)->
        models = @collection.filter options
        @clearChildren()
        if models.length > 0
          _.each models, @addChild, @
        else
          $(@el).html "No Items" # TODO : i18n
        @

      addChild:(model)->
        view = new @itemClass model: model
        $(@el).append view.render().$el
        @_views.push view
        return

      clearChildren:->
        for i in [@_views.length-1..0] by -1
          @removeChild i
        return

      removeChild:(index)->
        @_views[index].remove()
        @_views.splice index,1
        return

      remove:->
        @collection.off "add remove reset", @render
        pubsub.off "UPDATE_LIST", @render, @
        Backbone.View::remove.call @
        return
)