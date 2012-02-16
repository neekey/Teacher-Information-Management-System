<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-1
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师论文&科研项目信息编辑页面
 */
 ?>
 <div id='paper_container'>
   <h1>论文</h1>
   <p><a href='#paper_project_form' class='tab_2' id='add_paper'><input type='button' value='添加论文' class='button2' /></a></p>
   <ul id='paper_list'>
     <?php if(sizeof($paper) <= 0){ echo '<p>尚无任何论文记录！</p>';} ?>
     <?php foreach($paper as $p){ ?>
       <li id='<?php echo $p['id']; ?>' >
         <a href='#paper_project_form' class='tab_2' >
           <span class='name'><?php echo $p['name']; ?></span>
         </a><span class='post_date'><?php echo date('Y-m-d', $p['date']); ?></span><input type='button' value='删除' class='delete' />
       </li>
     <?php } ?>
   </ul>
 </div>
 <div id='project_container'>
   <h1>科研项目</h1>
   <p><a href='#paper_project_form' class='tab_2' id='add_project'><input type='button' value='添加项目' class='button2' /></a></p>
   <ul id='project_list'>
     <?php if(sizeof($project) <= 0){ echo '<p>尚无任何科研项目记录！</p>';} ?>
     <?php foreach($project as $p){ ?>
       <li id='<?php echo $p['id']; ?>'>
         <a href='#paper_project_form' class='tab_2' >
           <span class='name'><?php echo $p['name']; ?></span>
         </a><span class='post_date'><?php echo date('Y-m-d', $p['date']); ?></span><input type='button' value='删除' class='delete' />
       </li>
     <?php } ?>
   </ul>
 </div>
 <?php echo form_open('#', array('id' => 'paper_project_form'));?>
    <!-- 用来决定该表单的作用：编辑, 添加 paper_edit / paper_add / project_edit / project_add -->
    <input type='hidden' id='form_type' value='test' />
    <p>
      <label for='paper_project_name'>名称</label>
      <input type='text' id='paper_project_name' class='required' name='paper_project_name' />
    </p>
    <p>
      <label for='paper_project_date'>时间</label>
      <select id='paper_project_date_year' name='paper_project_date_year' value=''>
      </select>
      <select id='paper_project_date_month' name='paper_project_date_month' value=''>
      </select>
      <select id='paper_project_date_day' name='paper_project_date_day' value=''>
      </select>
      <!-- 用于存储时间戳的隐藏字段 -->
      <input type='hidden' class='required' name='paper_project_date' id='paper_project_date' />
    </p>
    <p>
      <label for='paper_project_brief'>简介</label>
      <textarea id='paper_project_brief' name='paper_project_brief' /></textarea>
    </p>
    <p>
      <input type='button' id='paper_project_close' name='paper_project_close' value='关闭' />
    </p>
 </form>
