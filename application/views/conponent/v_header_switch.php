<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-11
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 根据控制器传入的数据决定载入哪个header文件
 */
 ?>

<?php
  // 若未登录
  if(!$login)
  {
    $this->load->view('conponent/v_header');
  }
  // 若为教师
  else if($user_type === 'teacher')
  {
    $this->load->view('conponent/v_header_t');
  }
  // 若为管理员
  else
  {
    $this->load->view('conponent/v_header_a');
  }
  $this->load->view('conponent/v_main_header')
?>

  