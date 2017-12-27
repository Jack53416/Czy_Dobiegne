<?php
//this is page settings
include_once "display.php";
include_once "session.php";
include_once "api_connect.php";

$ses = new Session;
$page = new Display;
//this is page settings

$page->addContent('<div class="wrapper">');

$page->addContent ($ses->login($_POST) ? "<div class='alert alert-danger center-alert'>Wpisane dane są nieprawidłowe.</div>" : "");

$page->addContent('<form class="form-signin" action="login.php" method="post">       
      <h2 class="form-signin-heading">Please login</h2>
      <input type="text" class="form-control" name="username" placeholder="Username" required="" autofocus="" />
      <input type="password" class="form-control" name="password" placeholder="Password" required=""/>      
      
	  <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>   
    </form>
  </div>');

$page->run();

?>


