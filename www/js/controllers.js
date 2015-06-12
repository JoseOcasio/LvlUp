var taskCompletedTitle;
var taskCompletedId;
var taskCompletedTotal;
var taskCompletedMeasured;
var taskCompletedDate;
angular.module('starter.controllers', ['ionic.utils'])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $localstorage) {
  
  $scope.currentUsername = $localstorage.get("username");
  if ($scope.currentUsername == undefined){
    $state.go('app.usernameScreen');
  }
  
  $scope.onlyNumbers = /^\d+$/;

  //will get the current level
  $scope.currentLevel = $localstorage.get("level");

  if ($scope.currentLevel == undefined){
     $scope.currentLevel = 1;
     $localstorage.set("level", 1);
  }

  $scope.xp = $localstorage.get("xp");
  if ($scope.xp == undefined){
     $scope.xp = 0;
     $localstorage.set("xp", 0);
  }

  $scope.productivityToday = $localstorage.get("productivityToday");
  if ($scope.productivityToday == undefined){
     $scope.productivityToday = 0;
     $localstorage.set("productivityToday", 0);
  }

  //variable that will hold all the tasks 
  $scope.tasksCollection = [];

  $scope.tasksHistory = [];

  //will hold the index position of each entry to tasksCollection
  $scope.indexPosition = $localstorage.get("indexPosition");

  $scope.indexPositionHistory = $localstorage.get("indexPositionHistory");

  if ($scope.indexPositionHistory == undefined)
  {
    $scope.indexPositionHistory = 0;
  }


  if ($scope.indexPositionHistory != 0) {
    for (var i = 0; i<$scope.indexPositionHistory ; i++){
      $scope.tasksHistory.push(
        $localstorage.getObject("history" + i));
        //console.log($localstorage.getObject("history" + i));
    }


  }

  //if index is new, init to 0
  if ($scope.indexPosition == undefined)
  {
    $scope.indexPosition = 0;
  }
  
  //fill tasks collection with local storage data
  if ($scope.indexPosition != 0){
  for (var i=0; i< $scope.indexPosition; i++)
  {
    $scope.tasksCollection.push(
      $localstorage.getObject("task" + i));
    //console.log($localstorage.getObject("task" + i));
  }
}

  $scope.progressCheckpoint = 0;

  // Modal for the task completion value
  $ionicModal.fromTemplateUrl('app/task/taskcompletion.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  //close popup modal
  $scope.closeTaskCompletion = function() {
    $scope.modal.hide();
  };

  //history icon
  $scope.OpenHistory = function() 
  {
    $state.go('app.history');
  };

  $scope.OpenAchievements = function() 
  {
    $state.go('app.achievements');
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doTaskCompletion = function() {
    $timeout(function() {
      $scope.closeTaskCompletion();
    }, 500);
  };
})

  .controller('tasksCtrl', function($scope, $state, $ionicPopup, $localstorage, $timeout) {
  $scope.navTo = function(location) {
    $state.go('app.' + location);
  };

  // $scope.deleteItem = function()
  // {
  //   console.log("Delete Item");
  // };

  $scope.calculateExp =  function()
  {
      var total = 0;
      $scope.exp = 0;
      for(var i = 0; i < $scope.tasksHistory.length; i++){
        var task = $scope.tasksHistory[i];
        total += (task.done / task.total);
      }
      var totalExp = (total / $scope.calculateMaxProgress());
      //totalExp += $localstorage.get("xp");
      $scope.exp = Math.floor(totalExp*100);
      
      //console.log("Total: " + total + " max prog : " + $scope.calculateMaxProgress());
      if (totalExp == ($scope.calculateMaxProgress() + $scope.progressCheckpoint))
      {
        $scope.currentLevel++;
        $localstorage.set("level", $scope.currentLevel);
        //console.log($localstorage.get("level"));
        $scope.progressCheckpoint = (total / $scope.calculateMaxProgress());
        $localstorage.set("xp", $scope.progressCheckpoint);
        //console.log("Check: " + totalExp);
        return 0;
      }
      if (totalExp > ($scope.calculateMaxProgress() + $scope.progressCheckpoint))
      {
        var lvlUps = Math.floor(totalExp/($scope.calculateMaxProgress() + $scope.progressCheckpoint));
        var remainder = (totalExp/($scope.calculateMaxProgress() + $scope.progressCheckpoint)) % 1;
        for (var i = 0; i < lvlUps; i++)
        {
          $scope.currentLevel++;
          $localstorage.set("level", $scope.currentLevel);
        }
        $scope.progressCheckpoint = (total / $scope.calculateMaxProgress()) - remainder;
        $localstorage.set("xp", $scope.progressCheckpoint);
        return 0;
      }

      else
      {
       // console.log("else: " + "totalExp: " + totalExp + " prog: " + $scope.progressCheckpoint + " resul" + (totalExp - $scope.progressCheckpoint));
        //var tempExp = $localstorage.get("xp");
        //console.log("en el else: " + tempExp);
        $localstorage.set("xp", (totalExp - $scope.progressCheckpoint).toFixed(2));
        //console.log("Total Exp: " + totalExp);
        return (totalExp - $scope.progressCheckpoint).toFixed(2);
      }

  };

  $scope.calculateLevel = function()
  {
    return $scope.currentLevel;
  
  };

  $scope.calculateCurrentXP = function(){
    return $localstorage.get("xp");
  }


  $scope.getCurrentUser = function(){
    return $localstorage.get("username");
  }
  $scope.calculateMaxProgress = function()
  {
    return ($scope.calculateLevel()*2);
  };


  $scope.doRefresh = function() {
    // $http.get('/new-items')
    //  .success(function(newItems) {
    //    $scope.items = newItems;
    //  })
      
     // .finally(function() {
     //   // Stop the ion-refresher from spinning
     //   $scope.$broadcast('scroll.refreshComplete');
     // });
      
      $scope.$broadcast('scroll.refreshComplete');
    };

 //add a task
 $scope.addTask = function() {

  if ($scope.taskInfo == undefined || ($scope.taskInfo != undefined && $scope.taskInfo.length == 0 ) || ($scope.result != "Yes" && $scope.result != "No")){
        $ionicPopup.alert({
        title: 'Warning',
        template: 'Fields cannot be left blank!'
      })
    }
    else if (($scope.result == "Yes" && $scope.taskMinutes == undefined) || $scope.taskMinutes <= 0)
    {
    $ionicPopup.alert({
        title: 'Warning',
        template: 'Minutes must be a positive number!'
      })
    }
  else {
    var total = 0;
    if($scope.result == "Yes")
    {
      total = $scope.taskMinutes;
    }
    else
    {
      total = 1;
    }
    //store on localstorage by entry
    var entry = "task" + $scope.tasksCollection.length;

     $scope.indexPosition = $scope.tasksCollection.length; 
    //console.log("Index es ahora: " + $scope.indexPosition);
    $localstorage.set("indexPosition", $scope.tasksCollection.length + 1);

    $localstorage.setObject(entry, {
        info: $scope.taskInfo,
        measured: $scope.result,
        total: total,
        done: 0,
        id: $scope.tasksCollection.length,
        date: null
    });
//console.log("Id cuando guarda: " + $scope.tasksCollection.length);


    var get = $localstorage.getObject(entry);

//console.log(entry + "   " + get.info);

        $scope.tasksCollection.push({
        info: get.info,
        measured: get.measured,
        total: get.total,
        done: 0,
        id: get.id,
        date: null
    });

   
     
      $state.go('app.home');
    
    };

  }

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('Test', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('addTaskCtrl', function($scope, $ionicConfig) {
$ionicConfig.backButton.text("Add Task");
  $scope.hide = true;
  $scope.devList = [
    { text: "Yes", checked: false},
    { text: "No", checked: false}
  ];

      $scope.change = function(devList) {
        angular.forEach($scope.devList, function(item) {
            item.checked = false;
        });
        devList.checked = true;
        $scope.result = devList.text;
        if(devList.text == "Yes")
        {
          $scope.hide = false;
        }
        else 
        {
          $scope.hide = true;
        }
    };

})

.controller('TaskCompletionCtrl', function($scope, $localstorage, $timeout) {

  $scope.totalOfTask =  function(){
    return taskCompletedTotal;;
  }
  

  $scope.modifyCompletion = function(completion){

      var d = new Date().toString();
        $scope.tasksHistory.push({
        info: taskCompletedTitle,
        measured: taskCompletedMeasured,
        total: taskCompletedTotal,
        done: completion,
        id: taskCompletedId,
        date: d
         });
        console.log("task name cuando es si: " + taskCompletedTitle);
         var entry = "history" + ($scope.tasksHistory.length - 1);
            $localstorage.setObject(entry, {
              info: taskCompletedTitle,
              measured: taskCompletedMeasured,
              total: taskCompletedTotal,
              done: completion,
              id: taskCompletedId,
              date: d
            });

            $localstorage.set("indexPositionHistory", $scope.tasksHistory.length);
    };
})


.controller('HistoryCtrl', function($scope, $ionicConfig, $localstorage) {
$ionicConfig.backButton.text("History");

   $scope.HistoryTotalCompleted = function(done, total){
     return Math.trunc((done/total) * 100);
   }

  
  $scope.calculateProductivity = function(){

    if ($scope.tasksHistory.length == 0)
      return 0;
    var total = 0;
    var multiplier = 0;
    for(var i = 0; i < $scope.tasksHistory.length; i++){
        var task = $scope.tasksHistory[i];
        if (task.measured == "Yes"){
          total += ((task.done*2) / task.total);
          multiplier++;
        }
        else total += (task.done / task.total);

      }
        return Math.trunc((total/($scope.tasksHistory.length+multiplier))*100);
      
      
    };

  $scope.getTasksToday = function (){

    var finishDate = new Date();
    var startDate = new Date();
    var times = 0;
    finishDate.setHours(23, 59, 59, 0);
    startDate.setHours(0,0,0,0);

    var times = 0;
    for(var i = 0; i < $scope.tasksHistory.length; i++){
      var task = $scope.tasksHistory[i];
      if (Date.parse(task.date) < finishDate && Date.parse(task.date) > startDate)
      {
        times++;
      }
    }
    return times;

  }

 $scope.dailyProductivity = function(){
   //when storing each object, store the date. Then only show for a lapse of 24 hours the calculation
   if ($scope.tasksHistory.length == 0)
      return 0;

    var total = 0;
    var multiplier = 0;
    var finishDate = new Date();
    var startDate = new Date();
    var times = 0;
    finishDate.setHours(23, 59, 59, 0);
    startDate.setHours(0,0,0,0);
    
    for(var i = 0; i < $scope.tasksHistory.length; i++){
        var task = $scope.tasksHistory[i];

       console.log("Start Date: : " + startDate + " currentDate: " + Date.parse(task.date) + " Finish Date: " + finishDate);
       //console.log("History length     : " + $scope.tasksHistory.length);

      if (Date.parse(task.date) < finishDate && Date.parse(task.date) > startDate)
        {
        if (task.measured == "Yes"){
          total += ((task.done*2) / task.total);
          multiplier++;
        }
        else total += (task.done / task.total);

          //console.log("heheeheheheheheheheh: " + $scope.tasksToday++);
          //$scope.tasksToday = $scope.tasksToday + 1;
        }
        
      }
        //$localstorage.set("productivityToday", (total/($scope.tasksHistory.length+multiplier))*100 )
        if (isNaN(Math.trunc(total/$scope.getTasksToday())))
          return 0;
        else
          return Math.trunc((total/($scope.getTasksToday()+multiplier))*100);
      
      
    };

  $scope.deleteTask = function(index, id){
      $scope.tasksCollection.splice(index, 1);
      $localstorage.removeItem("task" + id);
  };

  $scope.addToHistory = function(index, title, measured, total, done, id) 
     {
      taskCompletedTitle = title;
      taskCompletedId = id;
      taskCompletedMeasured = measured;
      taskCompletedTotal = total;
      taskCompletedIndex = index;
     
        var d = new Date().toString();
        
        if (measured == "No")
        {
          done = 1;
          $scope.tasksHistory.push({
            info: title,
            measured: measured,
            total: total,
            done: done,
            id: id,
            date: d
          });

        }
        else if (measured == "Yes")
        {
          $scope.modal.show();
        }
        
         console.log("delete");
         $scope.tasksCollection.splice(index, 1);
         $localstorage.removeItem("task" + id);

          var indexTemp = $localstorage.get("indexPosition");
          var lvl = $localstorage.get("level");
          var exp = $localstorage.get("xp");
          var productivityToday = $localstorage.get("productivityToday");
          var username = $localstorage.get("username");
          // exp
          $localstorage.clear();
          var d = new Date().toString();

          //checkpoint
          for (var i =0; i< $scope.tasksCollection.length; i++)
          {
            var entry = "task" + i;
            $localstorage.setObject(entry, {
              info: $scope.tasksCollection[i].info,
              measured: $scope.tasksCollection[i].measured,
              total: $scope.tasksCollection[i].total,
              done: $scope.tasksCollection[i].done,
              id: $scope.tasksCollection.length,
              date: d
            });

          }

          for (var i =0; i< $scope.tasksHistory.length; i++)
          {
            var entry = "history" + i;
            $localstorage.setObject(entry, {
              info: $scope.tasksHistory[i].info,
              measured: $scope.tasksHistory[i].measured,
              total: $scope.tasksHistory[i].total,
              done: $scope.tasksHistory[i].done,
              id: i,
              date: $scope.tasksHistory[i].date.toString()
            });

          }

          $localstorage.set("username", username);
          $localstorage.set("indexPosition", indexTemp - 1);
          $localstorage.set("level", lvl);
          $localstorage.set("xp", exp);
          //$localstorage.set("productivityToday", productivityToday);
          $localstorage.set("indexPositionHistory", $scope.tasksHistory.length);

     };

     
})

.controller('usernameCtrl', function($scope, $stateParams, $ionicPopup, $state, $localstorage, $timeout) {

  $scope.saveUsername = function (username){
    //console.log(username);
    if (username == undefined)
    {
       $ionicPopup.alert({
        title: 'Warning',
        template: 'Username field cannot be blank!'
      })
    }
    else if (username.length == 0)
    {
         $ionicPopup.alert({
        title: 'Warning',
        template: 'Username field cannot be blank!'
      })
    }
    else {
      $scope.currentUsername = username;
      console.log("Si o no: " + $scope.currentUsername);
      $localstorage.set("username", username);
      $state.go("app.home");
    }
  };


})

.controller('AchievementsCtrl', function($scope, $stateParams, $ionicConfig) {
  $ionicConfig.backButton.text("Achievements");

  $scope.getTasksHistory = function(){
    return $scope.tasksHistory.length;
  }

  $scope.getSingle100PercentTask = function(){
    var flag = false;
    for (var i =0; i< $scope.tasksHistory.length; i++){
      if ($scope.tasksHistory[i].measured == "Yes")
      {
        if(($scope.tasksHistory[i].total / $scope.tasksHistory[i].done) == 1){
          flag = true;
          console.log("In");
        }
      }
    }

    if (flag){
      return 1;
    }
    else return 0;
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});


angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key) {
      return $window.localStorage[key];
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeItem: function(key){
    $window.localStorage.removeItem(key);
    },
    removeByIndex: function (index) {
    $window.localStorage.removeItem($window.localStorage.key(index));
    },
    getByIndex: function (index) {
    return JSON.parse(($window.localStorage.key(index)));
    },
    clear: function (){
      $window.localStorage.clear();
    }

  }

}]);