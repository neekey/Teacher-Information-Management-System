<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-2-6
 * UTF-8
 * neekey <ni184775761@gmail.com>
 */
 ?>
 <?php $this->load->view("conponent/v_head"); ?>
  <div id='header'></div>
 	<div id='content'>
     	<?php echo form_open($url['login'] . 'submit/'); ?>
     	    <p><label for='user_type'>用户类型</label><select name="user_type" value="<?php echo set_value('username'); ?>">
            <option value="teacher">教师</option>
            <option value="admin">管理员</option>
          </select></p>
          <?php echo form_error('user_type'); ?>
          <p><label for='username'>用户名:</label><input type="text" id="username" class='required' name="username" value="<?php echo set_value('username'); ?>" placeholder="your username" autofocus/></p>
          <?php echo form_error('username'); ?>
          <p><label for='password'>密码:</label><input type="password" id="password" class='required' name="password" placeholder="you password" /></p>
         	<?php echo form_error('password'); ?>
         	<p id='submit_reset' ><input type="submit" class='button2' value="login in" /><input type="reset" class='button' value="reset" /></p>
     	</form>
  	</div>
 <?php $this->load->view("conponent/v_foot"); ?>