var push,isAndroid=false,BASE_URL="http://www.gvrconstruction.com/childapi/";
function toastDestroy () {
    var toasts = document.getElementsByClassName('toast');
    for (var i = toasts.length - 1; i >= 0; i--) {
        Vel(toasts[i], {"opacity": 0, marginTop: '-40px'}, { duration: 375,
            easing: 'easeOutExpo',
            queue: false,
            complete: function(){
                // Callback aborted
                // Removal handled by materialize
            }
        });
    };
}
$.ajaxSetup({ cache: true ,type:"GET",crossDomain:true});
var app = {
    	
	    initialize: function() {
	        this.bindEvents();
	    },
	    bindEvents: function() {
	        document.addEventListener('deviceready', this.onDeviceReady, false);
	        document.addEventListener('backbutton', goBack , false);
	    },
		onDeviceReady: function() {
		    app.receivedEvent('deviceready');
		},
		  // Update DOM on a Received Event
		receivedEvent: function(id) {
		    console.log('Received Eventt: ' + id);
		    if(device.platform == 'android' || device.platform == 'Android'){
		    	isAndroid=true;
		    }
		    initializePush();
		}

	};
function checkOfflineState(){
	try{
		var state;
		//state = Connection.NONE;
		if(isAndroid)
			state= navigator.connection.type;
		else
			state= Connection.CELL;
		if(state == Connection.NONE){
		    if($('#loader_model').is(':visible'))
		        closeMeLoader();
		    //toastDestroy();
		    if($('.toast').length==0)
		    Materialize.toast("Please check your internet connection", 1000);
		}
	}catch(err){
		console.log(err.message);
	}
}
function openMeLoader(){
	try{
		$('#loader_model').openModal({dismissible: false,opacity: 0.1});
	}catch(err){
	  		console.log(err);
	}
}
function closeMeLoader(){
	  	try{
	  		$('#loader_model').closeModal();
	  	}catch(err){
	  		console.log(err);
	  	}
}
$(document).ready(function(){
	       $('#left_side_slide-out.button-collapse').sideNav({
                menuWidth: 240, // Default is 240
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
              }
          );
         var dates_vaccination = [0,42,70,98,182,273,273,365,457,487,547,730,1461,3652];
         var user_details=JSON.parse(localStorage.getItem("user_details"));
          if(user_details){
            var dob=user_details['dob'];
            /*$("#baby-vaccination table tr").each(function(key,value) {
              $(this).find("td").eq(2).
            });*/
            $.each(dates_vaccination, function( key, value ) {
              $("#baby-vaccination table tbody tr").eq(key).find("td").eq(2).text(getMyDate(dob,value));
            });
          }


});
function getMyDate(datestr,days_to_add){
  var sourceDate = moment(new Date(datestr));
  targetDate = sourceDate.add(days_to_add,'days').format('YYYY/MM/DD');
  console.log(targetDate);
  console.log(days_to_add);
  return targetDate+' ('+days_to_add+' Days)';
}
/*Push Notification Functions......................*/
function initializePush(){
    try{
        push = PushNotification.init({ "android": {"senderID": "918909303989","clearNotifications":true,"forceShow":true},"ios": {"alert": "true", "badge": "true", "sound": "true"} } );
        push.on('registration', function(data) {
                //console.log(data.registrationId);
                localStorage.setItem("reg_id",data.registrationId);
        });
        push.on('notification', function(data) {console.log('Received Push notification');});
        push.on('error', function(e) {console.log(e.message);});
    }catch(err){
        console.log('push:'+err.message);
    }
}

/*Push Notification Functions......................*/

function loadPatinet(){
	openMeLoader();
	$.getJSON(""+BASE_URL+"index.php?"+"&service=Patients"+"&dr_id="+dr_id,
          function (response) {
          	$("#patient-list ul").html("");
          	console.log(response);
          	$.each( response, function( key, value ) {
			  $("#patient-list ul").append('<li id="'+key+'" class="collection-item avatar"><img src="images/default_prof.png" alt="" class="circle"><span class="title">'+value['name']+'</span><p>'+value['datetime']+'<br>'+value['mobile']+'</p><a href="#!" class="secondary-content"><i class="mdi-action-stars"></i></a></li>');
			});
			$("#patient-list ul li").on("click",function(){
				var tmp=$(this).attr("id");
				console.log(response[tmp]);
				$("#patient-details table #p_name").text(response[tmp]['name']);
          		$("#patient-details table #dr_dob").text(response[tmp]['dob']);
          		//$("#doctor-home table #dr_image img").src(response['image']);
          		$("#patient-details table #dr_gender").text(response[tmp]['gender']);
          		$("#patient-details table #dr_role").text(response[tmp]['role']);
          		$("#patient-details table #dr_mobile").text(response[tmp]['mobile']);
              $("#patient-details #dr_notes").val(response[tmp]['dr_notes']).trigger('autoresize');
              $("#patient-details a.updateNotes_btn").attr("onClick","updateNotes("+response[tmp]['appointments_id']+")");
          		$("#patient-details").openModal();
			});
          	setTimeout(closeMeLoader,1000);
          });
}
function loadAppointments(){
	openMeLoader();
	$.getJSON(""+BASE_URL+"index.php?"+"&service=Appointments"+"&dr_id="+dr_id,
          function (response) {
          	$("#appointment-list #temp_list").html("");
          	console.log(response);
          	$.each( response, function( key, value ) {
              var date_part=value['datetime'].split(" ");
              console.log(date_part);
              if($("#appointment-list ul#"+date_part[0]+"").length){
                $("#appointment-list ul#"+date_part[0]+"").append('<li id="'+key+'" class="collection-item avatar"><img src="images/default_prof.png" alt="" class="circle"><span class="title">'+value['name']+'</span><p>'+value['datetime']+'<br>'+value['mobile']+'</p><a href="#!" class="secondary-content"><i class="mdi-action-stars"></i></a></li>');
              }else{
                $("#appointment-list #temp_list").append('<ul id="'+date_part[0]+'" class="collection with-header"><li class="collection-header"><h5>'+date_part[0]+'</h5></li></ul>');
                $("#appointment-list ul#"+date_part[0]+"").append('<li id="'+key+'" class="collection-item avatar"><img src="images/default_prof.png" alt="" class="circle"><span class="title">'+value['name']+'</span><p>'+value['datetime']+'<br>'+value['mobile']+'</p><a href="#!" class="secondary-content"><i class="mdi-action-stars"></i></a></li>');
              }
			        
			     });
        $("#appointment-list ul li").on("click",function(){
        var tmp=$(this).attr("id");
        console.log(response[tmp]);
        $("#patient-details table #p_name").text(response[tmp]['name']);
              $("#patient-details table #dr_dob").text(response[tmp]['dob']);
              //$("#doctor-home table #dr_image img").src(response['image']);
              $("#patient-details table #dr_gender").text(response[tmp]['gender']);
              $("#patient-details table #dr_role").text(response[tmp]['role']);
              $("#patient-details table #dr_mobile").text(response[tmp]['mobile']);
              
              $("#patient-details #dr_notes").val(response[tmp]['dr_notes']).trigger('autoresize');  
              $("#patient-details a.updateNotes_btn").attr("onClick","updateNotes("+response[tmp]['appointments_id']+")");
              $("#patient-details").openModal();
        });  
          	setTimeout(closeMeLoader,1000);
          });
}
function getMyAppointment(){
  openMeLoader();
  var user_details=JSON.parse(localStorage.getItem("user_details"));
  var user_mother_details=JSON.parse(localStorage.getItem("user_mother_details"));
  if(user_details)
    var baby_id=user_details['id'];
  else
    var baby_id=user_mother_details['id'];

  $.getJSON(""+BASE_URL+"index.php?"+"&service=getParentAppointments"+"&baby_id="+baby_id,
          function (response) {
            $("#my-appointment ul").html("");
            console.log(response);
            $.each( response, function( key, value ) {
        $("#my-appointment ul").append('<li class="collection-item avatar"><img src="images/default_prof.png" alt="" class="circle"><span class="title">'+value['name']+'</span><p>'+value['datetime']+'<br>'+value['contacts']+'</p><a href="#!" class="secondary-content"><i class="mdi-action-stars"></i></a></li>');
      });
            setTimeout(closeMeLoader,1000);
          });
}
function loadDoctors(){
	openMeLoader();
	$.getJSON(""+BASE_URL+"index.php?"+"&service=Doctors",
          function (response) {
          	$("#doctor-list ul").html("");
          	console.log(response);
          	$.each( response, function( key, value ) {
			  $("#doctor-list ul").append('<li id="'+key+'" class="collection-item avatar"><img src="images/default_prof.png" alt="" class="circle"><span class="title">'+value['name']+'</span><p>'+value['contacts']+'</p><a href="#!" class="secondary-content"><i class="mdi-action-stars"></i></a></li>');
			});
			$("#doctor-list ul li").on("click",function(){
				var tmp=$(this).attr("id");
				console.log(response[tmp]);
				$("#doctor-details table #dr_name").text(response[tmp]['name']);
          		$("#doctor-details table #dr_mobile").text(response[tmp]['contacts']);
          		$("#doctor-details table #dr_qualifications").text(response[tmp]['qualifications']);
          		//$("#doctor-home table #dr_image img").src(response['image']);
          		$("#doctor-details table #dr_experience").text(response[tmp]['experience']+' Years');
          		$("#doctor-details table #dr_about").text(response[tmp]['about']);
          		$("#doctor-details a.bookAppointments").attr("onClick","bookAppointments("+response[tmp]['id']+")");
          		$("#doctor-details").openModal();
			});
          	setTimeout(closeMeLoader,1000);
          });
}
      function loginDoctor(){
        openMeLoader();
        var username = $("#doctor-login #username").val();
        var password = $("#doctor-login #password").val();
        //var app_id =localStorage.getItem("reg_id");
          $.getJSON(""+BASE_URL+"index.php?"+"&service=verifylogin"+"&username="+username+"&password="+Base64.encode(password),
                  function (response) {
                      console.log(response);
                        setTimeout(closeMeLoader,1000);
                        if(response['login_status']==0){
                            if(response['message'])
                                Materialize.toast(response['message'], 3000);
                            else
                                Materialize.toast("Invalid username or Password", 3000);
                        }else{
                            localStorage.setItem("doctor_details", JSON.stringify(response['user_details']));
                            Materialize.toast(response['message'], 3000);
                            $( location ).attr("href", "index.html");
                        }
                });
      }
function babyRegister(role){
        openMeLoader();
        var name = $("#baby-register #name").val();
        var dob = $("#baby-register #dob").val();
        var gender = $("#baby-register #gender").val();
        var mobile = $("#baby-register #mobile").val();
        var app_id =localStorage.getItem("reg_id");
          $.getJSON(""+BASE_URL+"index.php?"+"&service=SaveBaby"+"&name="+name+"&dob="+dob+"&gender="+gender+"&mobile="+mobile+"&app_id="+app_id+"&role="+role,
                  function (response) {
                      console.log(response);
                        setTimeout(closeMeLoader,1000);
                        if(response['status']=='ERROR'){
                          Materialize.toast(response['message'], 3000);  
                        }else{
                            localStorage.setItem("user_details", JSON.stringify(response['user_details']));
                            Materialize.toast(response['message'], 3000);
                            $( location ).attr("href", "index.html");
                        }
                });
}
function updateNotes(appoint_id){
        openMeLoader();
        var notes = $("#patient-details #dr_notes").val();
      $.getJSON(""+BASE_URL+"index.php?"+"&service=updateNotes&id="+appoint_id+'&notes='+notes,
                  function (response) {
                      console.log(response);
                        setTimeout(closeMeLoader,1000);
                        if(response['status']=='ERROR'){
                          Materialize.toast(response['message'], 3000);  
                        }else{  
                          Materialize.toast("Notes Updated", 3000);
                        }
                });
}
function babyRegister2(role){
        openMeLoader();
        var name = $("#baby-register2 #name").val();
        var dob = $("#baby-register2 #dob2").val();
        var gender = 'Female';
        var mobile = $("#baby-register2 #mobile").val();
        var app_id =localStorage.getItem("reg_id");
          $.getJSON(""+BASE_URL+"index.php?"+"&service=SaveBaby"+"&name="+name+"&dob="+dob+"&gender="+gender+"&mobile="+mobile+"&app_id="+app_id+"&role="+role,
                  function (response) {
                      console.log(response);
                        setTimeout(closeMeLoader,1000);
                        if(response['status']=='ERROR'){
                          Materialize.toast(response['message'], 3000);  
                        }else{
                            localStorage.setItem("user_mother_details", JSON.stringify(response['user_details']));
                            Materialize.toast(response['message'], 3000);
                            $( location ).attr("href", "index.html");
                        }
                });
}
function bookAppointments(dr_id){
	$("#book-confirm a.book-confirm-btn").attr("onClick","confrimbookAppointments("+dr_id+")");     
   	$("#book-confirm").openModal();     
}
function confrimbookAppointments(dr_id){
        openMeLoader();
        var datetime=$("#book-confirm #book_date").val();
        var user_details=JSON.parse(localStorage.getItem("user_details"));
        var user_mother_details=JSON.parse(localStorage.getItem("user_mother_details"));
        if(user_details)
		var baby_id=user_details['id'];
		else
		var baby_id=user_mother_details['id'];

        $.getJSON(""+BASE_URL+"index.php?"+"&service=bookAppointments"+"&baby_id="+baby_id+"&dr_id="+dr_id+"&datetime="+datetime,
                  function (response) {
                      console.log(response);
                        if(response['status']=='ERROR'){
                          Materialize.toast(response['message'], 3000);  
                        }else{
                          Materialize.toast("Done !", 3000);
                        }
                        setTimeout(closeMeLoader,1000);
                });
}
function vibrate(time){
  navigator.vibrate(time);
}
function openExternal(elem) {
    window.open(elem.href, "_system");
    return false; // Prevent execution of the default onClick handler 
}
function goBack(){
	$(".modal:visible").each(function(){
       model_id=$(this).attr('id');
    });
    console.log(model_id);
    if(model_id=="parent-confirm-sec-home" || model_id=="parent-confirm-first-home" || model_id=="doctor-home"){
    	return false;
    }
    $('#'+model_id+'').closeModal();
}
function goHome(){
	//$( location ).attr("href", "index.html");
	$(".modal:visible").each(function(){
       model_id=$(this).attr('id');
       console.log(model_id);
       	if(model_id=="parent-confirm-sec-home"||model_id=="parent-confirm-first-home" || model_id=="doctor-home"){
    		//return false;
    	}else{
    		$('#'+model_id+'').closeModal();
    	}
    });
}
/*END Cart Function--------------------------------------------*/
function get_query(){
    var url = location.search;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
}
// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
app.initialize();
