import Ember from 'ember';

/**
 * mixins/reload_record_route.js
 *
 * A mixin for routes, to support reloading of records.
 *
 * In a complex system the server mutates objects and processes them
 * in manifold ways. For instance, a change to one object may change
 * the state of another object. An object may be deleted by another user
 * without notice, and there is no obvious way to propagate such events to
 * other users and do the right thing.
 *
 * Even duplicating server logic precisely on the client doesn't solve the problem,
 * since a model might be deleted by another user while still cached on the client.
 * The solution is to aggressively reload models.
 *
 * The basic notion would be to reload the course in the `afterModel` hook.
 * However, simply doing that would cause double loading,
 * in the case that the record did not already exist in the store and had been
 * loaded via the `model` hook.
*/

/**
 * Mixin for routes which need to reload records.
 *
 * In your classes, make sure to call _super from the beforeModel and
 * afterModel hooks if implemented, and return its value, or else this won't work.
 *
 * @example
 * ```
 *   App.MyRouteNeedingReloading = Ember.Route.extend(
 *     ReloadRecord
 *   ).reopen({
 *     beforeModel: function() {
 *       blahblah;
 *       return this._super.apply(this, arguments);
 *     },
 *
 *     model: function(params0 {
 *       return this.find('model', params.model_id);
 *     },
 *
 *     afterModel: function() {
 *       blahblah;
 *       return this._super.apply(this, arguments);
 *     }
 *  });
 * ```
 */

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
