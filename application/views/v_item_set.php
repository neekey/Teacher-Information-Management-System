<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-20
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 职称教研单位等编辑页面
 */
?>
<?php $this->load->view("conponent/v_head"); ?>
<?php $this->load->view("conponent/v_header_switch"); ?>
<div class='content' >
<div id='item_container'>
  <ul class='tab clear'>
      <li><a href='#tru_ul_container' class='item_tab' >教研单位设置</a></li>
      <li><a href='#title1_ul_container' class='item_tab' >职称1设置</a></li>
      <li><a href='#title2_ul_container' class='item_tab' >职称2设置</a></li>
  </ul>
  <form id='item_form'>
  <div id='tru'>
    <div id='tru_ul_container' >
      <div id='tru_type'>
        <h1>类别</h1>
        <ul id='tru_type_ul' >
        <?php foreach($item['tru_type'] as $tru_type){ ?>
          <li id='tru_type_<?php echo $tru_type['id']; ?>'>
            <input type='text' class='required' value='<?php echo $tru_type['name'] ?>' /><input type='button' class='item_delete' value='删除' /><a href='#' class='tru_place_show'>>></a>
          </li>
        <?php } ?>
        </ul>
        <p><input type='text' id='tru_type_add' class='required' /><input type='button' class='add_item  button2' value='添加'></p>
      </div>
      <div id='tru_place' class='gray_container' >
        <h1>具体单位</h1>
        <ul id='tru_place_ul' >
        </ul>
        <p><input type='text' id='tru_place_add' class='required' /><input type='button' class='add_item button2' value='添加'></p>
      </div>
    </div>
  </div>
  <div id='title1'>
    <div id='title1_ul_container'>
      <div id='title1_type'>
        <h1>类别</h1>
        <ul id='titl1_type_ul'>
        <?php foreach($item['title1']['type'] as $title1_type){ ?>
          <li id='title1_type_<?php echo $title1_type['id']; ?>'>
            <input type='text' class='required' value='<?php echo $title1_type['name'] ?>' /><input type='button' class='item_delete' value='删除' />
          </li>
        <?php } ?>
        </ul>
        <p><input type='text' id='title1_type_add' class='required' /><input type='button' class='add_item button2' value='添加'></p>
      </div>
      <div id='title1_level'>
        <h1>级别</h1>
        <ul id='title1_level_ul'>
        <?php foreach($item['title1']['level'] as $title1_level){ ?>
          <li id='title1_level_<?php echo $title1_level['id']; ?>'>
            <input type='text' class='required' value='<?php echo $title1_level['name'] ?>' /><input type='button' class='item_delete' value='删除' />
          </li>
        <?php } ?>
        </ul>
        <p><input type='text' id='title1_level_add' class='required' /><input type='button' class='add_item button2' value='添加'></p>
      </div>
    </div>
  </div>
  <div id='title2'>
    <div id='title2_ul_container'>
      <ul id='title2_ul'>
      <?php foreach($item['title2'] as $title2){ ?>
        <li id='title2_<?php echo $title2['id']; ?>'>
          <input type='text' class='required' value='<?php echo $title2['name'] ?>' /><input type='button' class='item_delete' value='删除' />
        </li>
      <?php } ?>
      </ul>
      <p><input type='text' id='title2_add' class='required' /><input type='button' class='add_item button2' value='添加'></p>
    </div>
  </div>
  </form>
</div>
</div>
<?php $this->load->view("conponent/v_footer"); ?> 
<?php $this->load->view("conponent/v_foot"); ?>