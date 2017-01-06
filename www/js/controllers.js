var appctrl = angular.module('starter.controllers', ['ionic', 'starter.services', 'ngCordova', 'starter.filters']);


appctrl.constant('$ionicLoadingConfig', {
    template: '<ion-spinner></ion-spinner>',
    hideOnStateChange: true
});

//----------------------------------AppCtrl-----------------------------------------
appctrl.controller('AppCtrl', function ($scope,$cordovaDevice, $ionicHistory,$location ,$cordovaCamera,$state, $cordovaToast, $ionicPopover, $cordovaGeolocation, profiledetailstore, $ionicPopup, $ionicModal, $ionicBackdrop, $ionicLoading, $timeout, $http, searchService,$cordovaSocialSharing) {

    $scope.loginData = {};
    $scope.popoverState = false;
    $scope.platform = ionic.Platform;
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-down'
    }).then(function (modal) {
        $scope.loginmodal = modal;
    });
    $scope.closeLogin = function () {
        $scope.loginmodal.hide();
        $ionicLoading.hide();
        $ionicBackdrop.release();
    };
    $scope.openLogin = function () {
        $scope.popover.hide();
        $scope.loginmodal.show();
    };

    $scope.doLogin = function () {
        if (localStorage.network_state == "online") {
            if ($scope.loginData.username == null || $scope.loginData.username == '' || $scope.loginData.password == null || $scope.loginData.password == '') {
                $ionicPopup.alert({
                    title: 'Enter Credentials!',
                    template: 'Please enter a valid Email and Password to login!'
                });
            } else {
                $scope.login_process();
            }
        } else {
            $ionicPopup.alert({
                title: 'No internet!',
                template: 'Please connect to wifi or mobile data to proceed!'
            }).then(function (res) {
                $cordovaToast.showLongCenter('No internet!');
            });
        }
    };

    $scope.login_process = function () {
        $ionicBackdrop.retain();
        $ionicLoading.show({
            template: 'Loading...'
        });
        var x = $scope.loginData;
        searchService.patientlogin(x).success(function (data) {
            var y = data.d;
            if (y == '' || y == null) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Warning',
                    template: 'Incorrect Email or Password !'
                });
            } else {
                profiledetailstore.addList(y);
                localStorage.setItem('pid', y.patientId);
                localStorage.setItem('pname', y.name);
                localStorage.setItem('patemail', y.email);
                $scope.popoverState = true;
                $scope.user_dp = "http://54.169.42.241/PatientWebApi/api/Patient/GetProfileImage?id="+localStorage.pid;
                $state.go($state.current, {}, {reload: true});
            }
        });
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
$scope.doproRefresh  = function(){
    $scope.user_dp = "http://54.169.42.241/PatientWebApi/api/Patient/GetProfileImage?id="+localStorage.pid;
    $scope.$broadcast('scroll.refreshComplete');
}
    $scope.dodpRefresh  = function(){
        $scope.user_dp = "http://54.169.42.241/PatientWebApi/api/Patient/GetProfileImage?id="+localStorage.pid;
    }
    $scope.popoverState;
    if (localStorage.pid) {
        $scope.popoverState = true;
    } else {
        $scope.popoverState = false;
    }
    $ionicPopover.fromTemplateUrl('templates/options.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    $scope.profileDetails = localStorage;
    $scope.logout_patient = function () {
        $scope.popover.hide();
        $ionicPopup.confirm({
            title: 'Confirm Logout?',
            template: 'Are you sure you want to logout?'
        }).then(function (res) {
            if (res) {
                $scope.clearPatientDetails();
                $scope.popoverState = false;
                $scope.profileDetails = {};
                $location.path('app/home');
                window.location.reload(true);
                $cordovaToast.show('Logged out successfully!', 'long', 'center');
            }
        });
    };
    $scope.clearPatientDetails = function () {
        localStorage.removeItem('pid');
        localStorage.removeItem('pname');
        localStorage.removeItem('fname');
        localStorage.removeItem('lname');
        localStorage.removeItem('email');
        localStorage.removeItem('mobile');
        localStorage.removeItem('dob');
    };
    $scope.regData = {firstName: null, lastName: null, password: null, mobile: null, email: null};

    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.regmodal = modal;
    });
    $scope.openreg = function () {
        $scope.closeLogin();
        $scope.regmodal.show();
    };
    $scope.closeReg = function () {
        $scope.regmodal.hide();
        $scope.openLogin();
    };

    $scope.VerifyData = {};
    $scope.registerData = {firstName:null, mobile: null, email: null, password: null};
    $scope.updateData = {mobile: null, email: null, password: null};
    $ionicModal.fromTemplateUrl('templates/verifyOTP.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.Verifymodal = modal;
    });
    $scope.openOTP = function () {
        $scope.Verifymodal.show();
    }
    $scope.closeOTP = function () {
        $scope.Verifymodal.hide();
    }

    $scope.doRegistration = function () {
        if(localStorage.network_state == "online") {
            $ionicBackdrop.retain();
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            var i = JSON.stringify($scope.registerData);
            searchService.patregistration(i).success(function (data) {
                var success = data.d;
                localStorage.temp_patientId = success;
                $ionicLoading.hide();
                $ionicBackdrop.release();
                if (success > 0) {
                    $ionicPopup.alert({
                        title: 'Registration Successful!',
                        template: 'We have Sent an OTP To Confirm Your Identity'
                    }).then(function (res) {
                        $ionicLoading.hide();
                        $ionicBackdrop.release();
                        $scope.closeReg();
                        $scope.closeLogin();
                        $scope.openOTP();
                    });
                }
                else if (success == 0) {
                    $ionicPopup.alert({
                        title: 'info',
                        template: 'Account already exists,Try logging in.In case,if you forgot the password goto forgot password and try again'
                    })
                }
                else {
                    $ionicPopup.alert({
                        title: 'Registration Failed !',
                        template: 'Something went wrong while registering your account,Check your internet connection and try again!'
                    })
                }
                $scope.closeReg();
            });
        }
        else
        {
            $ionicBackdrop.release();
            $ionicLoading.hide();
            $cordovaToast.showLongCenter("No internet !");
        }
    };


    $scope.doVerify = function () {

        $scope.patientId = localStorage.temp_patientId;
        var myOTP = $scope.VerifyData;
        var patid = $scope.patientId;
        var checkotp = myOTP.getOTP;

        var Verifydataa = {patientId: patid, "OTP": checkotp};

        searchService.verifyOTP(Verifydataa).success(function (data) {
            $ionicPopup.alert({
                title: 'Success !',
                template: 'Account Verified Successfully'
            }).then(function (res) {

                searchService.getUserProfile(Verifydataa).success(function (data) {
                    var y = data.d;
                    profiledetailstore.addList(y);
                    localStorage.setItem('pid', y.patientId);
                    localStorage.setItem('pname', y.name);
                    $scope.popoverState = true;
                    $scope.closeOTP();
                    $location.path('app/profile');
                });
            });
        });
    };

    $scope.doResend = function () {
        $scope.patientId = localStorage.temp_patientId
        var p = $scope.patientId;
        searchService.resendOTP(p).success(function (data) {
            var result = data.d;
            if (result == true) {
                $ionicPopup.alert({
                    title: 'OTP Sent !',
                    template: 'Check Your Mobile SMS To Get the OTP'
                });
            }
            else {
                $ionicPopup.alert({
                    title: 'Error !',
                    template: 'Something went wrong while Re-sending the OTP'
                });
            }
        });
    };
    $ionicModal.fromTemplateUrl('templates/forgotpassword.html', {
        scope: $scope
    }).then(function (fpwdmodal) {
        $scope.fpwdmodal = fpwdmodal;
    });
    $scope.openforgotpassword = function()
    {
        $scope.fpwdmodal.show();
    }
    $scope.closeforgotpassword = function()
    {
        $scope.fpwdmodal.hide();
    }
    $scope.getpassword = {};

    $scope.doSendPassword = function() {

    var emailid = $scope.getpassword.email;
    var mobilenum = $scope.getpassword.mobile;
    if(emailid==undefined)
    {
       emailid="";
    }
        if(mobilenum == undefined)
        {
            mobilenum="";
        }
        if(emailid !="" && mobilenum !="")
        {
            $ionicPopup.alert({
                title: 'Info',
                template: 'Enter Your Registered Mobile Number (Or) Email To Get Your Account Information'
            })
            return false;
        }
        else {
            if(mobilenum !="")
            {
                $ionicLoading.show({
                    template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 300,
                    showDelay: 2000
                });
                searchService.getPassword(emailid, mobilenum).success(function (data) {

                    var result = data.d;
                    $ionicLoading.hide();
                    if (data.d == true) {
                        $ionicPopup.alert({
                            title: 'Success',
                            template: 'Password has been sent to your Mobile,Dont share it with anyone'
                        }).then(function () {
                            $scope.fpwdmodal.hide();
                            $scope.loginmodal.show();
                        });
                    }
                    else {
                        $ionicBackdrop.release();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Account does not Exist,Try Entering Your Valid Registered Email (Or) Mobile To Continue'
                        });
                    }
                });
            }
             else
            {
                $ionicLoading.show({
                    template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 300,
                    showDelay: 2000
                });
                searchService.getPassword(emailid, mobilenum).success(function (data) {

                    var result = data.d;
                    $ionicLoading.hide();
                    if (data.d == true) {
                        $ionicPopup.alert({
                            title: 'Success',
                            template: 'Password has been sent to your Email,Dont share it with anyone'
                        }).then(function () {
                            $scope.fpwdmodal.hide();
                            $scope.loginmodal.show();

                        });

                    }
                    else {
                        $ionicBackdrop.release();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Account does not Exist,Try Entering Your Valid Registered Email (Or) Mobile To Continue'
                        });
                    }
                });
            }
        }
   }
    $scope.socialShare = function(){
        $scope.popover.hide();
    $cordovaSocialSharing
        .share('Continental Hospitals', 'Share', null, 'https://play.google.com/store/apps/details?id=com.wib.continentalhospitals'); // Share via native share sheet

    }
});


appctrl.controller('homeCtrl', function ($scope,$ionicScrollDelegate,$ionicLoading,doctordetailstore,$cordovaAppAvailability,$location,$ionicModal,searchService,$cordovaToast,$rootScope,$window) {
    $scope.groups = [];
    $scope.searchData = {
        name: '',
        location: '',
        speciality: ''
    };
    $scope.onsearchhomeDoc = function () {

        if (localStorage.network_state == "online") {
            var a = $scope.searchData.name;
            $searchParam = a;

            var i = JSON.stringify($scope.searchData);
            var x = searchService.getnames(i).success(function (data) {
                $scope.doctors = data.d;
            });
        } else {
            $cordovaToast.showLongCenter('No internet!');
        }
    };

    $scope.searchdepartment = function(){
        $location.path("app/search");
    }
    $ionicModal.fromTemplateUrl('templates/searchdoctorpage.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.searchhomemodal = modal;
    });

    $scope.$on('searchresultmodal.hidden', function () {
        $scope.searchbuttonbool = true;
    });
    $scope.closehomeSearch = function () {
        $scope.searchhomemodal.hide();
    };
    $scope.openhomeSearch = function () {
        $scope.searchhomemodal.show();
    };

    $scope.onsearchkeys = function () {
       if(localStorage.network_state == "online") {
           var a = $scope.searchData.name;
           $searchParam = a;
           var i = JSON.stringify($scope.searchData);

           var x = searchService.getnames(i).success(function (data) {

               var x = data.d;

               if (x == null || x == '') {
                   $scope.nodoctors = true;
                   $scope.namess = '';
               } else {
                   $scope.namess = data.d;
                   $scope.nodoctors = false;
                   $ionicLoading.hide();
               }

           });
           if ($scope.searchbuttonbool) {
               $scope.searchbuttonbool = false;
           } else {
               $scope.searchbuttonbool = true;
           }

           if ($scope.bool) {
               $scope.bool = false;
           } else {
               $scope.bool = true;
           }

           if ($scope.bool_search) {
               $scope.bool_search = false;
           } else {
               $scope.bool_search = true;
           }
       }
        else {
           $cordovaToast.showLongCenter("No internet !");
       }
    };

    $scope.todetailhomepages = function (i,s) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 300,
            showDelay: 2000
        });
        var x = searchService.getdetails(i,s).success(function (data) {
            $scope.resultList = data.d;
            $ionicLoading.hide();
            doctordetailstore.addList($scope.resultList);
            $scope.searchhomemodal.hide();
            $location.path('app/doctordetailspage');
        });
    };
});

appctrl.controller('searchDoctorCtrl', function ($scope) {
    $scope.groups = [];

});

//-------------------------------------ProfileCtrl--------------------------------------
appctrl.controller('ProfileCtrl', function ($scope, $cordovaActionSheet, $ionicActionSheet, fileUpload, $cordovaToast, $window, profiledetailstore, $location, $ionicModal, $ionicPopup, $ionicBackdrop, $ionicLoading, $timeout, $http, searchService,$filter) {
    $scope.doproRefresh();


    $scope.profilePic = function () {

        var options = {
            title: 'Select Profile picture',
            buttonLabels: ['From Camera', 'From Library'],
            addCancelButtonWithLabel: 'Cancel',
            androidEnableCancelButton: true
        };

        $cordovaActionSheet.show(options)
            .then(function (btnIndex) {
                var index = btnIndex;
                if (index == 1) {
                    $scope.profilecamerafileupload();
                } else if (index == 2) {
                    $scope.libraryprofileupload();
                } else {

                }
            });
    };

    $scope.profilecamerafileupload = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType:1,
            allowEdit:true,
            encodingType: 0
        }
        navigator.camera.getPicture(onProfileSuccess, onProfileFail, options);
    }
    var onProfileSuccess = function(FILE_URI) {
            $scope.uploadProfilePic(FILE_URI);
    };
   var onProfileFail = function(){
       $ionicPopup.alert({
           title: 'Failed',
           template: 'Failed To Take Picture !'
       });

   };
    $scope.uploadProfilePic = function(FILE_URI) {
        $ionicBackdrop.retain();
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        var uid = localStorage.pid;
        var url = "http://54.169.42.241/PatientWebApi/api/Patient/SaveProfImage?id="+uid;
        var myImg = FILE_URI;
        var options = new FileUploadOptions();
        options.fileKey="CamFile";
        options.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(myImg,url, onProfileUploadSuccess, onProfileUploadFail, options);
    }

    function onProfileUploadSuccess()
    {
        $ionicBackdrop.release();
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: 'Success',
            template: 'Profile Picture Uploaded successfully.'
        }).then(function () {
            $scope.dodpRefresh();
        });


    }
    function onProfileUploadFail()
    {
        $ionicBackdrop.release();
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: 'Error',
            template: 'Failed To Set Profile Picture'
        })

    }

    $scope.libraryprofileupload = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType:0,
            allowEdit:true,
            encodingType: 0
        }
        navigator.camera.getPicture(onProfileSuccess, onProfileFail, options);
    }


    $scope.check_pid = function () {
        var x;
        if (localStorage.pid) {
            x = true;
        } else {
            x = false;
        }
        return x;
    };

    $scope.check_fbid = function () {
        var x;
        if (localStorage.fbid) {
            x = true;
        } else {
            x = false;
        }
        return x;
    };
    $scope.datepickerObjectdob = {
        titleLabel: 'Select Date of Birth',
        todayLabel: 'Today',
        closeLabel: 'Close',
        setLabel: 'Ok',
        setButtonType : 'button-assertive',
        todayButtonType : 'button-assertive',
        closeButtonType : 'button-assertive',
        inputDate: new Date(),
        mondayFirst: true,
        templateType: 'popup',
        showTodayButton: 'true',
        modalHeaderColor: 'bar-positive',
        modalFooterColor: 'bar-positive',
        from: new Date(1920, 1, 01),
        to: new Date(),
        callback: function (val) {
            var getdate = GetFormattedDob(val);
            $scope.profileDetails.dob = getdate;
        },
        dateFormat: 'dd-MM-yyyy', //Optional
        closeOnSelect: false, //Optional
    };
    function GetFormattedDob(val) {
        if(typeof(val)==='undefined')
        {
            $scope.profileDetails.dob = '';
        }
        else {
            var todayTime = new Date(val);
            var month = todayTime.getMonth() + 1;
            var day = todayTime.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            if (month < 10) {
                month = '0' + month;
            }
            var year = todayTime.getFullYear();
            return day + "/" + month + "/" + year;
        }
    }


    $scope.$watch('profileDetails.dob', function (newValue) {
        $scope.profileDetails.dob = $filter('date')(newValue, 'dd/MM/yyyy');
    });

    $scope.Profile_edit = function(){
        $ionicBackdrop.retain();
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        var dob = $scope.profileDetails.dob;
        var resultdate = dob;
        var mydob ;
        if(dob==undefined)
        {
            mydob="";
        }
        else
        {
            mydob = resultdate;
        }
        var details = {
            'firstName':$scope.profileDetails.fname,
            'lastName':$scope.profileDetails.lname,
            'dob':mydob,
            'countryName':$scope.profileDetails.countryName,
            'stateName':$scope.profileDetails.stateName,
            'cityName':$scope.profileDetails.cityName,
            'userId':localStorage.pid
        };
        var update = JSON.stringify(details);
        searchService.profileeditservice(update).success(function (data) {
            $ionicBackdrop.release();
            $ionicLoading.hide();
            if (data.d == true) {
                $scope.doproRefresh();
                $ionicPopup.alert({
                    title: 'Success',
                    template: 'Updated Successfully'
                });
            }
            else {
                $ionicBackdrop.release();
                $scope.doproRefresh();
                $ionicPopup.alert({
                    title: 'Error !',
                    template: 'Something went wrong while updating the profile'
                });
            }
        });
    };
    function convertdobdate(val){
        var todayTime = new Date(val);
        var month = todayTime .getMonth() + 1;
        var day = todayTime .getDate();
        if(day <10)
        {
            day = '0'+day;
        }
        if(month <10)
        {
            month = '0'+month;
        }
        var year = todayTime .getFullYear();
        return day + "/" + month + "/" + year;
    }
    $ionicModal.fromTemplateUrl('templates/changepassword.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.pwdmodal = modal;
    });
    $scope.openpwd = function () {
        $scope.pwdmodal.show();
    };

    $scope.closepwd = function () {
        $scope.$on('$destroy', function() {
            $scope.pwdData = {};
            $scope.pwdmodal.remove();
        });
        $scope.pwdmodal.hide();
    };

    $scope.changepwd = function(){
    $scope.openpwd();
    };
    $scope.pwdData = {"oldpwd":null,"newpwd":null,patientId:localStorage.pid };

    $scope.doChangepwd = function(){
        var a = localStorage.pid;
        var b=  $scope.pwdData.oldpwd;
        var c=  $scope.pwdData.newpwd;
        searchService.changepatientpassword(a,b,c).success(function(data) {
            var resultdata = data.d;
            if(resultdata > 0)
            {
                $ionicPopup.alert({
                    title: 'Success',
                    template: 'Password Changed Successfully !'
                });
            }
            else
            {
                $ionicPopup.alert({
                    title: 'Info',
                    template: "<p style='text-align:center'>Current password is incorrect !<br/> Try again</p>"
                });
            }
        }).then(function(result) {

            $scope.logout_patient();
        });
    };

    $ionicModal.fromTemplateUrl('templates/dpmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.dp_modal = modal;
    });
    $scope.dp_openModal = function () {
        if ($scope.user_dp == '' || $scope.user_dp == null || $scope.user_dp == undefined) {

        } else {
            $scope.dp_modal.show();
        }
    };
    $scope.dp_closeModal = function () {
        $scope.dp_modal.hide();
        $ionicBackdrop.release();
    };


});


//--------------------------------------SearchCtrl-------------------------------------
appctrl.controller('SearchCtrl', function ($scope, $cordovaToast, $ionicModal, $http, searchService, $location, searchresultstore, $ionicLoading,doctordetailstore,$timeout) {

    $scope.$on('searchmodal.hidden', function () {
        $scope.searchbuttonbool = true;
    });
    $scope.searchData = {

        name: '',
        location: '',
        speciality: ''

    };
    $scope.user = {
        address: ''
    };

    $scope.names = {};
    $scope.bool = true;
    $scope.bool_search = false;
    $scope.searchbuttonbool;


    $scope.hideshow = function () {
        if ($scope.bool) {
            $scope.bool = false;
            $scope.bool_search = true;
        } else {
            $scope.bool = true;
            $scope.bool_search = false;
        }

        if ($scope.searchbuttonbool) {
            $scope.searchbuttonbool = false;
        } else {
            $scope.searchbuttonbool = true;
        }
    };
    $ionicModal.fromTemplateUrl('templates/searchpage.html', {
        scope: $scope,
        animation: 'fadeIn'
    }).then(function (modal) {
        $scope.searchmodal = modal;
    });

    $scope.$on('searchresultmodal.hidden', function () {
        $scope.searchbuttonbool = true;
    });
    $scope.closeSearch = function () {
        $scope.names = {};
        $scope.searchmodal.hide();
    };
    $scope.openSearch = function () {
        $scope.searchmodal.show();
    };
    $scope.onsearchkeys = function () {

        if (localStorage.network_state == "online") {

            var m = {"speciality":$scope.searchData.speciality};
            localStorage.getspeciality = $scope.searchData.speciality;
            var n= JSON.stringify(m);
            var x = searchService.getnames(n).success(function (data) {
                var x = data.d;

                if (x == null || x == '') {
                    $scope.nolists = true;
                } else {
                    $scope.nolists = false;
                    $scope.names = data.d;
                }
            });
            if ($scope.searchbuttonbool) {
                $scope.searchbuttonbool = false;
            } else {
                $scope.searchbuttonbool = true;
            }
            if ($scope.bool) {
                $scope.bool = false;
            } else {
                $scope.bool = true;
            }
            if ($scope.bool_search) {
                $scope.bool_search = false;
            } else {
                $scope.bool_search = true;
            }
        } else {
            $cordovaToast.showLongCenter('No internet!');

        }
    };

    $scope.onsearchDoc = function () {

        if (localStorage.network_state == "online") {
            var a = $scope.searchData.name;
            $searchParam = a;

            var i = JSON.stringify($scope.searchData);
            var x = searchService.getnames(i).success(function (data) {
                $scope.doctors = data.d;
            });
        } else {
            $cordovaToast.showLongCenter('No internet!');
        }
    };

    $scope.onspecialitysearchkeys = function () {

        if (localStorage.network_state == "online") {
            var a = $scope.searchData.speciality;
            var x = searchService.getspecialist(a).success(function (data) {
                $scope.specialtities = data.d;
            });
        } else {
            $cordovaToast.showLongCenter('No internet!');
        }
    };

    $scope.onListSelect = function (z) {
        var j = z;
        $scope.searchData.name = j;
        var i = JSON.stringify($scope.searchData);

        var x = searchService.getlist(i).success(function (data) {
            $scope.resultList = data.d;
            searchresultstore.addList($scope.resultList);
            $scope.closeSearch();
            $location.path('app/searchResults');

        });

        $scope.searchData = {

            name: null,
            location: null,
            speciality: null

        };


    };


    $scope.currentDate = new Date();
    $scope.minDate = new Date(2105, 6, 1);
    $scope.maxDate = new Date(2015, 12, 31);

    $scope.datePickerCallback = function (val) {
        if (!val) {
        } else {
        }
    };

    $scope.todetailpages = function (i,s) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 300,
            showDelay: 2000
        });
        var x = searchService.getdetails(i,s).success(function (data) {
            $scope.resultList = data.d;
            doctordetailstore.addList($scope.resultList);
            $scope.searchmodal.hide();
            $location.path('app/detailspage');
        });
    };
});


//-------------------------------------searchresultsCtrl--------------------------------------
appctrl.controller('searchresultsCtrl', function ($scope, $ionicModal, $ionicBackdrop, $ionicLoading, $timeout, $http, $location, doctordetailstore, searchresultstore, searchService) {
    $ionicLoading.show();
    $scope.resultstoreList = searchresultstore.getList();
     var imgid=JSON.stringify($scope.resultstoreList);
    $scope.searchdoctorDp = "http://182.73.141.106/Mobile/PatientWebApi/api/Doctor/GetDoctorProfileImage?id="+searchresultstore.getList().doctorId;
    $ionicLoading.hide();

    $scope.tomainpage = function () {
        $location.path('app/search');

    };
    $scope.todetailpage = function (i,s) {

        var x = searchService.getdetails(i,s).success(function (data) {
            $scope.resultList = data.d;
            doctordetailstore.addList($scope.resultList);
            $location.path('app/detailspage');

        });
    };
});

//---------------------------------------detailspageCtrl------------------------------------
appctrl.controller('detailspageCtrl', function ($scope,$ionicHistory, $cordovaToast,$window,$state, profiledetailstore, $filter, $ionicModal, $ionicBackdrop, $ionicLoading, $ionicPopup, $timeout, $http, $location, searchresultstore, doctordetailstore, searchService) {

    $ionicModal.fromTemplateUrl('templates/searchpage.html', {
        scope: $scope,
        animation: 'fadeIn'
    }).then(function (modal) {
        $scope.searchmodal = modal;
    });
    $scope.closeSearch = function () {
        $scope.names = {};
        $scope.searchmodal.hide();
        $location.path("app/search");
    };
    $scope.myGoBack = function() {
        $scope.doctorProfileDtl= null;
        doctordetailstore.getList().name ='';
        $scope.onsearchkeys(localStorage.getspeciality);
        $scope.searchmodal.show();

    };

    $scope.onsearchkeys = function (e) {
        if (localStorage.network_state == "online") {
            var a  = {"speciality" :localStorage.getspeciality};
            var i = JSON.stringify(a);
            var x = searchService.getnames(i).success(function(data) {
                var x = data.d;
                if (x == null || x == '') {
                } else {
                    $scope.searchData.speciality = e;
                    $scope.names = data.d;
                }
            });
            if ($scope.searchbuttonbool) {
                $scope.searchbuttonbool = false;
            } else {
                $scope.searchbuttonbool = true;
            }
            if ($scope.bool) {
                $scope.bool = false;
            } else {
                $scope.bool = true;
            }
            if ($scope.bool_search) {
                $scope.bool_search = false;
            } else {
                $scope.bool_search = true;
            }
        } else {
            $cordovaToast.showLongCenter('No internet!');
        }
    };

    $scope.searchData = {
        name: null,
        location: null,
        speciality: null

    };
    $scope.todetailpages = function (i,s) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 300,
            showDelay: 2000
        });
        var x = searchService.getdetails(i,s).success(function (data) {
            $scope.resultList = data.d;
            doctordetailstore.addList($scope.resultList);
            $scope.searchmodal.hide();
            $state.go($state.current, {}, {reload: true});
            $location.path("app/detailspage");
        });
    };
    $scope.doctorProfileDtl=doctordetailstore.getList();

    $ionicLoading.hide();

    $scope.clinicLatlng='17.41789,78.33992';
    $scope.doctorDp = "http://54.169.42.241/PatientWebApi/api/Patient/GetDoctorProfileImage?id=" + doctordetailstore.getList().doctorId;
    $scope.doctorThumbDp="http://54.169.42.241/PatientWebApi/api/Doctor/doctorThumbImage?did="+ doctordetailstore.getList().doctorId;
    $scope.dodRefresh = function() {
        $scope.doctorDp = "http://54.169.42.241/PatientWebApi/api/Patient/GetDoctorProfileImage?id=" + doctordetailstore.getList().doctorId;
        $scope.doctorThumbDp="http://54.169.42.241/PatientWebApi/api/Doctor/doctorThumbImage?did="+ doctordetailstore.getList().doctorId;
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.back_button = function () {
        $location.path('app/searchResults');
    };

    $scope.appointmentFixing = function (i) {
        $location.path('app/appointmentFixing');

    };
    $scope.MapLocation = function () {
        $location.path('app/map');
    };

});

appctrl.controller('doctordetailspageCtrl', function ($scope,$ionicHistory, $cordovaToast,$window,$state, profiledetailstore, $filter, $ionicModal, $ionicBackdrop, $ionicLoading, $ionicPopup, $timeout, $http, $location, searchresultstore, doctordetailstore, searchService) {

    $scope.searchDoctor = {
        name: '',
        location: '',
        speciality: ''

    };
    $ionicModal.fromTemplateUrl('templates/searchdoctorpage1.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.searchdoctormodal = modal;
    });
    $scope.closehomeSearch = function () {
        $scope.searchdoctormodal.hide();
        $location.path("app/doctorsearch");

    };
    $scope.openhomeSearch = function () {
        $scope.searchhomemodal.show();
    };
    $scope.mydoctorGoBack = function() {
        $scope.doctorProfileDtl= null;
        $scope.searchdoctormodal.show();
    };

    $scope.ondocsearchpop = function () {

        if (localStorage.network_state == "online") {
            var a = $scope.searchDoctor.name;
            $searchParam = a;

            var i = JSON.stringify($scope.searchDoctor);

            var x = searchService.getnames(i).success(function (data) {
                $scope.doctorsdetail = data.d;
                $ionicLoading.hide();
            });
        } else {
            $ionicLoading.hide();
            $cordovaToast.showLongCenter('No internet!');
        }
    };
    $scope.ondocsearchpopkeys = function (e) {
        if (localStorage.network_state == "online") {
            var a = $scope.searchDoctor;
            var i = JSON.stringify(a);
            var x = searchService.getnames(i).success(function(data) {
                var x = data.d;
                if (x == null || x == '') {
                    $scope.nodoctors = true;
                    $scope.docnames = '';
                } else {
                    $scope.nodoctors = false;
                    $scope.searchDoctor.speciality = e;
                    $scope.docnames = data.d;
                }
            });
            if ($scope.searchbuttonbool) {
                $scope.searchbuttonbool = false;
            } else {
                $scope.searchbuttonbool = true;
            }
            if ($scope.bool) {
                $scope.bool = false;
            } else {
                $scope.bool = true;
            }
            if ($scope.bool_search) {
                $scope.bool_search = false;
            } else {
                $scope.bool_search = true;
            }
        } else {
            $cordovaToast.showLongCenter('No internet!');
        }
    };

    $scope.searchData = {
        name: null,
        location: null,
        speciality: null

    };
    $scope.todetailDocpages = function (i,s) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 300,
            showDelay: 2000
        });
        var x = searchService.getdetails(i,s).success(function (data) {
            $scope.resultList = data.d;
            $ionicLoading.hide();
            doctordetailstore.addList($scope.resultList);
            $scope.searchdoctormodal.hide();
            $state.go($state.current, {}, {reload: true});
            $location.path('app/doctordetailspage');
        });
    };
    $scope.todetailpages = function (i,s) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner><p>Loading...</p>',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 300,
            showDelay: 2000
        });
        var x = searchService.getdetails(i,s).success(function (data) {
            $scope.resultList = data.d;
            doctordetailstore.addList($scope.resultList);
            $scope.searchmodal.hide();
            $state.go($state.current, {}, {reload: true});
            $location.path("app/detailspage");
        });
    };
    $scope.doctorProfileDtl=doctordetailstore.getList();

    $ionicLoading.hide();

    $scope.clinicLatlng='17.41789,78.33992';
    $scope.doctorDp = "http://54.169.42.241/PatientWebApi/api/Patient/GetDoctorProfileImage?id=" + doctordetailstore.getList().doctorId;
    $scope.doctorThumbDp="http://54.169.42.241/PatientWebApi/api/Doctor/doctorThumbImage?did="+ doctordetailstore.getList().doctorId;
    $scope.dodRefresh = function() {
        $scope.doctorDp = "http://54.169.42.241/PatientWebApi/api/Patient/GetDoctorProfileImage?id=" + doctordetailstore.getList().doctorId;
        $scope.doctorThumbDp="http://54.169.42.241/PatientWebApi/api/Doctor/doctorThumbImage?did="+ doctordetailstore.getList().doctorId;
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.back_button = function () {
        $location.path('app/searchResults');
    };

    $scope.appointmentFixing = function (i) {
        $location.path('app/appointmentFixing');
    };
    $scope.MapLocation = function () {
        $location.path('app/map');
    };

});



appctrl.controller('AppointmentsFixingCtrl', function ($scope,$ionicPopup,$location,doctordetailstore,$cordovaToast,searchService,$timeout,$cordovaDatePicker,$ionicBackdrop,$ionicLoading,myappointstore) {

    $scope.appointmentSlots = [];
    var currentDate = new Date();
        var tddate = new Date();
        var tdhours = tddate.getHours();
        var tdminutes = tddate.getMinutes();
        var tdampm = tdhours >= 12 ? 'PM' : 'AM';
        tdhours = tdhours % 12;
        tdhours = tdhours <10 ?'0'+tdhours : tdhours; // the hour '0' should be '12'
        tdminutes = tdminutes < 10 ? '0'+tdminutes : tdminutes;
        var strTime = tdhours + ':' + tdminutes + ' ' + tdampm;
        $scope.tdTime = strTime;
    $scope.Todaydate = new Date();
    $scope.CurrentDate = DateFormat(currentDate);
    $scope.time1=function(){
        //var time="02:16 PM";
        var time=strTime;
        var hou, minute;
        if(time.split(" ")[1] == 'PM' && time.split(":")[0] != '12') {
            hou = parseInt(time.split(":")[0]) + 12+"."+parseInt(time.split(":")[1]);
        } else {
            hou = parseInt(time.split(":")[0]) +"."+parseInt(time.split(":")[1]);
        }
        var s=parseFloat(hou);
        return s;
    }
    $scope.formatAMPM=function(time){
        var hour, minute;
        if(time.split(" ")[1] == 'PM' && time.split(":")[0] != '12') {
            hour = parseInt(time.split(":")[0]) + 12+"."+parseInt(time.split(":")[1]);
        } else {
            hour = parseInt(time.split(":")[0]) +"."+parseInt(time.split(":")[1]);
        }
        var ss=parseFloat(hour);
        return ss;

    }
    $scope.nex = 5;
    $scope.previousdate = function ()
    {
        $scope.nex = 5;
        $scope.time1=function(){
            //var time="02:16 PM";
            var time=strTime;
            var hou, minute;
            if(time.split(" ")[1] == 'PM' && time.split(":")[0] != '12') {
                hou = parseInt(time.split(":")[0]) + 12+"."+parseInt(time.split(":")[1]);
            } else {
                hou = parseInt(time.split(":")[0]) +"."+parseInt(time.split(":")[1]);
            }
            var s=parseFloat(hou);
            return s;
        }
        $scope.formatAMPM=function(time){
            var hour, minute;
            if(time.split(" ")[1] == 'PM' && time.split(":")[0] != '12') {
                hour = parseInt(time.split(":")[0]) + 12+"."+parseInt(time.split(":")[1]);
            } else {
                hour = parseInt(time.split(":")[0]) +"."+parseInt(time.split(":")[1]);
            }
            var ss=parseFloat(hour);
            return ss;
        }



        var pDate = $scope.CurrentDate;
        var apptDate = $scope.CurrentDate;

        var splitDate = pDate.replace(/\,/g, '').split(' ');
        var monthIndex = (GetMonthInt(splitDate[1]) + 1);
        var previous = new Date(splitDate[3] + "/" + monthIndex + "/" + splitDate[2]);
        var todaysDate = new Date();
        if (previous.setHours(0, 0, 0, 0) > todaysDate.setHours(0, 0, 0, 0)) {
            previous.setDate(previous.getDate() - 1);
            $scope.CurrentDate = DateFormat(previous);
        }
    };






    $scope.selectedTIme = null;
    $scope.disabled = true;




    $scope.BookSlot = function (selectedTIme) {
        $scope.selectedTIme = selectedTIme;
            $scope.disabled = false;

    }

    $scope.ConfirmAppointment = function () {

        if (localStorage.network_state == "online") {

            var y=0;
            if (y == 0) {

                if (localStorage.pid) {
                    $scope.bookData = {
                        'clientId': null,
                        'userId': null,
                        'doctorId': null,
                        'patientId': null,
                        'specialistID': null,
                        'statusId' : null,
                        'isRegistered':null,
                        'stringdate': null,
                        'stringtime': null,
                        'remarks': null,
                        'notifyflag' :null,
                        'device_token':null,
                        'message':null
                    };

                    // ----------------------------------
                    $ionicPopup.confirm({
                        title: 'Confirm Appointment?',
                        template: 'Are you sure you want to book your appointment at ' + $scope.selectedTIme
                    }).then(function (res) {
                        if (res) {
                            $ionicPopup.prompt({
                                title: 'Your Ailment ?',
                                template: 'Please state your ailment in the textbox below and press ok. (Not Mandatory)',
                                inputType: 'text',
                                inputPlaceholder: 'Your Comments'
                            }).then(function (text) {

                                var pDate = $scope.CurrentDate;
                                var sdate = new Date(pDate);
                                var dd = sdate.getDate();
                                var mm = sdate.getMonth() +1;
                                var yy=sdate.getFullYear();

                                if(dd<10){
                                    dd='0'+dd
                                }
                                if(mm<10){
                                    mm='0'+mm
                                }
                                var splitDate = pDate.replace(/\,/g, '').split(' ');
                                var monthIndex = (GetMonthInt(splitDate[1]) + 1);
                                var stringCurrentDate = dd + "/" + mm + "/" + yy;
                                var doctorDetails= doctordetailstore.getList();
                                $scope.device_token = localStorage.deviceid;
                                var di = $scope.device_token;
                                var messg = 'Appointment with Dr.'+doctorDetails.name+ 'at '+$scope.selectedTIme;

                                $scope.bookData = {
                                    'clientId': doctorDetails.clientId,
                                    'userId': localStorage.pid,
                                    'doctorId': doctorDetails.doctorId,
                                    'patientId': localStorage.pid,
                                    'specialistID': doctorDetails.specialistID,
                                    'statusId' : 1,
                                    'isRegistered':1,
                                    'stringdate': stringCurrentDate,
                                    'stringtime': $scope.selectedTIme,
                                    'remarks': text,
                                    'notifyflag' :1,
                                    'device_token':$scope.device_token,
                                    'message':messg
                                };

                                var i = JSON.stringify($scope.bookData);
                                $scope.doctorName = doctorDetails.name;
                                var q = searchService.bookAppointment(i).success(function (data) {
                                    var k = data.d;
                                    if (k.appointmentId == 0)
                                    {
                                        $ionicPopup.alert({
                                            title: 'Sorry',
                                            template: 'Something went wrong while trying to book your appointment! please try again.'
                                        }).then(function () {
                                            $location.path('app/myappointments');
                                        });
                                    } else {

                                        $ionicPopup.alert({
                                            title: 'Success',
                                            template: 'Your appointment has been booked successfully. Thank you.'
                                        }).then(function () {
                                            var m = 'Your appointment was scheduled at ' + $scope.selectedTIme + '\r\n With the doctor' +$scope.doctorName;

                                            var d = localStorage.deviceid;
                                            searchService.sendappointmentnotify(m,d).success(function(mydata) {
                                            $location.path('app/myappointments');
                                            });
                                        });
                                    }
                                });
                            });
                        } else {

                        }
                    });
                } else {
                    $scope.openLogin().then($scope.BookSlot(x));
                }

            } else {
            }

        } else {
            $ionicPopup.alert({
                title: 'No internet!',
                template: 'Please check your internet connection! '
            }).then(function (res) {
                $cordovaToast.showLongCenter('No internet!');
            });
        }


    };


    $scope.back_button = function () {
        $location.path('app/searchResults');
    };


    function DateFormat(d) {
        var tomorrow = d;
        var cDate = GetDateString(tomorrow.getDay()) + ", " + GetMonthString(tomorrow.getMonth()) + " " + tomorrow.getDate() + ", " + tomorrow.getFullYear();
        return cDate
    }

    function GetMonthInt(m) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return parseInt(monthNames.indexOf(m));
    }

    function GetMonthString(m) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return monthNames[m];
    }

    function GetDateString(m) {
        var daysNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return daysNames[m];
    }

    $scope.showDatePicker = function(){
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };

        $cordovaDatePicker.show(options).then(function(date){
        });
    };



    $scope.doctorProfileDtl=doctordetailstore.getList();
    $scope.datepickerObjecttodate = {
        titleLabel: 'Select Date',
        todayLabel: 'Today',
        closeLabel: 'Close',
        setLabel: 'Ok',
        setButtonType : 'button-assertive',
        todayButtonType : 'button-assertive',
        closeButtonType : 'button-assertive',
        inputDate: new Date(),
        mondayFirst: true,
        templateType: 'popup',
        showTodayButton: 'true',
        modalHeaderColor: 'bar-positive',
        modalFooterColor: 'bar-positive',
        from: new Date(),
        to: new Date(2018, 8, 25),
        callback: function (val) {
            var getdate = GetFormattedtoDate(val);
            $scope.ToDate = getdate;
            localStorage.pickeddate = $scope.ToDate;
        },
        dateFormat: 'dd/MM/yyyy',
        closeOnSelect: false
    };
    function GetFormattedtoDate(val) {
        if(typeof(val)==='undefined')
        {
            $scope.ToDate = '';
        }
        else {
            var todayTime = new Date(val);
            var month = todayTime.getMonth() + 1;
            var day = todayTime.getDate();
            if (day < 10) {
                day = '0' + day;
            }
            if (month < 10) {
                month = '0' + month;
            }
            var year = todayTime.getFullYear();
            return day + "/" + month + "/" + year;
        }
    }

    $scope.myfromtimePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
        step: 15,  //Optional
        format: 12,  //Optional
        titleLabel: 'Pick a date',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory

            fromtimePicker12Callback(val);
            var m =  epochParser(val,'time');
            if (m  === 'undefined' || m === 'NaN:NaN undefined') {
                $scope.FromTime = '';
            }
            else {
                $scope.FromTime = m;
                localStorage.time = $scope.FromTime;
            }
        }
    };
    function fromtimePicker12Callback(val) {

        if (typeof (val) === 'undefined' || typeof(val) === 'Nan:NaN undefined') {

            $scope.FromTime = '';

        } else {
            $scope.myfromtimePickerObject.inputEpochTime = val;
            var selectedTime = new Date(val * 1000);
        }
    }
    function epochParser(val, opType) {
        if (val === null) {
            return "00:00";
        } else {
            var meridian = ['AM', 'PM'];

            if (opType === 'time') {
                var hours = parseInt(val / 3600);
                var minutes = (val / 60) % 60;
                var hoursRes = hours > 12 ? (hours - 12) : hours;

                var currentMeridian = meridian[parseInt(hours / 12)];
                return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
            }
        }
    }
    function prependZero(param) {
        if (String(param).length < 2) {
            return "0" + String(param);
        }
        return param;
    }

    $scope.doRefresh = function() {
    searchService.myAppointments(localStorage.pid).success(function (data) {
                var x = data.d;
                if (x == null || x == '') {
                    $scope.appoints_list = true;
                    $scope.appointmentslist=[];
                } else {
                    $scope.appoints_list = false;
                    myappointstore.addList(x);
                    $scope.appointmentslist = myappointstore.getList();
                }
            });

    };
        $scope.checkdt = function(){

    var bookedDate = $scope.ToDate;
    var bookedTime=  $scope.FromTime;
    searchService.checkdtservice(bookedDate,bookedTime).success(function(data){
        var result = data.d;
        if(result == 1)
        {
            if (localStorage.network_state == "online") {

                var y = 0;
                if (y == 0) {

                    if (localStorage.pid) {
                        $scope.bookData = {
                            'clientId': null,
                            'userId': null,
                            'doctorId': null,
                            'patientId': null,
                            'specialistID': null,
                            'statusId' : null,
                            'isRegistered':null,
                            'stringdate': null,
                            'stringtime': null,
                            'remarks': null,
                            'notifyflag' :null,
                            'device_token':null,
                            'PatientName':null,
                            'email':null,
                            'doctorname':null,
                            'DepartmentName':null,
                            'message':null
                        };
                        $ionicBackdrop.retain();

                        $ionicPopup.confirm({
                            title: 'Confirm Appointment?',
                            template: 'Are you sure you want to book your appointment at ' + $scope.FromTime
                        }).then(function (res) {
                            if (res) {
                                $ionicPopup.prompt({
                                    title: 'Your Ailment ?',
                                    template: 'Please state your ailment in the textbox below and press ok. (Not Mandatory)',
                                    inputType: 'text',
                                    inputPlaceholder: 'Your Comments'
                                }).then(function (text) {
                                    $ionicBackdrop.release();
                                    $ionicLoading.show({
                                        template: '<ion-spinner icon="android"></ion-spinner>'
                                    });
                                    var doctorDetails= doctordetailstore.getList();
                                    $scope.device_token = localStorage.deviceid;
                                    var di = $scope.device_token;
                                    var messg = 'Appointment with Dr.'+doctorDetails.name+ 'at '+$scope.FromTime;

                                    $scope.bookData = {
                                        'clientId': doctorDetails.clientId,
                                        'userId': localStorage.pid,
                                        'doctorId': doctorDetails.doctorId,
                                        'patientId': localStorage.pid,
                                        'specialistID': doctorDetails.specialistID,
                                        'statusId' : 1,
                                        'isRegistered':1,
                                        'stringdate': bookedDate,
                                        'stringtime':bookedTime,
                                        'remarks': text,
                                        'notifyflag' :1,
                                        'device_token':$scope.device_token,
                                        'PatientName':localStorage.pname,
                                        'email':localStorage.email,
                                        'doctorname':doctorDetails.name,
                                        'DepartmentName':doctorDetails.speciality,
                                        'message':messg
                                    };

                                    var i = JSON.stringify($scope.bookData);
                                    $scope.doctorName = doctorDetails.name;
                                    var q = searchService.bookAppointment(i).success(function (data) {
                                        var k = data.d;
                                        if (k.appointmentId == 0)
                                        {
                                            $ionicPopup.alert({
                                                title: 'Sorry',
                                                template: 'Something went wrong while trying to book your appointment! please try again.'
                                            }).then(function () {
                                                $location.path('app/myappointments');
                                            });
                                        } else {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'Your appointment has been booked successfully. Thank you.'
                                            }).then(function () {

                                                var m = 'Your appointment was scheduled at ' + $scope.FromTime + '\r\n With the doctor' +$scope.doctorName;

                                                var d = localStorage.deviceid;
                                                $scope.doRefresh();
                                                searchService.sendappointmentnotify(m,d).success(function(mydata) {
                                                    $location.path('app/myappointments');
                                                });
                                            });
                                        }
                                    });
                                });
                            } else {
                            }
                        });
                        // ---------------------------------------
                    } else {
                        $scope.openLogin().then($scope.checkdt(x));
                    }

                } else {


                }

            } else {
                $ionicPopup.alert({
                    title: 'No internet!',
                    template: 'Please check your internet connection! '
                }).then(function (res) {
                    $cordovaToast.showLongCenter('No internet!');
                });
            }
            $ionicBackdrop.release();
        }
        else
        {
            $ionicPopup.alert({
                title: 'Info !',
                template: 'Choose valid date/time and try again !'
            });
        }
    });
}
});


//---------------------------------------------------------------------------
appctrl.controller('MyAppointmentsCtrl', function ($scope,$cordovaFileTransfer,$window ,$cordovaActionSheet,$timeout,appdocliststore, myappointstore, $cordovaToast, fileUpload, $filter, $ionicModal, $ionicBackdrop, $ionicLoading, $ionicPopup, $timeout, $http, $location, searchService) {

    if (localStorage.pid) {
        searchService.myAppointments(localStorage.pid).success(function (data) {
            var x = data.d;
            if (x == null || x == '') {
                $scope.appoints_list = true;
            } else {
                $scope.appoints_list = false;
                myappointstore.addList(x);
                $scope.appointmentslist = myappointstore.getList();
            }
        });

    } else {
        $ionicPopup.alert({
            title: 'Please login!',
            template: 'Please login to your account in the profile section and then come back here to view your appointments.'
        }).then(function (res) {
            $location.path('app/profile');
        });
    }
    $scope.doRefresh = function() {

            searchService.myAppointments(localStorage.pid).success(function (data) {
                var x = data.d;
                if (x == null || x == '') {
                    $scope.appoints_list = true;
                    $scope.appointmentslist = [];
                } else {
                    $scope.appoints_list = false;
                    myappointstore.addList(x);
                    $scope.appointmentslist = myappointstore.getList();
                }
            });
        }

    $scope.appointmentslist;
    $scope.cancelapp = function (a,b,c,d,e) {
        $scope.appointmentId = a;
        $scope.patientid = localStorage.pid;
        $scope.patientname = localStorage.pname;
        $scope.email = localStorage.email;
        $scope.doctorname = b;
        $scope.stringdate = c;
        $scope.stringtime = d;
        $scope.departmentName = e;

        var i = $scope.appointmentId;
        var j = $scope.patientid;
        var k = $scope.patientname;
        var l = $scope.email;
        var m = $scope.doctorname;
        var n = $scope.stringdate;
        var o = $scope.stringtime;
        var p = $scope.departmentName;

        $ionicPopup.confirm({
            title: 'Confirm cancel!',
            template: 'Are you sure you want to cancel this appointment?'
        }).then(function (res) {
            $ionicBackdrop.retain();
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            if (res==true) {

                searchService.cancelAppointment(i,j,k,l,m,n,o,p).success(function (data) {

                    if (data.d == true) {
                        $ionicBackdrop.release();
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Appointment Cancelled!',
                            template: 'Your appointment has been cancelled successfully!'
                        }).then(function (res) {
                            $scope.doRefresh();
                            $location.path('app/myappointments');
                        });
                    } else {
                        $ionicBackdrop.release();
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Appointment Cancel failed!',
                            template: 'Something went wrong while cancelling your appointment, please try again!'
                        }).then(function (res) {
                            $scope.doRefresh();
                            $location.path('app/myappointments');
                        });
                    }

                });

            } else {
                $ionicBackdrop.release();
                $ionicLoading.hide();
            }
        });

    };

    $scope.checkdate = function (x) {
        var y;
        var i = new Date();
        if (i > x) {
            y = true;
        } else {
            y = false;
        }

        return y;
    };

    $scope.checkstatus = function (x) {
        var x;
        var y;
        if (x == 'FUTURE') {
            y = true;
        } else if (x == 'TODAY') {
            y = true;
        } else {
            y = false;
        }
        return y;
    };
    $scope.onthumbsup = function (a,b,c) {
        var doctorname=b;
        var appointmentid=c;
        var like=true;
        var dislike=false;
        searchService.likeservice(doctorname,appointmentid,like,dislike).success(function (data) {
            var x = data.d;
            if(x == true) {
                $scope.doRefresh();
            }
            else {
                $cordovaToast.showLongCenter("No Internet! Connect to the internet and try again");
            }
        });
    };

    $scope.onthumbsdown = function (a,b,c) {
        var doctorname=b;
        var appointmenid=c;
        var like=false;
        var dislike=true;
        var description = "";
        searchService.likeservice(doctorname,appointmenid,like,dislike,description).success(function (data) {
            var x = data.d;
            if(x == true) {
                $scope.doRefresh();
            }
            else {
                $cordovaToast.showLongCenter("No Internet! Connect to the internet and try again");
            }
        });
    };

});

appctrl.controller('MapCtrl', function($scope,$ionicPlatform,$cordovaGeolocation,$ionicLoading,GoogleMaps) {
    $ionicPlatform.ready(function() {
        GoogleMaps.init("AIzaSyBccgrD8sk4sm_wmZZQzxyJ3vBZBC0DQCU");
    });
});

appctrl.controller('abtCtrl',function($scope){

    $scope.toggleGroupabt = function(group) {
        if ($scope.isGroupShownabt(group)) {
            $scope.shownGroupabt = null;
        } else {
            $scope.shownGroupabt = group;
        }
    };

    $scope.isGroupShownabt = function(group) {
        return $scope.shownGroupabt === group;
    };

});

appctrl.controller('aboutusCtrl', function ($scope,$ionicScrollDelegate) {
    $scope.groups = [];
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        $ionicScrollDelegate.scrollTop();
        return $scope.shownGroup === group;
    };
});

appctrl.controller('servicesCtrl',function($scope){

});
appctrl.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

appctrl.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});

