 <?php
/****************************************************************************
-----------------------------------------------------------------------------
*  File            :     Index.php
*  Description     :     Api for mandi
-----------------------------------------------------------------------------
*****************************************************************************/
include_once('Service.php');
//Config

//Config END
//Entry Area check service
try {
  if (!isset($_GET["service"])) {
    ws_service404(null);
    exit;
  }
  $service     = $_GET["service"];
  $ws_service  = new Service();
  switch ($service) {
          case "verifylogin":
              // This Api will check if the given number is registered with some driver or not.
              $username=$_GET["username"];
              $password=base64_decode($_GET["password"]);
              $res = $ws_service->ws_CheckLogin($username,$password);
              echo json_encode($res);
              break;
          case "Appointments":
              //This App will give all the job request that assigned to driver.
              $dr_id = $_GET["dr_id"];
              $res = $ws_service->ws_Appointments($dr_id);
              echo json_encode($res);
              break;
          case "getParentAppointments":
              //This App will give all the job request that assigned to driver.
              $baby_id = $_GET["baby_id"];
              $res = $ws_service->ws_getParentAppointments($baby_id);
              echo json_encode($res);
              break;
          case "Patients":
              //This App will give all the job request that assigned to driver.
              $dr_id = $_GET["dr_id"];
              $res = $ws_service->ws_Patients($dr_id);
              echo json_encode($res);
              break;
          case "bookAppointments":
              //This App will give all the job request that assigned to driver.
              $dr_id = $_GET["dr_id"];
              $baby_id = $_GET["baby_id"];
              $datetime = $_GET["datetime"];
              $res = $ws_service->ws_BookAppointments($dr_id,$baby_id,$datetime);
              echo json_encode($res);
              break;
          case "Doctors":
              //This App will give all the job request that assigned to driver.
              $res = $ws_service->ws_Doctors();
              echo json_encode($res);
              break;
          case "SaveBaby":
              //This API will send otp on given number
              $name=$_GET["name"];
              $dob=$_GET["dob"];
              $gender=$_GET["gender"];
              $app_id=$_GET["app_id"];
              $role=$_GET["role"];
              $mobile=$_GET["mobile"];

              $res = $ws_service->ws_SaveBaby($name,$dob,$gender,$app_id,$role,$mobile);
              echo json_encode($res);
              break;
          case "updateNotes":
              //This API will send otp on given number
              $id=$_GET["id"];
              $notes=$_GET["notes"];
              $res = $ws_service->ws_updateNotes($id,$notes);
              echo json_encode($res);
              break;
          default:
              echo 'Service 404 Error :  No Such Web Service found under APIs at your domain';
      }
}catch (Exception $exc) {
  echo 'API Exception : ' . $exc;
}
/*=====================      Handle When Service Not Found      =========================*/
function ws_service404($service)
{
    if ($service == "" || $service == null)
        echo 'Service 404 Error :  No Such Web Service found under APIs at your domain';
    else
        echo 'Service 404 Error : ' . $service . ' Web Service is not found under APIs at your domain';
}