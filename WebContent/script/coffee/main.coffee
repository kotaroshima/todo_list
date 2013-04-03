###
ToDo list application that uses localStorage
###

requirejs.config
  paths:
    text: ['http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text']
    jQuery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min']
    jQueryUI: ['http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min']
    jQueryUITouchPunch: ['http://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.2/jquery.ui.touch-punch.min']
    Underscore: ['http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min']
    Backbone: ['http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min']
    BackboneLocalStorage: ['http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.0/backbone.localStorage-min']
    Backpack: ['lib/backpack/Backpack']
    ListView: ['lib/backpack/components/ListView']
    Sortable: ['lib/backpack/plugins/Sortable']
  shim:
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
    Backpack:
      deps: ['jQuery', 'Underscore', 'Backbone']
      exports: 'Backpack'
    ListView:
      deps: ['Backpack']
      exports: 'Backpack'
    Sortable:
      deps: ['ListView']
      exports: 'Backpack'

require(
  ['MainView'],
  (MainView)->
    new MainView
      el: '#pageContainer'
      subscribers:
        UPDATE_LIST: 'onUpdateList'
    return
)