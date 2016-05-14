<!DOCTYPE html>

<html>
<head>
	<meta charset="UTF-8"/><!-- Not sure exactly what this is but it seems necessary -->
	<title>ex02 - external file</title>
	
	<link rel="stylesheet" type="text/css" href="XSS.css" />
	<style type="text/css"></style><!-- Load CSS just for viewing pleasure -->
	
	<?php include 'main.php';?><!-- Include external php script -->
</head>
<body>
	<?php
		echo $hello;
	?>
</body>
</html>