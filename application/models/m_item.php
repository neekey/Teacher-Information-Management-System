<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-11
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 职称，教研所等的相关操作
 */

class M_item extends CI_Model{
  function __construct()
  {
    parent::__construct();
    $this->load->database();
  }
  
  /**
   * 检查指定类型和id的项目是否存在
   * @param <string> $type 项目类型 （表明）
   * $param <string> $id 项目id
   * @return <boolen>
   */
  function is_exist($type, $id)
  {
    
    $this->db->where(array('id' => $id));
    $query = $this->db->get($type);
    if($query->num_rows() > 0)
    {
        return TRUE;
    }
    else return FALSE;
  }
  
  /**
   * 获取职称一的信息
   * @return <array> (
   *  type
   *  level
   * )
   */
  function get_title1()
  {
    $type = $this->db->get('title1_type');
    $level = $this->db->get('title1_level');
    $title1 = array(
      'type' => $type->result_array(),
      'level' => $level->result_array()
    );
    
    return $title1;
  }
  
  /**
   * 获取职称二的信息
   * @return <array> 
   */
  function get_title2()
  {
    $title2 = $this->db->get('title2');
    return $title2->result_array();
  }
  
  /**
   * 获取教研所信息
   */
  function get_tru()
  {
    $this->db->select('tru_place.id, tru_place.name, tru_type.name type_name');
    $this->db->join('tru_type', 'tru_type.id = tru_place.type_id');
    $tru = $this->db->get('tru_place');
    return $tru->result_array();
  }

  /**
   * 获取教研所类别
   */
  function get_tru_type()
  {
    $tru = $this->db->get('tru_type');
    return $tru->result_array();
  }
  
  /**
   * 获取教研所类别
   * @param <string> 教研所类型id 可选
   * @return <array> 
   */
  function get_tru_place($type_id = '')
  {
    if($type_id !== ''){
      $this->db->where(array('type_id' => $type_id));
    }
    $tru = $this->db->get('tru_place');
    return $tru->result_array();
  }
  
  /**
   * 更新项目
   * @param <string> $type 项目类型（表名）
   * @param <string> $id 项目条目id
   * @param <string> $name 新的项目名称
   * @return <boolen>
   */
  function update($type, $id, $name)
  {
    $update = array('name' => $name);
    $this->db->where('id', $id);
    return $this->db->update($type, $update);
  }
  
  /**
   * 添加项目（不能用于添加tru_place)
   * @param <string> $type 项目类型（表名）
   * @param <string> $name 新的项目名称
   * @return <mix> 成功返回id 否则 false
   */
  function add($type, $name)
  {
    $new = array('name' => $name);
    if($this->db->insert($type, $new) !== FALSE)
    {
      return $this->db->insert_id();
    }
    else
    {
      return FALSE;
    }
  }
  
  /**
   * 添加项目（tru_place)
   * @param <string> $name 新的项目名称
   * @param <string> $type_id 项目类型id
   * @return <mix> 成功返回id 否则 false
   */
  function add_tru_place($name, $type_id)
  {
    // 检查类型id是否存在
    if($this->is_exist('tru_type', $type_id) !== FALSE)
    {
      $new = array('name' => $name, 'type_id' => $type_id);
      if($this->db->insert('tru_place', $new) !== FALSE)
      {
        return $this->db->insert_id();
      }
      else
      {
        return FALSE;
      }
    }
    else 
    {
      return FALSE;
    }
  }
  
  /**
   * 删除项目
   * @param <string> $type 项目类型
   * @param <string> $id 项目id
   * @return <boolen> 
   */
  function delete($type, $id)
  {
    if($this->db->delete($type, array('id' => $id)))
    {
      return TRUE;
    }
    else
    {
      return FALSE;
    }
  }
  
}
