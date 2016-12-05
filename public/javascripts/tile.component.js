/**
 * Created by nghiepnds on 12/4/2016.
 */

(function () {
    'use strict';
    var module = angular.module("app");
    module.component("tile", {
        templateUrl:"upload/tile.component.html",
        bindings: {
            progress: "="
        },
        controllerAs: "model",
        controller: ["$http",controller]
    });

    function controller($http) {
        var model = this;
        //console.log(model);
    }

} ());