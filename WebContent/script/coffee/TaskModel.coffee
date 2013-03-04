define(
  ['Backbone'],
  (Backbone)->
    Backbone.Model.extend
      isCreatedAt:(date)->
        d = new Date @get("createdAt")
        d.getFullYear() is date.getFullYear() and d.getMonth() is date.getMonth() and d.getDate() is date.getDate()
      hasTag:(tag) ->
        tags = @get "tags"
        ret = if tags then tags.indexOf(tag) >= 0 else false
)