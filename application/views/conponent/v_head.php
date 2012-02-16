<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-2-5
 * UTF-8
 * neekey <ni184775761@gmail.com>
 */
 ?>
<!DOCTYPE html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title><?php echo $page['title']; ?></title>
        <!-- css files Default -->
        <?php if(isset($page['default_css'])){  foreach($page['default_css'] as $css_name){
            echo '<link rel="stylesheet" type="text/css" href="' . $url['css'] . $css_name . '" >'; }} ?>
        <!-- css files -->
        <?php if(isset($page['css'])){  foreach($page['css'] as $css_name){
            echo '<link rel="stylesheet" type="text/css" href="' . $url['css'] . $css_name . '" >'; }} ?>
        <!--[if IE 6]>
		<link rel="stylesheet" type="text/css" href="<?php echo $url['css'] . 'common/ie6'; ?>" />
 		<![endif]-->
        <!-- javascript files Default -->
        <?php if(isset($page['default_js'])){  foreach($page['default_js'] as $js_name){
            echo '<script  type="text/javascript" src="' . $url['js'] . $js_name . '" ></script>'; }} ?>
        <!-- javascript files -->
        <?php if(isset($page['js'])){  foreach($page['js'] as $js_name){
            echo '<script  type="text/javascript" src="' . $url['js'] . $js_name . '" ></script>'; }} ?>
		<!--[if IE 6]>
		<script  type="text/javascript" src="<?php echo $url['js'] . 'base/ie6'; ?>" /></script>
 		<![endif]-->
    </head>
    <body>
        <div id='base_container'>