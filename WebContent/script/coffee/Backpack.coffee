define(
  ['jQuery', 'Underscore', 'Backbone'],
  ($, _, Backbone) ->
    View: Backbone.View.extend
      initialize: (options)->
        Backbone.View::initialize.apply @, arguments
        @teardowns = []
        if mixins = options?.mixins
          _.each mixins, (mi)=>
            for own key, value of mi
              @[key] = value if key isnt 'setup' and key isnt 'teardown'
            mi.setup.apply @ if mi.setup
            @teardowns.push mi.teardown if mi.teardown
            return
        return
      remove: ->
        _.each @teardowns, (td)=>
          td.apply @
          return
        Backbone.View::remove.apply @, arguments
        return
)