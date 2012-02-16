<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-1
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师信息编辑页面
 */
 ?>
<?php $this->load->view("conponent/v_head"); ?>
<?php $this->load->view("conponent/v_header_switch"); ?>
<div class='content' >
<div id='teacher_add'>
  <form id='teacher_add_form' >
  <ul id='add_ul'>
    <li >
      <label class='email_label'  >邮箱</label><input class='email required input_text' type='text' /><label class='email_label' >姓名</label><input class='name required input_text' type='text' /><input class='add_button' type='button' value='添加' ><input class='edit_button' type='button' style='display: none' value='修改'><input class="close_button" type="button" value="关闭" >
    </li>
  </ul>
  </form>
  <input type='button' class='button2' id='add_item' value='继续添加' />
</div>
</div>
<?php $this->load->view("conponent/v_footer"); ?>
<?php $this->load->view("conponent/v_foot"); ?>