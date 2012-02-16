<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-4-6
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 根据控制器传入的数据决定载入哪个header文件
 */
 ?>

<div id='main' class='clear' >
  <div class='header clear'>
    <div class='title' ><?php echo $page["title"]; ?></div>
    <?php if(isset($page["tip"])) { ?><div class='page_tip'><?php echo $page["tip"]; ?></div><?php } ?>
  </div>