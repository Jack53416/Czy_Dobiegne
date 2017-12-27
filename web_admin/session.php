<?php

include_once "validate.php";

class Session{
	
	function __construct($loginCanGo = false){
		ini_set('session.gc_maxlifetime', 1800);
		session_set_cookie_params(1800);
		session_start();
		
		if($loginCanGo){
			if(!isset($_SESSION['token'])){
				$this->redirectWhenLogout();
			}
		}else{
			if(isset($_SESSION['token'])){
				$this->redirectWhenLogin();
			}
		}
	}
	
	function login($req){
		if(empty($req)){
			return false;
		}else{
			$api = new API;
			$api->path = '/api/auth';
			$api->fields = $req;
			$tmp = json_decode($api->sedToAPI(),true);
			if(isset($tmp['token'])){
				$_SESSION['token'] = $tmp['token'];
			}
			if(isset($_SESSION['token'])){
				$this->redirectWhenLogin();
			}
			return true;
		}
	}
	
	function logout(){
		unset($_SESSION['token']);
		session_destroy();
		$this->redirectWhenLogout();
	}
	
	function redirectWhenLogin(){
		header("location: index.php");
	}
	
	function redirectWhenLogout(){
		header("location: login.php");
	}
	
}
	

?>