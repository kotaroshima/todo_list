define(
  ->
    instance = null

    class Singleton
      constructor:->
        if instance
          throw new Error "Only one instance can be instantiated."
        @initialize arguments

    Singleton.prototype.initialize=->

    Singleton.getInstance=->
      if !instance
        instance = new Singleton()
      instance

    Singleton.getInstance()
)