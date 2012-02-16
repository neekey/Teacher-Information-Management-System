<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 图片上传，修改等
 */
 
class Img extends MY_Controller {
  
  function __construct()
  {
    parent::__construct();
    // 载入模型
    $this->load->model(array('m_idcode', 'm_img', 'm_ajax'));
    // 载入文件上传类并初始化
    $this->load->library('upload', $this->data['upload']);
  }
  
  function upload()
  {
    if (!$this->upload->do_upload('input_upload'))
    {
        $this->_load_result($this->upload->display_errors());
    }
    else
    {
      // 获取上传的图片信息
      $img_info = $this->upload->data();
      $teacher_id_str = $this->input->post('teacher_id_str', true);
      // 构造图片条目信息
      $img = array(
          "teacher_id" => $this->m_idcode->id_decode($teacher_id_str),
          "type" => $img_info["file_type"],
          "path" => $img_info["full_path"],
          "description" => $this->input->post("image_description", TRUE));
      if(false !== ($img_id = $this->m_img->add($img, $img_info)))
      {
        // 对新的图片id进行加密
        $img_id_str = $this->m_idcode->id_encrypt($img_id);
        $img_url = $this->data['url']['img'] . 'show/' . $img_id_str;
        $this->m_ajax->response_ajax('img_upload', true, array('url' => $img_url));
      }
      
      // 若图片添加到数据库失败，则删除图片
      else 
      {
        unlink($img_info["full_path"]);
        $this->m_ajax->response_ajax('img_upload', false, array('error' => '图片上传失败！'));
      }
    }
  }
  
  function crop($id_str, $ori_width, $ori_height, $ori_x, $ori_y)
  {
    $id = $this->m_idcode->id_decode($id_str);
    $this->m_img->crop($id, $ori_width, $ori_height, $ori_x, $ori_y, $this->data['avator']['width'], $this->data['avator']['height']);
  }
  
  
  function show($id_str = null)
  {
    $this->_img_cache();
    // 若参数不存在或者不匹配则显示找不到图片
    if(null !== $id_str)
    {
      // 利用code进行解密，获得图片id号
      $id = $this->m_idcode->id_decode($id_str);
      if(FALSE === $this->m_img->show_by_id($id))
      {
        $this->_show_error();
      }
    }
    else 
      $this->_show_error();
  }
  
  
  
  /**
   * 显示“错误”图片并停止脚本的运行
   * 错误图片路经可以在config/setting文件中设置
   */
  function _show_error()
  {
    echo $this->m_img->show_by_path($this->data['path']['error_img'], 'image/jpeg');
    exit(0);
  }
  
  /**
   * 若第二次访问相同图片，则发送403给浏览器，让其使用浏览器缓存
   */
  function _img_cache()
  {
    if(isset($_SERVER["If-None-Match"]) && $_SERVER["If-None-Match"] === '"img"')
    {
      log_message("DEBUG", "IF PART!!!");
      header('Etag:'."img",true,304);
        exit(0);
    }
  }
}
