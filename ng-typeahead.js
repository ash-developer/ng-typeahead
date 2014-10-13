angular.module('ash', []).directive("ngTypeahead", function () {

  return {
    restrict: 'A',
    require: '?ngModel',
    scope: {
      options: '=',
      datasets: '='
    },
    link: function ($scope, element, attrs, ngModel) {

      $scope.isChanged = false;

      element.typeahead($scope.options || {}, $scope.datasets || {});

      ngModel.$parsers.push(function (value) {
        ngModel.$setValidity('typeahead', $scope.isChanged);

        if ($scope.isChanged) {
          $scope.isChanged = false;
        } else {
          var key = $scope.datasets.displayKey ? $scope.datasets.displayKey : 'value';
          if (ngModel.$modelValue && value == ngModel.$modelValue[key]) {
            value = ngModel.$modelValue;
          } else {
            value = undefined;
          }
        }

        return value;
      });

      $scope.changeModel = function(value) {
        $scope.$apply(function () {
          $scope.isChanged = true;
          ngModel.$setViewValue(value);
        });
      }

      element.bind('typeahead:selected', function(event, suggestion) {
        $scope.changeModel(suggestion);
      });

      element.bind('typeahead:autocompleted', function(event, suggestion, dataset) {
        $scope.changeModel(suggestion);
      });

    }
  }

});
