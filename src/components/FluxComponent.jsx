import React from 'react';

// Polyfill for Array.find()
require('array.prototype.find');

export default class FluxComponent extends React.Component {
    constructor() {
        super();

        this._subscribedStores = {};
    }

    getStore(storeName) {
        return this.context.flux.getStore(storeName);
    }

    getActions(actionsName) {
        return this.context.flux.getActions(actionsName);
    }

    listenTo(storeName, callback) {
        var callbacks = [];
        if (storeName in this._subscribedStores) {
            callbacks = this._subscribedStores[storeName];
        }

        var oldCbObj = callbacks.find(cb => cb.callback === callback);
        if (!oldCbObj) {
            var boundCallback = callback.bind(this);
            this.context.flux.getStore(storeName).on('change', boundCallback);

            callbacks.push({
                callback: callback,
                boundCallback: boundCallback
            });

            this._subscribedStores[storeName] = callbacks;
        }
        else {
            console.log('Tried to add same listener twice');
        }
    }

    componentWillUnmount() {
        var storeName;

        for (storeName in this._subscribedStores) {
            var store = this.context.flux.getStore(storeName);
            var callbacks = this._subscribedStores[storeName];
            callbacks.map(function(cb) {
                store.removeListener('change', cb.boundCallback);
            });

            delete this._subscribedStores[storeName];
        };
    }
}

FluxComponent.contextTypes = {
    flux: React.PropTypes.object.isRequired
};
