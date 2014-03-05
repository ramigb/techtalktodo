var techTalk = angular.module('techTalk', ['ngRoute','LocalStorageModule'])

// Service
techTalk.service('todoService',function(){
  // ya kbeer.
})

// Controller
techTalk.controller('TodoCtrl', [
  '$scope',
  'todoService',
  'localStorageService',
  '$routeParams',
  function($scope, todoService, localStorageService, $routeParams){

  $scope.todos = localStorageService.get('todos');
  $scope.activeTodo = {};
  $scope.operation = 'Save';

  $scope.saveTodo = function(todo){
    if(!todo.title) return false;

    if($scope.operation == 'Update'){
      $scope.operation = 'Save';
    }else{
      // It is a new object, give it an ID
      todo.id = uuid();
      $scope.todos.push(angular.copy(todo));
    }

    $scope.activeTodo = {};
    // Save localstorage
    $scope.refreshStorage();
  };

  $scope.refreshStorage = function(){
    localStorageService.clearAll();
    localStorageService.add('todos',$scope.todos);
  }

  $scope.editTodo = function(todo){
    $scope.operation = 'Update';
    $scope.activeTodo = todo;
  };

  $scope.removeTodo = function(index){
    goAhead = confirm('Are you sure? Yaba? Akeed? Met2aked? 3an jad?');
    if(!goAhead) return false;
    $scope.todos.splice(index, 1);
    $scope.refreshStorage();
  }

  $scope.findTodo = function(id){
  return $scope.todos.filter(function(x){
      return x.id === id
    })[0]
  }

  $scope.$on('$routeChangeSuccess', function() {
    if(id = $routeParams.todoId){
      $scope.activeTodo = $scope.findTodo(id);
    }
  })


}]); //End of techTalk controller

// Router
techTalk.config(['$routeProvider', '$locationProvider',
  function($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
          when('/',{
            templateUrl: 'partials/welcome.html',
            controller: 'TodoCtrl'
          }).
          when('/list',{
            redirectTo: '/'
          }).
          when('/show/:todoId', {
            templateUrl: 'partials/show.html',
            controller: 'TodoCtrl'
          }).
          otherwise({
            redirectTo: '/'
          });
}]);
// Filter
techTalk.filter('shorten', function() {
  return function(input,howMuch) {
    if(!howMuch) howMuch = 12;
    return input.split(' ').splice(0,howMuch).join(' ') + ' ...';
  };
});
// Directive
techTalk.directive("myPretty", function() {
  return function(scope, element, attrs) {
    $el = $(element);
    $el.on('click',function(e){
      e.preventDefault();
      $(this).fadeOut();
    })
  }
});

// Extra functions
function uuid(){
  return Math.random().toString(36).substr(2,9);
}