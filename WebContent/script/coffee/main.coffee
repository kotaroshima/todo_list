###
ToDo list application that uses localStorage
###

paths =
  text: ['http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text']
  jQuery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min']
  jQueryUI: ['http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min']
  jQueryUITouchPunch: ['http://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.2/jquery.ui.touch-punch.min']
  Underscore: ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min']
  Backbone: ['http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min']
  BackboneLocalStorage: ['http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.0/backbone.localStorage-min']
  Backpack: ['lib/backpack/Backpack']
  'backpack/components/ListView': ['lib/backpack/components/ListView']
  'backpack/plugins/Sortable': ['lib/backpack/plugins/Sortable']
  'backpack/plugins/Subscribable': ['lib/backpack/plugins/Subscribable']

shim =
  text:
    exports: 'text'
  jQuery:
    exports: '$'
  jQueryUI:
    deps: ['jQuery']
    exports: '$'
  jQueryUITouchPunch:
    deps: ['jQuery', 'jQueryUI']
    exports: '$'
  Underscore:
    exports: '_'
  Backbone:
    deps: ['Underscore', 'jQuery']
    exports: 'Backbone'
  BackboneLocalStorage:
    deps: ['Backbone']
    exports: 'Backbone'

requirejs.config paths: paths, shim: shim

require(
  ['MainView'],
  (MainView)->
    new MainView el: "#pageContainer", subscribers: { UPDATE_LIST: 'onUpdateList' }
    return
)