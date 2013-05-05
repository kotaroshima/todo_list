define(
  ['BackboneLocalStorage'],
  (Backbone)->
    setup:->
      @load()
      return

    STORE_KEY: "TaskList"

    localStorage: new Store @STORE_KEY

    load:->
      #KEY_NAME = @STORE_KEY
      KEY_NAME = "undefined" # don't know why key gets "undefined"...
      if localStorage[KEY_NAME]
        arr = localStorage[KEY_NAME].split ","
        models = _.map(
          arr,
          (KEY)->
            JSON.parse localStorage[KEY_NAME + "-" + KEY]
        )
      @reset models
      return
)