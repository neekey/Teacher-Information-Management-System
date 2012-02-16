<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-11
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 管理员页面header
 */
 ?>
<div id="header">
  <div class='logo'></div>
  <div class='log_info'>
    <span>
      <?php echo anchor($url['admin_base'], '你好！ ' . $user_info['username'], array('title' => '管理员首页')); ?>
      <?php echo anchor($url['logout'], '注销', array('title' => '注销')); ?>
    </span>
  </div>
  <div class='nav'>
    <span>
      <?php echo anchor($url['admin_base'] . 'item_set/', '类目设置', array('title' => '类目设置')); ?>
      <?php echo anchor($url['admin_base'] . 'teacher_search/', '教师搜索', array('title' => '教师搜索')); ?>
      <?php echo anchor($url['admin_base'] . 'teacher_add/', '添加教师', array('title' => '添加教师')); ?>
      <?php echo anchor($url['admin_base'] . 'teacher_list/', '教师列表', array('title' => '教师列表')); ?>
      
    </span>
  </div>
  
</div>