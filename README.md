ember-reload-record is a mixin for routes, to support reloading of records.

In a complex system the server mutates objects and processes them
in manifold ways. For instance, a change to one object may change
the state of another object. An object may be deleted by another user
without notice, and there is no obvious way to propagate such events to
other users and do the right thing.

Even duplicating server logic precisely on the client doesn't solve the problem,
since a model might be deleted by another user while still cached on the client.
The solution is to aggressively reload models.

The basic notion would be to reload the course in the `afterModel` hook.
However, simply doing that would cause double loading,
in the case that the record did not already exist in the store and had been
loaded via the `model` hook.

### Installation

    npm install ember-reload-record

In Brocfile.js:

    app.import('node_modules/ember-reload-record/reload-record.js');

### Usage

In your routes, make sure to call _super from the `beforeModel` and
`afterModel` hooks if implemented, and return its value, or else this won't work.

Example:

    App.MyRouteNeedingReloading = Ember.Route.extend(
      ReloadRecord
    ).reopen({
      beforeModel: function() {
        blahblah;
        return this._super.apply(this, arguments);
      },

       model: function(params0 {
         return this.find('model', params.model_id);
       },

       afterModel: function() {
         blahblah;
         return this._super.apply(this, arguments);
       }
    });
