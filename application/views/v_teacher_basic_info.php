<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-1
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师基本信息编辑页面
 */
 ?>
 
  <?php echo form_open('email/send', array('id' => 'basic_info_form'));?>
    <p><label for='name'>姓名</label><input id='name' type='text' class='required' name='name' value='<?php echo $teacher_info['name'] ?>' /></p>
    <p><label for='sex' >性别</label><select id='sex' name='sex' value='<?php echo $teacher_info['sex'] ?>' class='required' >
        <option value="male" <?php if($teacher_info['sex'] === 'male') echo 'selected="selected"'; ?> >男</option>
        <option value="female" <?php if($teacher_info['sex'] === 'female') echo 'selected="selected"'; ?> >女</option>
      </select>
    <p>
      <label for='birthday_year'>生日</label>
      <!-- 用于存储时间戳的隐藏字段 -->
      <input type='hidden' class='required' name='birthday' id='birthday' value='<?php echo $teacher_info['birthday'] ?>' />
      <select id='birthday_year' name='birthday_year' value=''>
      </select>
      <select id='birthday_month' name='birthday_month' value=''>
      </select>
      <select id='birthday_day' name='birthday_day' value=''>
      </select>
    </p>
    <p>
      <label for='report_date_year'>就职时间</label>
      <!-- 用于存储时间戳的隐藏字段 -->
      <input type='hidden' class='required' name='report_date' id='report_date' value='<?php echo $teacher_info['report_date'] ?>' />
      <select id='report_date_year' name='report_date_year' value=''>
      </select>
      <select id='report_date_month' name='report_date_month' value=''>
      </select>
      <select id='report_date_day' name='report_date_day' value=''>
      </select>
    </p>
    <p><label for='cellphone' >手机</label><input type='text' id='cellphone' class='phone' name='cellphone' value='<?php echo $teacher_info['cellphone']; ?>' /></p>
    <p><label for='email'>邮箱</label><input id='email' type='text' class='email' name='email' value='<?php echo $teacher_info['email']; ?>' disabled></p>
    <p><label for='teac_rese_unit'>教研单位</label>
      <select id='teac_rese_unit' class='required' name='teac_rese_unit' selected='<?php echo $teacher_info['teac_rese_unit'] ;?>'>
        <?php foreach($item['tru'] as $tru){?>
          <option value='<?php echo $tru['id']; ?>' 
          <?php if($tru['id'] === $teacher_info['teac_rese_unit']){ echo 'selected= "selected" '; }?>>
          <?php echo $tru['name']; ?>[ <?php echo $tru['type_name']; ?> ]</option>
        <?php } ?>
      </select>
    </p>
    <p><label for='title1_type'>职称1</label>
      <select id='title1_type' class='required' name='title1_type' value='<?php echo $teacher_info['title1_type']; ?>'>
        <?php foreach($item['title1']['type'] as $title1_type){ ?>
          <option value='<?php echo $title1_type['id']; ?>'
          <?php if($title1_type['id'] === $teacher_info['title1_type']){ echo 'selected= "selected" '; } ?>>
          <?php echo $title1_type['name']; ?></option>
        <?php } ?>
      </select>
      <select id='title1_level' class='required' name='title1_level' value='<?php echo $teacher_info['title1_level']; ?>'>
        <?php foreach($item['title1']['level'] as $title1_level){ ?>
          <option value='<?php echo $title1_level['id']; ?>'
          <?php if($title1_level['id'] === $teacher_info['title1_level']){ echo 'selected= "selected" '; } ?>>
          <?php echo $title1_level['name']; ?></option>
        <?php } ?>
      </select>
    </p>
    <p><label for='title2'>职称2</label>
      <select id='title2' name='title2' value='<?php echo $teacher_info['title2']; ?>'>
        <?php foreach($item['title2'] as $title2){ ?>
          <option value='<?php echo $title2['id']; ?>'
          <?php if($title2['id'] === $teacher_info['title2']){ echo 'selected= "selected" '; } ?>>
          <?php echo $title2['name']; ?></option>
        <?php } ?>
      </select>
    </p>
    <p><label for='brief'>个人简介</label>
      <textarea id='brief' name='brief' class='required'><?php echo $teacher_info['brief']; ?></textarea>
    </p>
    <input type='hidden' id='teacher_id_str' value='<?php echo $teacher_info['id_str']; ?>' />
  </form>