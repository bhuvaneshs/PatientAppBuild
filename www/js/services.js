var appserve = angular.module('starter.services', ['ngResource', 'starter.filters']);

appserve.factory('searchService', function ($http) {

    //   var service_url = 'http://182.73.141.106/mobile/DoctorMobileService';
  var service_url = 'http://54.169.42.241/ContinentalService';
    //var service_url = 'http://54.169.42.241/ContinentalServiceTest';
    return {
        getnames: function (x) {
            return $http.get(service_url + '/DoctorDetails.svc/DoctorSearchByAll?SearchText=' + x);
        },
        getlist: function (y) {
            return $http.get(service_url + '/DoctorDetails.svc/DoctorSelectByAll?SearchText=' + y);
        },
        getdetails: function (z,s) {
            return $http.get(service_url + '/DoctorDetails.svc/DoctorSearchById?doctorId=' + z+'&specialityId='+s);
        },
        getspecialist: function (w) {//SpecialitySearchByAll      - speciality autocomplete list use for showing specialities in the search box.
            return $http.get(service_url + '/DoctorDetails.svc/SpecialitySearchByAll?SearchText=' + w);
        },

        getslots: function (u) {//SpecialitySearchByAll      - speciality autocomplete list use for showing specialities in the search box.
            return $http.get(service_url + '/DoctorDetails.svc/DoctorSlotsByDate?SearchText=' + u);
        },

        patientreg: function (v) {//Registe patient quick      - only send first name, last name, email, mobile and password. will send a verification email for activating the account after registration.
            return $http.get(service_url + '/PatientDetails.svc/Create?patient=' + v);
        },

        patregistration: function (z) {//Registe patient quick      - only send first name, last name, email, mobile and password. will send a verification email for activating the account after registration.
            return $http.get(service_url + '/PatientDetails.svc/Register?patient=' + z);
        },

        verifyOTP: function (i) {//Registe patient quick      - only send first name, last name, email, mobile and password. will send a verification email for activating the account after registration.
            var a = i.patientId;
            var b = i.OTP;
            return $http.get(service_url + '/PatientDetails.svc/VerifyOTP?OTP="' + b + '"&patientId=' + a);
        },

        resendOTP: function (r) {
            return $http.get(service_url + '/PatientDetails.svc/ReSendOTP?patientId=' + r);
        },

        getUserProfile: function (i) {//Registe patient quick      - only send first name, last name, email, mobile and password. will send a verification email for activating the account after registration.
            var a = i.patientId;
            return $http.get(service_url + '/PatientDetails.svc/getUserProfile?patientId=' + a);
        },

        patientlogin: function (a) {//Login for patient      - send username and password, this is un encrypted as of now but an encrytpion method should be implemented in future.
            var x = a.username;
            var y = a.password;
            return $http.get(service_url + '/PatientDetails.svc/Login?userName="' + x + '"&password="' + y + '"');
        },
        getPassword :function(a,b)
        {
            return $http.get(service_url+ '/PatientDetails.svc/GetPassword?email="'+a+'"&mobile="'+b+'"');
        },
        bookAppointment: function (w) {//Book an appointment      - send the appointment time date and doctor id with client id and patient id
            return $http.get(service_url + '/AppointmentDetails.svc/Create?appointment=' + w);
        },
        sendappointmentnotify: function (w,d) {//Book an appointment      - send the appointment time date and doctor id with client id and patient i
            return $http.get(service_url + '/AppointmentDetails.svc/SendNotifications?message='+w+'&device_token='+d);
        },
        myAppointments: function (b) {//Appointments list       - get the full list of appointments for the patient by passing patient id as param.
            return $http.get(service_url + '/AppointmentDetails.svc/List?patientId=' + b);
        },

        cancelAppointment: function (i,j,k,l,m,n,o,p) {//Cancel the appointment       - send appointment id and patient id as param.
            return $http.get(service_url + '/AppointmentDetails.svc/Cancel?appointmentId='+ i +'&patientId=' +j+'&PatientName='+k+'&email='+l+'&doctorname='+m+'&stringdate='+n+'&stringtime='+o+'&department='+p);
        },

        profileUpdate: function (d) {//Cancel the appointment       - send appointment id and patient id as param.

            return $http.get(service_url + '/AppointmentDetails.svc/Cancel?appointmentId=' + x + '&patientId=' + y);
        },

        getProfile: function () {//Cancel the appointment       - send appointment id and patient id as param.
            var i = localStorage.pid;
            return $http.get(service_url + '/PatientDetails.svc/GetUserDetails?UserId=' + i);
        },
        getYoutubeLink : function(){
            return $http.get(service_url + '/PatientDetails.svc/Getlink');
        },

        //getAppointmentDocsList: function (x) {//get all the documents attached to a particular appointment.
        //
        //    return $http.get('http://54.169.42.241/Mobile/PatientWebApi/api/Document/GetDocumentList?appointmentId='+x);
        //},

        //
        //getLocationDetails: function () {// pass latitude and longitude obtained from the geolocate cordova plugin(localStorage.lat and localStorage.long)
        //    var x = localStorage.user_lat;
        //    var y = localStorage.user_long;
        //
        //    return $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + x + ',' + y + '&result_type=street_address&key=AIzaSyC5UpKvj2g1q2d00TOyYP8j9X5LXn0p1kw');
        //},
        profileeditservice : function (x) { //Edit The User Profile
            return $http.get(service_url +'/PatientDetails.svc/profileupdate?r='+x);
        },
        likeservice: function (a,b,c,d,e) {
            return $http.get(service_url +'/AppointmentDetails.svc/savelike?doctorname='+a+'&appointmentid='+b+'&like='+c +'&dislike='+d+'&description='+e);

        },
        checkdtservice : function(a,b) {
            return $http.get(service_url +'/PatientDetails.svc/checkdatetime?selecteddate='+a+'&selectedtime='+b);
        },
        changepatientpassword : function(a,b,c) {

            return $http.get(service_url +'/PatientDetails.svc/ChangePassword?patientId='+a+'&oldpwd='+b+'&newpwd='+c);
        }

    }
});
appserve.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

    return {
        isOnline: function(){

            if(ionic.Platform.isWebView()){
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }

        },
        isOffline: function(){

            if(ionic.Platform.isWebView()){
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }

        }
    }
})
appserve.factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading,
                                $rootScope, $cordovaNetwork,ConnectivityMonitor){

    var markerCache = [];
    var apiKey = false;
    var map = null;

    function initMap(){

        var options = {timeout: 10000, enableHighAccuracy: true};
        var lat = '17.41789';
        var long = '78.33992';
        enableMap();
        $cordovaGeolocation.getCurrentPosition(options)
            .then(function(position){

                var latLng = new google.maps.LatLng(lat,long);

                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map(document.getElementById("map"),
                    mapOptions);

                //Wait until the map is loaded
                google.maps.event.addListenerOnce(map, 'idle', function(){
                    enableMap();
                });

            }, function(error){
                console.log("Could not get location");
            });

    }

    function enableMap(){
        $ionicLoading.hide();
    }

    function disableMap(){
        $ionicLoading.show({
            template: 'You must be connected to the Internet to view this map.'
        },3000);
    }

    function loadGoogleMaps(){

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/> Acquiring Location'
        });

        window.mapInit = function(){
            initMap();
        };

        //Create a script element to insert into the page
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "googleMaps";

        //Note the callback function in the URL is the one we created above
        if(apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey
                + '&sensor=true&callback=mapInit';
        }
        else {
            script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
        }

        document.body.appendChild(script);

    }

    function checkLoaded(){
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
            loadGoogleMaps();
        } else {
            enableMap();
        }
    }


    function addConnectivityListeners(){

        if(ionic.Platform.isWebView()){

            $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                checkLoaded();
            });

            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                disableMap();
            });

        }
        else {

            //Same as above but for when we are not running on a device
            window.addEventListener("online", function(e) {
                checkLoaded();
            }, false);

            window.addEventListener("offline", function(e) {
                disableMap();
            }, false);
        }

    }

    return {
        init: function(key){
            if(typeof key != "undefined"){
                apiKey = key;
            }

            if(typeof google == "undefined" || typeof google.maps == "undefined"){

                console.warn("Google Maps SDK needs to be loaded");

                disableMap();

                if(ConnectivityMonitor.isOnline()){
                    loadGoogleMaps();
                }
            }
            else {
                if(ConnectivityMonitor.isOnline()){
                    initMap();
                    enableMap();
                } else {
                    disableMap();
                }
            }

            addConnectivityListeners();

        }
    }

});
appserve.factory('onlineStatus', ["$window", "$rootScope", function ($window, $rootScope) {
    var onlineStatus = {};

    onlineStatus.onLine = $window.navigator.onLine;

    onlineStatus.isOnline = function() {
        return onlineStatus.onLine;
    }

    $window.addEventListener("online", function () {
        onlineStatus.onLine = true;
        $rootScope.$digest();
    }, true);

    $window.addEventListener("offline", function () {
        onlineStatus.onLine = false;
        $rootScope.$digest();
    }, true);

    return onlineStatus;
}]);

appserve.factory('appointmentService', function ($http) {

    var service_url = 'http://54.169.42.241/ContinentalService';

    return {

        getDoctorSlotByDate: function (x) {
            return $http.get(service_url + '/DoctorDetails.svc/DoctorSlotsByDate?SearchText=' + x);
        },
        getDoctorDetailsList : function(y) {
            return $http.get(service_url + '/DoctorDetails.svc/getDoctorDetailsList');
        }
    }


});


//--------------------------------------------------------------------------------------------------------------------
appserve.service('searchresultstore', function () {
    //var results = [];
    var results = null;

    var addList = function (newObj) {
        //results.push(newObj);
        results = newObj;
    };

    var getList = function () {
        return results;
    };

    return {
        addList: addList,
        getList: getList
    };

});

appserve.service('doctordetailstore', function () {
    var doc_details_results = null;

    var addList = function (newObj) {
        //results.push(newObj);
        doc_details_results = newObj;
    };

    var getList = function () {
        return doc_details_results;
    };

    return {
        addList: addList,
        getList: getList
    };
});

appserve.service('doctorslotstore', function () {
    //var results = [];
    var results = null;

    var addList = function (newObj) {
        //results.push(newObj);
        results = newObj;
    };

    var getList = function () {
        return results;
    };

    return {
        addList: addList,
        getList: getList
    };

});

appserve.service('slotsliststore', function () {
    //var results = [];
    var results = null;

    var addList = function (newObj) {
        //results.push(newObj);
        results = newObj;
    };

    var getList = function () {
        return results;
    };

    return {
        addList: addList,
        getList: getList
    };

});

appserve.service('profiledetailstore', function () {

    var results = null;

    var addList = function (newObj) {
        results = newObj;

        localStorage.setItem('pid', results.patientId);
        localStorage.setItem('pname', results.name);

        localStorage.fname = results.firstName;
        localStorage.lname = results.lastName;
        localStorage.email = results.email;
        localStorage.mobile = results.mobile;
        localStorage.dob = results.dob;
        localStorage.countryName = results.countryName;
        localStorage.stateName = results.stateName;
        localStorage.cityName = results.cityName;
    };

    var getList = function () {
        return results;
    };
var deleteList = function(){
        results = '';
}
    return {
        addList: addList,
        getList: getList,
        deleteList : deleteList
    };

});

appserve.service('myappointstore', function () {
    //var results = [];
    var results = null;

    var addList = function (newObj) {
        results = newObj;
    };

    var getList = function () {
        return results;
    };

    return {
        addList: addList,
        getList: getList
    };

});

appserve.service('appdocliststore', function () {
    //var results = [];
    var results = null;

    var addList = function (newObj) {
        //results.push(newObj);
        results = newObj;
        //localStorage.name = results.name;
        //localStorage.description = results.description;
        //localStorage.documentType = results.documentType;


    };

    var getList = function () {
        return results;
    };

    return {
        addList: addList,
        getList: getList
    };

});

appserve.service('fileUpload', ['$http', function ($http) {
    var uploadUrl = "http://54.169.42.241/api/Patient/SaveCamImage";
    this.uploadFileToUrl = function (file) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function () {
            })
            .error(function () {
            });
    }
}]);
appserve.service('RequestsServicess', ['$http', '$q', '$ionicLoading',function (){

    function register(device_token){
        console.log("device_token :"+device_token);
    };
    return {
        register: register
    };

}]);


//----------------------------------------------------------------------------------------------------------------------------

function store_fun() {

    var results = null;

    var addList = function (newObj) {
        results = newObj;
    };

    var getList = function () {
        return results;
    };

    return {
        addList: addList,
        getList: getList
    };
}

function RequestsService(){
    function register(device_token){
        localStorage.deviceid = device_token;
    };
    return {
        register: register
    };
}





/*

 function check_pid() {
 var x;
 if (localStorage.pid) {
 x = true;
 } else {
 x = false;
 }
 return x;
 }*/
