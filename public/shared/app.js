//define angular modules here
angular.module('ilite.routes',['ngRoute']);
angular.module('ilite.common',['ngResource']);
angular.module('ilite.recycleRush',[]);

//app-level module is iliteApp
var app = angular.module('iliteApp', ['ui.bootstrap', 'ilite.routes', 'ilite.common', 'ilite.recycleRush']);

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});