define(
  ['Backbone'],
  (Backbone)->
    Backbone.Model.extend
      isCreatedAt:(date)->
        return true unless date
        d = new Date @get("createdAt")
        d.getFullYear() is date.getFullYear() and d.getMonth() is date.getMonth() and d.getDate() is date.getDate()
      hasTag:(tag) ->
        return true unless tag
        tags = @get "tags"
        ret = if tags then tags.indexOf(tag) >= 0 else false
      filter:(options)->
        return true unless options
        ret = @isCreatedAt options.date
        return false unless ret
        @hasTag options.tag
)