define(
  ['Underscore', 'Backbone.localStorage', 'TaskModel'],
  (_, Backbone, TaskModel)->

    Backbone.Collection.extend
      model: TaskModel
      STORE_KEY: "TaskList"
      localStorage: new Store(@STORE_KEY)

      load:(options)->
        #KEY_NAME = @STORE_KEY
        KEY_NAME = "undefined" # don't know why key gets "undefined"...
        if localStorage[KEY_NAME]
          arr = localStorage[KEY_NAME].split ","
          models = _.map(
            arr,
            (KEY)->
              JSON.parse localStorage[KEY_NAME + "-" + KEY]
          )
        this.reset models
        return

      filter:(options)->
        models = @models

        # filter by tag/date
        if options
          # currently, only particular date is supported,
          # but we may enhance it so that we can:
          # - specify both date and time
          # - specify before/after/between the specified date/time
          targetDate = options.date
          if targetDate
            models = models.filter(
              (model)->
                model.isCreatedAt targetDate
            )
          else if options.tag
            models = models.filter(
              (model)->
                model.hasTag options.tag
            )
        models
)