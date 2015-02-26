'use strict';

var thoughtdrop = angular.module('directives', []);

thoughtdrop.directive('file', ['SaveMessage', function(SaveMessage) {
  return {
    restrict: 'AE',
    scope: {
      // file: '@'
    },

    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$apply();
        SaveMessage.saveImage(file);
      });
    }
  };
}]);