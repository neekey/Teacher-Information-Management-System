<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-1
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师基本信息编辑页面
 */
?>

<div id='avator'>
  <img <?php if(isset($teacher_info['avator'])) {?> src='<?php echo $teacher_info['avator']; }?>' />
  <a href='#' class='avator_tip' ><?php if(isset($teacher_info['avator'])) echo '修改头像'; else echo '添加头像'; ?></a>
</div>
<div id='img_upload'>
  <div id='avator_crop' style='display:none;'>
    <p class='page_tip'>您可以通过在左侧图片中点击拖动鼠标来对您的图像进行裁剪。当您调整好头像后，请点击保存，保存您的修改。</p>
    <div id='preview'>
      <img />
    </div>
    <div id='avator_temp'>
      <img />
    </div>
    
    <input type='button' id='crop_save' value='保存'/>
  </div>
  <?php echo form_open_multipart($url['img'] . 'upload/', array('id' => 'avator_upload_form'));?>
    <label for='input_upload'>选择图片</label><input type='file' name='input_upload' id='input_upload' /><input type='hidden' name='teacher_id_str' value='<?php echo $teacher_info['id_str']; ?>'/><input type='button' value='上传'/>
    <p class='page_tip'>您可以上传 JPG、GIF 或 PNG 文件。 （上传的图片中请不要包含名人、裸体、艺术品或受版权保护的图像。）</p>
  </form>
  <input type='button' class='button2' id='avator_upload_close' value='取消'/>
</div>
