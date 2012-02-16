<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-16
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师信息编辑页面
 */
 ?>
 <?php $this->load->view("conponent/v_head"); ?>
 <?php $this->load->view("conponent/v_header_switch"); ?>
 <div class='content' >
 <div id='teacher_info_container'>
   <div id='basic_info' ><?php $this->load->view('v_teacher_basic_info'); ?></div>
   <div id='other_info' ><?php $this->load->view('v_teacher_other_info'); ?></div>
   <div id='login_info' ><?php $this->load->view('v_teacher_login_info'); ?></div>
   <div id='avatar_info' ><?php $this->load->view('v_teacher_avatar'); ?></div>
 </div>
 </div>
 <?php $this->load->view("conponent/v_footer"); ?> 
 <?php $this->load->view("conponent/v_foot"); ?>