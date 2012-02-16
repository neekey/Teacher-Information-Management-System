<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-2-6
 * UTF-8
 * neekey <ni184775761@gmail.com>
 */
 ?>
 
 <?php $this->load->view("conponent/v_head"); ?>
 <div id='header' ></div>
 <div id='content' >
 	<p id="result_msg"><?php echo $page['result_msg']; ?></p>
 	<p><?php echo anchor($page['redirect_url'] , $page['redirect_title'], array('title' => $page['redirect_title'])); ?></p>
 </div>
 <?php $this->load->view("conponent/v_footer"); ?> 
 <?php $this->load->view("conponent/v_foot"); ?>