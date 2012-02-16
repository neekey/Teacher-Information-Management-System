<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-16
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师密码修改页面
 */
 ?>

<?php echo form_open('#', array('id' => 'login_info_form'));?>
<p>
  <label for='password'>密码</label>
  <input type='password' id='password' class='required' />
  
</p>
<p>
  <label for='password_confirm'>再次输入密码</label>
  <input type='password' id='password_confirm' match='password' class='required match' />
</p>
<input type='button' id='password_change' value='修改' />
</form>