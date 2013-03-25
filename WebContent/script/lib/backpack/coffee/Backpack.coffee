define(
  ['jQuery', 'Underscore', 'Backbone', 'backpack/plugins/Subscribable'],
  ($, _, Backbone, Subscribable) ->
    setup =(self)->
      self.teardowns = []
      plugins = [Subscribable]
      plugins = plugins.concat self.options.plugins if self.options?.plugins
      _.each plugins, (pi)->
        su = pi.setup
        td = pi.teardown
        for own key, value of pi
          if key isnt 'setup' and key isnt 'teardown'
            self[key] = value
        su.apply self if su
        self.teardowns.push td if td
        return
      return

    teardown=(self)->
      _.each self.teardowns, (td)->
        td.apply self
        return
      return

    Model: Backbone.Model.extend
      initialize:(attributes, options)->
        Backbone.Model::initialize.apply @, arguments
        setup @
        return
      destroy:(options)->
        teardown @
        Backbone.Model::destroy.apply @, arguments
        return
    Collection: Backbone.Collection.extend
      initialize:(models, options)->
        Backbone.Collection::initialize.apply @, arguments
        setup @
        return
      destroy:->
        teardown @
        return
    View: Backbone.View.extend
      initialize:(options)->
        Backbone.View::initialize.apply @, arguments
        setup @
        return
      remove:->
        teardown @
        Backbone.View::remove.apply @, arguments
        return
)