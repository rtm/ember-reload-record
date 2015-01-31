import Ember from 'ember';

export default Ember.Mixin.create({

  /**
   * Override `#beforeModel` to initialize the property which says if
   * a reload is required in the `#afterModel` hook.
   *
   * @method beforeModel
   */
  beforeModel: function ReloadRecord$beforeModel(/*transition*/) {

    return this
      .set('needReload', true)
      ._super.apply(this, arguments);

  },

  /**
   * Override Ember.Route#findModel to reload record if already in cache.
   * This will be called from the default Ember.Route#model hook.
   * Mark no reload being needed in the `afterModel` hook.
   *
   * @method findModel
   */
   findModel: function ReloadRecord$findModel(type, id) {

     var record = this.store.getById(type, id);

     this.set('needReload', false);
     return record && record.reload() || this.store.find(type, id);

  },

  /**
   * Reload the model if it was passed in via {{link-to}} or #transitionTo.
   * This is the case if the model hook was not called, which we know by virtue of
   * the flag `reloadRecordReloadNeeded` still being true.
   * Return a promise for the reload.
   *
   * @method afterModel
   * @return {Promise} promise for transition to proceed, with model as value
   */
  afterModel: function ReloadRecord$afterMmodel(model/*, transition, queryParams*/) {

    this._super.apply(this, arguments);
    return Ember.RSVP.Promise.cast(
      this.get('needReload') && model.get('id') ? model.reload() : model);

  }

});
