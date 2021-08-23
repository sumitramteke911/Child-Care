<?php
include 'DB.php';
/*API SERVICE*/
class Service
{

    /** Function
     * @param $service : Name of the Webservice
     * @return JSON Array
     * Description : Service to fetch all category
     * */
    public function __construct()
    {
    }
    public $CACHE_EXPIRY = 300; //in Seconds

    public function ws_CheckLogin($username,$password)
    {
        $db = new DB();
        $res = array();
        $res['login_status']=0;
        $res['message']='Wrong username or password';
        $userData = $db->getRows('doctors',array('where'=>array('username'=>$username,'password'=>$password),'return_type'=>'single'));
        if($userData){
            $res['login_status']=1;
            $res['user_details']=$userData;
            $res['message']='Login Successfully';
        }
        return $res;
    }
    public function ws_Appointments($dr_id)
    {
        $db = new DB();
        $appointments = $db->getRowsByQuery("SELECT a.id as appointments_id,a.*,b.* FROM appointments a,baby b WHERE a.dr_id=$dr_id AND b.id=a.baby_id AND DATE(a.datetime) > DATE(NOW()) order by a.datetime");
        //$appointments = $db->getRows('appointments',array('where'=>array('dr_id'=>$dr_id),'order_by'=>'id DESC'));//a.datetime >= CURDATE()
        return $appointments; 
    }
    public function ws_getParentAppointments($baby_id)
    {
        $db = new DB();
        $appointments = $db->getRowsByQuery("SELECT a.*,b.* FROM appointments a,doctors b WHERE a.baby_id=$baby_id AND b.id=a.dr_id AND DATE(a.datetime) > DATE(NOW()) order by a.datetime");
        //$appointments = $db->getRows('appointments',array('where'=>array('dr_id'=>$dr_id),'order_by'=>'id DESC'));//a.datetime >= CURDATE()
        return $appointments; 
    }
    public function ws_Patients($dr_id)
    {
        $db = new DB();
        $appointments = $db->getRowsByQuery("SELECT a.id as appointments_id,a.*,b.* FROM appointments a,baby b WHERE a.dr_id=$dr_id AND b.id=a.baby_id");
        //$appointments = $db->getRows('appointments',array('where'=>array('dr_id'=>$dr_id),'order_by'=>'id DESC'));//a.datetime >= CURDATE()
        return $appointments; 
    }
    public function ws_Doctors()
    {
        $db = new DB();
        $doctors = $db->getRowsByQuery("SELECT * FROM doctors");
        return $doctors;
    }
    public function ws_SaveBaby($name,$dob,$gender,$app_id,$role,$mobile)
    {
        /*code for sending otp*/
        $db = new DB();
        $res = array();
        $res['status']='ERROR';
        $res['message']='Sorry try again later';
        //store in table
        $otpData = array(
                'name' => $name,
                'dob' => $dob,
                'gender'=>$gender,
                'app_id'=>$app_id,
                'mobile'=>$mobile,
                'role'=>$role,
                /*'datetime'=>date("Y-m-d H:i:s"),*/
                'id' =>'',
        );
        //end
        $id=$db->insert("baby",$otpData);
        if($id){
            $otpData['id']=$id;
            $res['status']='SUCCESS';
            $res['message']='Record Inserted';
            $res['user_details']=$otpData;
        }
        return $res;
        /*Code End*/
    }
    public function ws_updateNotes($id,$notes)
    {
        /*code for sending otp*/
        $db = new DB();
        $res = array();
        $res['status']='ERROR';
        $res['message']='Sorry try again later';
        //store in table
        $otpData = array(
        'dr_notes' => $notes
        );
        //end
        $condition = array('id' => $id);
        $update=$db->update("appointments",$otpData,$condition);
        if($update){
            $res['status']='SUCCESS';
            $res['message']='Record Updated';
        }
        return $res;
        /*Code End*/
    }
    public function ws_BookAppointments($dr_id,$baby_id,$datetime)
    {
        /*code for sending otp*/
        $db = new DB();
        $res = array();
        $res['status']='ERROR';
        $res['message']='Sorry try again later';
        //store in table
        $otpData = array(
                'dr_id' => $dr_id,
                'baby_id' => $baby_id,
                'datetime'=>$datetime
                //'datetime'=>date("Y-m-d H:i:s")
        );
        //end
        $id=$db->insert("appointments",$otpData);
        if($id){
            $res['status']='SUCCESS';
            $res['message']='Record Inserted';
            $res['appointment_details']=$otpData;
        }
        return $res;
        /*Code End*/
    }
    public function curlGet($_url)
    {
        /*Star log file for api*/
        $this->log($_url."\n--->", null,"smsapi.log");
        /*END*/
        $curl_handle=curl_init();
        curl_setopt($curl_handle, CURLOPT_URL,$_url);
        curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 500);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_handle, CURLOPT_TIMEOUT,60); // 60 seconds
        $query = curl_exec($curl_handle);
        if(curl_error($curl_handle))
        {
            $this->log(curl_error($curl_handle), null, "developer.log");
        }
        curl_close($curl_handle);
        return $query;
    }
    public function log($msg,$time,$logfile){
        file_put_contents("log/".$logfile, "\n".$msg,FILE_APPEND);
    }
    public function test()
    {
    
    }    
}