<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-17
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师列表页面
 */
 ?>
<?php $this->load->view("conponent/v_head"); ?>
<?php $this->load->view("conponent/v_header_switch"); ?>
<div id='category'>
  <ul>
    <li id='category_all'><a href='#list_all' class='list_tab category_title' >全部教师</a></li>
    <li id='category_tru'>
      <p class='category_title'>教研单位</p>
      <ul>
        <?php foreach($item['tru'] as $tru){?>
          <li id='tru_<?php echo $tru['id']; ?>'>
            <a class='list_tab' href='#list_tru'><?php echo $tru['name']; ?>[<?php echo $tru['type_name']; ?>]</a>
          </li>
        <?php } ?>
      </ul>
    </li>
    <li id='category_title1'>
      <p class='category_title' >职称1</p>
      <ul>
        <?php foreach($item['title1']['type'] as $title1_type){ ?>
          <li id='title1_<?php echo $title1_type['id']; ?>'>
            <a class='list_tab' href='#list_title1'><?php echo $title1_type['name']; ?></a>
          </li>
        <?php } ?>
      </ul>
    </li>
    <li id='category_title2'>
      <p class='category_title' >职称2</p>
      <ul>
        <?php foreach($item['title2'] as $title2){ ?>
          <li id='title2_<?php echo $title2['id']; ?>'>
            <a class='list_tab' href='#list_title2'><?php echo $title2['name']; ?></a>
          </li>
        <?php } ?>
      </ul>
    </li>
  </ul>
</div>
<div id='teacher_list'>
  <div class='title'><span class='teacher_name'>姓名</span><span class='teacher_sex'>性别</span><span class='teacher_tru'>教研单位</span><span class='list_info'>20/60 第一页</span></div>
  <div id='list_all'>
    <ul>
    </ul>
  </div>
  <div id='list_tru'>
    <ul>
    </ul>
  </div>
  <div id='list_title1'>
    <ul>
    </ul>
  </div>
  <div id='list_title2'>
    <ul>
    </ul>
  </div>
</div>
 
<?php $this->load->view("conponent/v_foot"); ?>