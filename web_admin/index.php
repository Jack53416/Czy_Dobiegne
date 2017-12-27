<?php
//this is page settings
include_once "display.php";
include_once "session.php";
include_once "api_connect.php";

$ses = new Session(true);
$page = new Display;
//this is page settings


var_dump($_SESSION);

$page->addContent('zalogowany');

$page->run();

?>