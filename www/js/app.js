var myepubApp = angular.module('epubApp', ['ionic','epubApp.audio','ngCordova','ngStorage']);

    myepubApp.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('intro', {
        url: '/',
        templateUrl: 'index.html',
        controller: 'epubAppController'
    })

    $urlRouterProvider.otherwise("/");

})


myepubApp.controller('epubAppController', function($scope, $ionicActionSheet,$window,$state, $ionicSideMenuDelegate,$ionicPopover,$localStorage) {
//  $window.alert($window.localStorage['currentCFI']);
  if(typeof $window.localStorage['currentCFI']==='undefined') {
    console.log('undefined currentcfi');
  }
  else{
  book.goto($window.localStorage['currentCFI']);
  }
  console.log('epubAppController');
  // variables for the background color
  // 1= dark , 2 = Beige , 3 = White
  $scope.colorBackground = 2;

  // Bookmark Variables
  $scope.listCanSwipe = true;
  // variable to switch between bookmarks and toc in left side menu
  $scope.tocOrBookmarks = true;
  $scope.toc = false;
  $scope.marks = false;
  $scope.audioToReader = false;
  $scope.landscape = false; 
  $scope.destoryePubiFrame = function(){
    console.log('try to destory ifrmae');
    var el = document.getElementsByTagName("iframe")[0];
    el.parentNode.removeChild(el);
  }

  $scope.addePubiFrame = function(){
    //currentCFI is being overwritten once new book book is loaded
    var oldcfi = $window.localStorage['currentCFI'];
    if($scope.landscape){
      if(viewportHeight<viewportWidth){
        book = ePub("reader/effi/", {spreads:true, width: 0.9 * screen.width, height: screen.height - 1.5 * $window.trim});
      }
      else{
          book = ePub("reader/effi/", {spreads:true , width: 0.9 * screen.height, height: screen.width - 1.3 * $window.trim});
      }

    } else{
      book = ePub("reader/effi/", {width: 0.9 * screen.width, height: screen.height - 1.3 * $window.trim});
    }
    book.renderTo("main").then(function(){
    // for some reasong goTo url fails
    //book.goto($window.localStorage['currentCFI']);
    book.displayChapter(oldcfi);
    });
        book.on('renderer:locationChanged', function(locationCfi){
                if(typeof currentCFI ==='undefined'){
                  console.log('if start')

                  previousCFI= book.getCurrentLocationCfi();
                  currentCFI = book.getCurrentLocationCfi();
                } else{
                  console.log('else');

                  previousCFI= currentCFI;
                  currentCFI = book.getCurrentLocationCfi();
                }
                console.log('start');
                console.log(previousCFI);
                console.log(currentCFI);
                console.log(locationCfi)
                $window.localStorage['currentCFI'] = currentCFI;
          });
  }

  $scope.goToLastPageVisited = function(){
    console.log(previousCFI);
    book.goto(previousCFI);
  }

  $scope.toggleAudio = function(){
    $scope.audioToReader=true;
  }
  $scope.toggleReader = function(){
    $scope.audioToReader=false;
  }
  $scope.setDark = function(){
    $scope.colorBackground = 1;
    book.setStyle("color","white");
  }
  $scope.setLight = function(){
    $scope.colorBackground = 3;
    book.setStyle("color","black");
  }
  $scope.setBeige = function(){
    $scope.colorBackground = 2;
    book.setStyle("color","black");
  }
        
  $scope.switchBetweenTocAndBookmarks = function() {
    $scope.tocOrBookmarks=!$scope.tocOrBookmarks;
     
  };

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('settings-menu.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

 $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
  }
  $scope.showDetails = function() {
    $ionicActionSheet.show({
     buttons: [
       { text: 'Complete' }
     ],
     destructiveText: 'Delete',
     titleText: 'Update Todo',
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       return true;
     }
   });

  }

  $scope.onSwipeLeft = function () {
    book.nextPage();
  }
  $scope.onSwipeRight = function () {
    book.prevPage();
  }
  $scope.changeFont = function(){
//    book.removeStyle();
    book.setStyle("font-family","Arial Black");
//    book.setStyle("margin","30%");
  }
  $scope.changeFont2 = function(){
//    book.removeStyle();
    book.setStyle("font-family","Times New Roman");
//    book.setStyle("background-color","blue");
//    book.setStyle("margin","10%");
  }  
// em is used to define the font size based on the current font size
// 1em means no change 0.5em half of default size 2em double default size.
// keep in mind that when you go to 2.2em and then call 0.5em it changes back based on the initial font size 
  $scope.increaseFontSize = function(){
    if(window.fontsize!=3){
      window.fontsize+=0.2;
      console.log("font Size increase");
      book.setStyle("font-size", window.fontsize + "em");
      console.log(window.fontsize);
    }
  }
  $scope.decreaseFontSize = function(){
      if(window.fontsize!=0.2){
        console.log(window.fontsize);
        window.fontsize-=0.2;
        console.log("font decrease");
        book.setStyle("font-size",window.fontsize + "em");
      }
  }
  $scope.booklog = function(){
    var test;
    book.ready.all.then(function(){
                 test = book.generatePagination();
                 //console.log(test);
             });
/*            console.log(book.location.anchorPage);

            console.log(book.location.pageRange);
             console.log(location.anchorPage, location.pageRange);
             book.on('book:pageChanged', function(location){
                console.log(location.anchorPage, location.pageRange)
              });
*/
  }
    // add the current page as a bookmark to the list of bookmarks
    $scope.createBookmarkForCurrentPage = function(){
    var obj = {};
    var cfi = "cfi";
    var page = "page";
    var url = book.getCurrentLocationCfi();
    var val2 = 2;
    obj[cfi] = url;
    obj[page] = new Date();

    isNotADublicate = true;
    $scope.bookmarks.forEach(function(entry) {
        if(entry.cfi == obj.cfi) isNotADublicate = false;
        //console.log(entry.cfi);
        //console.log(obj.cfi);
        
    });
    if(isNotADublicate){
      $scope.bookmarks.push(obj)
      $localStorage['bookmarks'] = $scope.bookmarks;
    }
  }

  $scope.gotoBookmarkURL = function(url) {
        book.displayChapter(url);
        $ionicSideMenuDelegate.toggleLeft();
    }
  $scope.deleteBookmark = function(bookmark){
    console.log("mytest");
    $scope.bookmarks.splice($scope.bookmarks.indexOf(bookmark), 1);
    $localStorage['bookmarks'] = $scope.bookmarks;  
  }

  if(!$localStorage['bookmarks']){
    $localStorage['bookmarks'] = [];
  }
  $scope.bookmarks = $localStorage['bookmarks'];

  $scope.generatedToc=[];

  $scope.showToc = function(){
    $scope.toc= !$scope.toc;
  }
  $scope.showBookmarks = function(){
    $scope.marks= !$scope.marks;
  }
    $scope.populateToc= function(){
      console.log('test');
      book.getToc().then(function(toc){
               toc.forEach(function(chapter) {
                  var obj = {};
                  var cfi = "cfi";
                  var page = "page";
                  var url = chapter.href;
                  var val2 = chapter.label;
                  obj[cfi] = url;
                  obj[page] = val2;
                  $scope.generatedToc.push(obj);
               });
     });

    }
    $scope.goToChapter= function(url){
      book.goto(url);
      $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.populateToc();

    $scope.openQuiz = function() {
      	window.location.replace("app/components/quiz/quizView.html");
    }
    angular.element($window).bind('orientationchange', function () {
      switch(window.orientation) 
      {  
      case -90:
      case 90:

        console.log('landscape');
        $scope.landscape = true;
        $scope.destoryePubiFrame();
        $scope.addePubiFrame();

        break; 
      default:
        console.log('portrait');
        $scope.landscape = false;
        $scope.destoryePubiFrame();
        $scope.addePubiFrame();
    

        break; 
    }

});
})