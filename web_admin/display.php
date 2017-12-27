<?php

class Display{
	
	public $pageContent;
	
	function addContent($newContent){
		$this->pageContent = $this->pageContent.$newContent;
	}
	
	function run(){
		$header = "<!DOCTYPE html><html><head>
			<title>Admin - Czy Dobiegne</title>
			<script src='https://npmcdn.com/tether@1.2.4/dist/js/tether.min.js'></script>
			<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>
			<link rel='stylesheet' href='bootstrap/css/bootstrap.min.css'>
			<link rel='stylesheet' href='bootstrap/main.css'>
			<script src='bootstrap/js/bootstrap.min.js'></script>
			</head><body>";
		$footer = "</body></html>";	
		
		echo $header.$this->pageContent.$footer;
	}
	
}

?>