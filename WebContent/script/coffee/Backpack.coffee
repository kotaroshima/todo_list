define(
  ['jQuery', 'Underscore', 'Backbone', 'plugins/Subscribable'],
  ($, _, Backbone, Subscribable) ->
    View: Backbone.View.extend
      initialize: (options)->
        Backbone.View::initialize.apply @, arguments
        @teardowns = []
        mixins = [Subscribable]
        mixins = mixins.concat options.mixins if options?.mixins
        _.each mixins, (mi)=>
          su = mi.setup
          td = mi.teardown
          for own key, value of mi
            if key isnt 'setup' and key isnt 'teardown'
              @[key] = value
          su.apply @ if su
          @teardowns.push td if td
          return
        return
      remove: ->
        _.each @teardowns, (td)=>
          td.apply @
          return
        Backbone.View::remove.apply @, arguments
        return
)