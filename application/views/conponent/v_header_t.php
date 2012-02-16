<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-11
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师管理页面的header
 */
 ?>
<div id="header"> 
  <div class='logo'></div>
  <div class='log_info'>
    <span>
      <?php echo anchor($url['teacher_base'], '你好！ ' . $user_info['email'], array('title' => '管理员首页')); ?>
      <?php echo anchor($url['logout'], '注销', array('title' => '注销')); ?>
    </span>
  </div>
  <div class='nav'>
    <span>
      <a href='#basic_info' class='tab_1' >基本信息</a><a href='#other_info' class='tab_1' >论文&科研项目</a><a href='#login_info' class='tab_1' >密码修改</a><a href='#avatar_info' class='tab_1' >个人头像</a>
    </span>
  </div>
</div>