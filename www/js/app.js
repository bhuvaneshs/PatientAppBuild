var mainApp = angular.module('starter', ['ionic','starter.controllers','ngCordova','ionic-datepicker','ionic-timepicker','ionic.ion.imageCacheFactory','ionic-native-transitions']);


mainApp.run(function ($ionicPlatform, $rootScope ,$cordovaNetwork,$cordovaToast,$state, $ionicPopup,$location,$ImageCacheFactory) {


    $ionicPlatform.ready(function () {


        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        $ImageCacheFactory.Cache([
            "templates/res/Anasthesia.png",
            "templates/res/bariatric.png",
            "templates/res/cardiologist.png",
            "templates/res/dentist.png",
            "templates/res/dermotology.png",
            "templates/res/emergency.png",
            "templates/res/endocrinology.png",
            "templates/res/ent.png",
            "templates/res/gastrologist.png",
            "templates/res/gensurgery.png",
            "templates/res/intmedicine.png",
            "templates/res/nephrology.png",
            "templates/res/neurologist.png",
            "templates/res/neurosurgery.png",
            "templates/res/oncology.png",
            "templates/res/orthopedic.png",
            "templates/res/painmanagement.png",
            "templates/res/pediatric.png",
            "templates/res/plasticsurgery.png",
            "templates/res/psychiatry.png",
            "templates/res/pulmonology.png",
            "templates/res/rheumatology.png",
            "templates/res/surgicalgastro.png",
            "templates/res/urology.png",
            "templates/res/womancare.png",
            "templates/res/searchname.png",
            "templates/res/searchbydept.png",
            "templates/res/contact.png",
            "templates/res/continental.png",
            "templates/res/Parkway-logo.png",
            "templates/res/TSL-with-jacket-2.png",
            "templates/res/Dr-Guru-N-Reddy.png",
            "templates/res/harish-manian.png",
            "templates/res/Gold-Seal.png",
            "templates/res/NABH-Logo.png",
            "templates/res/continental-logo.png"
        ]);
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
        localStorage.network_type = type;
        localStorage.isOnline = isOnline;
        localStorage.network_state;
        if (localStorage.isOnline) {
            localStorage.network_state = "online";
        } else {
            localStorage.network_state = "offline";
        }

        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {

            var onlineState = networkState;
            localStorage.onlineState = onlineState;
            if (localStorage.onlineState) {
                localStorage.network_state = "online";
            } else {
                $ionicPopup.alert({
                        title: 'No internet!',
                        template: 'Please connect to wifi or mobile data!'
                    }
                ).then(function (res) {
                        $cordovaToast.showLongCenter('No internet!');
                    });

                localStorage.network_state = "offline";
            }

        });
        $ionicPlatform.onHardwareBackButton(function(e) {

        });

        pushNotification = window.plugins.pushNotification;
        window.onNotification = function(e){

            switch(e.event){
                case 'registered':
                    if(e.regid.length > 0){
                        var device_token = e.regid;
                        localStorage.deviceid = device_token;
                    }
                    break;

                case 'message':
                    $location.path('app/myappointments');
                    break;

                case 'error':
                    break;

            }
        };


        window.errorHandler = function(error){
        }


        pushNotification.register(
            onNotification,
            errorHandler,
            {
                'badge': 'true',
                'sound': 'true',
                'alert': 'true',
                'senderID': '295163319566',
                'ecb': 'onNotification'
            }
        );

    });
});


mainApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html",
                    controller: "homeCtrl"
                }
            }
        })
        .state('app.doctorsearch', {
            url: '/doctorsearch',
            views: {
                'menuContent': {
                    templateUrl: "templates/searchdoctor.html",
                    controller: "homeCtrl"
                }
            }
        })
        .state('app.search', {
            url: "/search",
            cache:true,
            views: {
                'menuContent': {
                    templateUrl: "templates/search.html",
                    controller: 'SearchCtrl'
                }
            }
        })

        .state('app.myappointments', {
            url: "/myappointments",
            cache:false,
            views: {
                'menuContent': {
                    templateUrl: "templates/myappointments.html",
                    controller: 'MyAppointmentsCtrl'
                }
            }
        })
        .state('app.map', {
            url: "/map",
            views: {
                'menuContent': {
                    templateUrl: "templates/map.html",
                    controller: 'MapCtrl'
                }
            }
        })
        .state('app.aboutus', {
            url: '/aboutus',
            views: {
                'menuContent': {
                    templateUrl: "templates/aboutus.html",
                    controller: "aboutusCtrl"
                }
            }
        })
        .state('app.services', {
            url: '/services',
            views: {
                'menuContent': {
                    templateUrl: "templates/services.html",
                    controller: "servicesCtrl"
                }
            }
        })
        .state('app.contactus', {
            url: '/contactus',
            views: {
                'menuContent': {
                    templateUrl: "templates/contactus.html",
                    //controller: "aboutusCtrl"
                }
            }
        })

        .state('app.browse', {
            url: "/browse",
            views: {
                'menuContent': {
                    templateUrl: "templates/browse.html"
                }
            }
        })

        .state('app.profile', {
            url: "/profile",
            cache:false,
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: "ProfileCtrl"
                }
            }
        })


        .state('app.searchResults', {
            url: "/searchResults",
            views: {
                'menuContent': {
                    templateUrl: "templates/searchresultpage.html",
                    controller: "searchresultsCtrl"
                }
            }
        })


        .state('app.detailspage', {
            url: "/detailspage",
            cache:false,
            views: {
                'menuContent': {
                    templateUrl: "templates/detailspage.html",
                    controller: "detailspageCtrl"
                }
            }
        })
        .state('app.doctordetailspage', {
            url: "/doctordetailspage",
            cache:false,
            views: {
                'menuContent': {
                    templateUrl: "templates/doctordetailspage.html",
                    controller: "doctordetailspageCtrl"
                }
            }
        })

        .state('app.appointmentFixing', {
            url: '/appointmentFixing',
            views: {
                'menuContent': {
                    templateUrl: "templates/appointmentFixing.html",
                    controller: "AppointmentsFixingCtrl"
                }
            }
        })
    $urlRouterProvider.otherwise('/app/home');


});
mainApp.config(function($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 400, // in milliseconds (ms), default 400,
        slowdownfactor: 1, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });
});
mainApp.config(function($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'fade',
        duration:  400
    });
});
mainApp.config(function($ionicConfigProvider) {
    if (!ionic.Platform.isAndroid()) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.views.maxCache(0);
    }
})
mainApp.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);
