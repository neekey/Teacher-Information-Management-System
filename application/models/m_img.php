<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-27
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 封装图片的数据库操作主要为：
 * 图片的插入，图片信息修改（并非图片的处理）
 * 根据条件从数据库中读取相关图片信息
 * 删除图片
 * 对图片id进行封装生成用于显示的url等
 * 所有图片均转化为jpg格式保存，并以jpg格式输出
 */

class M_img extends CI_Model
{
  private $_table = 'pic';
  
  function __construct()
  {
    parent::__construct();
    $this->load->database();
    // 载入模型
    $this->load->model(array('m_idcode'));
    // 载入图像处理类
    $this->load->library(array('image_lib'));
  }
  
  /**
   * 显示图片，若图片不存在则返回false
   * @param <string> $id 图片id
   * @return <boolean> 
   */
  function show_by_id($id)
  {
    if(false !== ($img_info = $this->get_info(array('id' => $id))))
    {
      return $this->show_by_path($img_info['path'], $img_info['type']);
    }
    else
    {
      return false;
    }
  }
  
  /**
   * 显示图片，若图片不存在则返回false
   * @param <string> $path 图片路经或者url
   * @param <string> $type 图片的mime类型
   * @return <boolean> 
   */
  function show_by_path($path, $type)
  {
    if(false !== ($image = $this->read($path, $type)))
    {
      header('ETag: "img"');
      header('Content-type: ' . $type);
      imagejpeg($image, null, 100);
    }
    else
    {
      return false;
    }
  }
  
  /**
   * 根据文件绝对路径获取文件类型
   * @param <string> $path
   * @return <string> 图片的mime类型
   */
  function get_mime_by_path($path)
  {
  	$type = substr(strrchr($path, '.'), 1);
	switch($type)
	{
		case 'png':
		case 'gif':
		case 'bmp':
			$mime = 'image/' . $type;
			break;
		case 'jpg':
		case 'jpeg':
			$mime = 'image/jpeg';
			break;
		default:
			return false; 
	}
	return $mime;
  }
  
  /**
   * 读取指定路经图片，返回GD对象
   */
  function read($path, $type)
  {
    $img_type = substr($type, 6);
    switch($img_type)
    {
      case 'jpeg':
        return imagecreatefromjpeg($path);
      case 'gif':
        return imagecreatefromgif($path);
      case 'png':
        return imagecreatefrompng($path);
      default:
        return false;
    }
  }
  
  /**
   * 将图片保存为jpg格式
   * 删除源文件，写如新文件
   * 返回新的图像路经
   * 失败则返回false
   */
  function save($upload_info)
  {
    if(false !== ($image = $this->read($upload_info['full_path'], $upload_info['file_type'])))
    {
      // 删除原来的图像文件
      unlink($upload_info['full_path']);
      // 新的图片路经
      $new_path = $upload_info['file_path'] . $upload_info['raw_name'] . '.jpg';
      // 保存为jpg格式
      imagejpeg($image, $new_path, 100);
      return $new_path;
    }
    else return false;
  }
  
  
  /**
   * 获取图片信息
   * @param <array> $condition 用户查找pic表的条件
   * @return <mix> false: 若未指定条件或者图片不存在
   *    <array>: 图像信息
   */
  function get_info($condition = null)
  {
    if($condition !== null && ($query = $this->db->get_where('pic', $condition)) && $query->num_rows() !== 0)
    {
      return $query->row_array();
    }
    else
    {
      return false;
    }
  }
  
  /**
   * 添加图像, 返回新插入的图像id
   * @param <array> $img 新图像信息
   * @param <array> $upload_info 包含了图片的上传信息
   */
  function add($img, $upload_info)
  {
    $this->clear_img($img['teacher_id']);
    // 若上传时间没有设置，则默认添加当前时间
    if(!isset($img['post_time']))
    {
      $img['post_time'] = time();
    }
    if(FALSE !== ($img['path'] = $this->save($upload_info)))
    {
      $img['type'] = 'image/jpeg';
      if(FALSE !== $this->db->insert($this->_table, $img))
        return $this->db->insert_id();
    }
    else return false;
  }
  
  /**
   * 新的图片被添加前，查找teacher_id与新图片相同的条目，并且该条目的crop为0（未裁剪过）
   */
  function clear_img($teacher_id)
  {
    $condition = array('teacher_id' => $teacher_id, 'croped' => '0');
    $query = $this->db->get_where('pic', $condition);
    foreach($query->result_array() as $row)
    {
      // 删除图片文件
      unlink($row['path']);
      // 删除记录
      $this->db->delete('pic', array('id' => $row['id']));
    }
  }
  
  /**
   * 更新图像
   */
  function update($pic_info, $id)
  {
    $this->db->where('id', $id);
    return $this->db->update($this->_table, $pic_info);
  }
  
  /**
   * 根据id删除图像
   */
  function delete($id)
  {
    // 先获取图像信息（图像路经，用于删除）
    $pic_info = $this->get_info(array('id' => $id));
    if(FALSE !== $pic_info && $this->db->delete($this->_table, array('id' => $id)))
    {
      unlink($pic_info['path']);
      return TRUE;
    }
    else
    {
      return FALSE;
    }
  }
  
  /**
   * 进行图像裁剪
   * @param <string> $id 图片id
   * @param <int> $ori_width 原始图像裁剪区域的宽度
   * @param <int> $ori_height 原始图像裁剪区域的高度
   * @param <int> $ori_x 原始图像裁剪区域左上角x坐标
   * @param <int> $ori_y 原始图像裁剪区域友上角y坐标
   * @param <int> $new_width 裁剪后图像宽度
   * @param <int> $new_height 裁剪后图像高度
   * @return <boolen> 
   */
  function crop($id, $ori_width, $ori_height, $ori_x, $ori_y, $new_width, $new_height)
  {
    if(false !== ($img_info = $this->get_info(array('id' => $id))))
    {
      // 获取图片路经
      $filename = $img_info['path'];
      
      // Content type
      header('Content-type: image/jpeg');
      
      // 创造新的GD对象
      $image_p = imagecreatetruecolor($new_width, $new_height);
      // 根据图片路经创造GD对象
      $image = imagecreatefromjpeg($filename);
      // 对图像进行裁剪
      imagecopyresampled($image_p, $image, 0, 0, $ori_x, $ori_y, $new_width, $new_height, $ori_width, $ori_height);
      // 删除原图
      unlink($filename);
      // 将裁剪后的图像写入文件
      imagejpeg($image_p, $filename, 100);
      
      return true;
    }
    else return false;
  }
  
  
}