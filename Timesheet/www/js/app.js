ionic.Platform.ready(function(){
  try{
    angular.bootstrap(document.getElementsByTagName('body')[0], ['starter'])

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  }
  catch(e){
    alert(e)
  }
})   





// Ionic Starter App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    angular.module('starter', ['ionic','ngCordova'])

//    .run(function($ionicPlatform) {
//         $ionicPlatform.ready(function() {
//                              if(window.cordova && window.cordova.plugins.Keyboard) {
//                              // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//                              // for form inputs)
//                              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//                              
//                              // Don't remove this line unless you know what you are doing. It stops the viewport
//                              // from snapping when text inputs are focused. Ionic handles this internally for
//                              // a much nicer keyboard experience.
//                              cordova.plugins.Keyboard.disableScroll(true);
//                              }
//                              if(window.StatusBar) {
//                              StatusBar.styleDefault();
//                              }
//             
//             
//                              });
//         })

    //service
    .service('TimesheetService',function($q){
             return {
             tasks:[],
             
             initTasks:function(tasks){
             
             this.tasks=tasks;
             
             },
             
            getTasks:function(){
            
             return this.tasks;
             
             },
             
             getTask:function(taskId){
             
             var dfd=$q.defer();
             this.tasks.forEach(function(task){
                                if(task.id==taskId)
                                dfd.resolve(task);
                                })
             return dfd.promise;
             },
             
             
             addTask:function(task){
             
             var jsonObject={
             id:this.tasks.length+1,
             date: task.date,
             description:task.description,
             projectName:task.projectName,
             
             };
             
             this.tasks.push(jsonObject);
         
             }
             }
             })
    //Service ends




    .config(function($stateProvider,$urlRouterProvider){
            
            $urlRouterProvider.otherwise('/')
            
            $stateProvider.state('home',{
                                 url:'/',
                                 templateUrl :'templates/home.html',
                                 controller:'MyCtrl',
                                 })
            
            $stateProvider.state('taskdetail',{
                                 url:'taskdetail',
                                 controller:'TaskCtrl',
                                 templateUrl :'templates/taskdetail.html',
                                 params:      {'id': null}
                                 
                                 })
            
            })

    .controller('MyCtrl', function($scope,$ionicModal,$ionicPlatform,$state,$cordovaPreferences,TimesheetService) {
                
                //Initilize tasks
                $cordovaPreferences.fetch('key','ionic_dict')
                             .success(function(value) {
                                      var jsonData =angular.fromJson(value);
                                      if(jsonData!=null && jsonData != undefined){
                                      
                                      TimesheetService.initTasks(JSON.parse(jsonData.list));

                                     $scope.tasks = TimesheetService.getTasks();

                                      }
                                      
                                      })
                             .error(function(error) {
                                    alert("Error: " + error);
                                    })                    
                
                
                /* $scope.data = {
                 showDelete: false
                 };
                 
                 $scope.edit = function(item) {
                 alert('Edit Item: ' + item.id);
                 };
                 $scope.share = function(item) {
                 alert('Share Item: ' + item.id);
                 };
                 
                 $scope.moveItem = function(item, fromIndex, toIndex) {
                 $scope.items.splice(fromIndex, 1);
                 $scope.items.splice(toIndex, 0, item);
                 };
                 
                 $scope.onItemDelete = function(item) {
                 $scope.items.splice($scope.items.indexOf(item), 1);
                 };*/
                
                
                //Modal i.e new task
                $ionicModal.fromTemplateUrl('templates/addtask.html', {
                                            scope: $scope,
                                            animation: 'slide-in-up'
                                            }).then(function(modal) {
                                                    $scope.newtaskmodal = modal
                                                    })  
                
                $scope.newTask = function() {
                $scope.newtaskmodal.show()
                }
                
                $scope.cancel=function(){
                $scope.newtaskmodal.hide()
                }
                
                $scope.saveTask=function(task){
   
                                     //push task in array
                                     TimesheetService.addTask(task)
                                     //get task
                                     var tasks=TimesheetService.getTasks();
                                     //save in preference
                                   
                    var JSONObject={list:JSON.stringify(tasks)};
                
                                               //save array in preference
                                               $cordovaPreferences.store('key', JSONObject,'ionic_dict')
                                               .success(function(value) {
                                                        alert("Success: " + value);
                                                        })
                                               .error(function(error) {
                                                      alert("Error: " + error);
                                                      })
                
                                     
                                     $scope.newtaskmodal.hide()
                                    
                                     //unset value
                                     task.date=''
                                     task.description=''
                                     task.projectName=''
                                     }
                                    
                                     $scope.onTaskClick=function(taskId){
                                        $state.go('taskdetail', { 'id': taskId});
                                     }
                                        
                                         //   })//ionic ready

            })// MyCTRL controler ends
                
   
                .controller('TaskCtrl',function($scope,$stateParams,TimesheetService){
                var taskId=$stateParams.id;
                $scope.task=null
                TimesheetService.getTask(taskId).then(function(task){
                                                      $scope.task=task;
                                                      })
                
                })

