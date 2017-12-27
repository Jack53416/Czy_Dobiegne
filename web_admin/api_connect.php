<?php

class API{
	
	private $url = "https://35.165.124.185";
	public $path;
	public $fields;
	
	function sedToAPI(){
		$curl = curl_init();

		curl_setopt_array($curl, array(
		  CURLOPT_URL => $this->url.$this->path,
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => "",
		  CURLOPT_SSL_VERIFYHOST => false,
		  CURLOPT_SSL_VERIFYPEER => false,
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 30,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => "POST",
		  CURLOPT_POSTFIELDS => http_build_query($this->fields),
		  CURLOPT_HTTPHEADER => array(
			"accept: application/json",
			"cache-control: no-cache",
			"content-type: application/x-www-form-urlencoded"
		  ),
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) {
		  return "Error #:" . $err;
		} else {
		  return  $response;
		}			
	}
	
}

?>