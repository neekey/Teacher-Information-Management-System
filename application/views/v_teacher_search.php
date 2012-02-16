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
<div id='search'>
  <p>
    <label for='name'>教师姓名</label><input id='name' type='text' /><input type='button' id='search_submit' value='搜索' /><input id='setting_handler' type="checkbox"><label for='setting_handler'>搜索设置</label>
  </p>
  <div id='setting' class='gray_container' >
    <p>
      <label for='teac_rese_unit'>教研单位</label><select id='teac_rese_unit' class='required' name='teac_rese_unit'>
        <option value='null'>--</option>
        <?php foreach($item['tru'] as $tru){?>
          <option value='<?php echo $tru['id']; ?>'> 
          <?php echo $tru['name']; ?>[ <?php echo $tru['type_name']; ?> ]</option>
        <?php } ?>
      </select>
    </p>
    <p>
      <label for='title1_type'>职称</label><select id='title1_type' class='required' name='title1_type'>
        <option value='null'>--</option>
        <?php foreach($item['title1']['type'] as $title1_type){ ?>
          <option value='<?php echo $title1_type['id']; ?>'>
          <?php echo $title1_type['name']; ?></option>
        <?php } ?>
      </select><select id='title1_level' class='required' name='title1_level' >
        <option value='null'>--</option>
        <?php foreach($item['title1']['level'] as $title1_level){ ?>
          <option value='<?php echo $title1_level['id']; ?>'>
          <?php echo $title1_level['name']; ?></option>
        <?php } ?>
      </select>
    </p>
    <p>
      <label for='sex'>性别</label><select id='sex' name='sex' value='' class='required' >
        <option value='null'>--</option>
        <option value="male" >男</option>
        <option value="female" >女</option>
      </select>
    </p>
  </div>
</div>
<div id='search_result'>
  <h1>搜索结果<span class='result_info' ></span></h1>
  <ul id='teacher_list'>
    <li>
      <span class='teacher_name'></span><span class='teacher_tru'></span>
    </li>
  </ul>
</div>
</div>
<?php $this->load->view("conponent/v_footer"); ?> 
<?php $this->load->view("conponent/v_foot"); ?>