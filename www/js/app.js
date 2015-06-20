// Ionic LvlUp App

angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

    .state('app.usernameScreen', {
    url: "/welcome",
    views: {
      'menuContent': {
        templateUrl: "app/home/usernameScreen.html",
        controller: "usernameCtrl"
      }
    }
  })

    .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "app/home/home.html",
        controller: 'tasksCtrl'
      }
    }
  })

  .state('app.addtask', {
    url: "/addtask",
    views: {
      'menuContent': {
        templateUrl: "app/task/addtask.html",
        controller: 'addTaskCtrl'
      }
    }
  })

    .state('app.history', {
      url: "/history",
      views: {
        'menuContent': {
          templateUrl: "app/history/history.html",
          controller: 'HistoryCtrl'
        }
      }
    })

    .state('app.achievements', {
      url: "/achievements",
      views: {
        'menuContent': {
          templateUrl: "app/achievements/achievements.html",
          controller: 'AchievementsCtrl'
        }
      }
    })

    .state('app.singleHistory', {
    url: "/history/:historyId",
    views: {
      'menuContent': {
        templateUrl: "app/history/history.html",
        controller: 'HistoryCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/home');
});

