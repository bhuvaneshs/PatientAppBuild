/**
 * Created by anandraj on 8/25/2015.
 */
var appfilt = angular.module('starter.filters', ['starter.services']);

appfilt.filter('nospace', function () {
 return function (value) {
  return (!value) ? '' : value.replace(/ /g, '');
 };
});

/*appfilt.directive('googleplace', function() {
 return {
 require: 'ngModel',
 link: function(scope, element, attrs, model) {
 var options = {
 types: ['(regions)'],
 componentRestrictions: {country:'in'},
 address: {},
 establishment: {}

 };
 scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

 google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
 scope.$apply(function() {
 model.$setViewValue(element.val());
 });
 });
 }
 };
 });*/
