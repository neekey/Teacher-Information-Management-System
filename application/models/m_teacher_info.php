<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-11
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 教师信息的读取修改等
 */

class M_teacher_info extends CI_Model
{
  /**
   * 用于作为查询的数据表
   */
	private $_table = "teacher";
  
  /**
   * 设置用户ID
   */
  private $_id = null;
	
	function __construct()
  {
      parent::__construct();
      $this->load->database();
  }

  /**
   * 设置用户类别，这在该模型的其他函数中
   * 若不手动设定，则默认为这个类别
   * @param <string> $user_type
   */
  function init($id)
  {
    $this->_id = $id;
  }
  
  /**
   * 根据教师id更新用户信息
   * @param <int> $id
   * @param <array> $userinfo	包含需更新的用户信息
   * @return <boolen> 成功：true 失败：false
   */
  function update($userinfo, $id = null)
  {
    // 若用户id不指定，则为$this->_id
    $id = ($id === null ? $this->_id : $id);
    
    $this->db->where('id', $id);
    return $this->db->update($this->_table, $userinfo);
  }
  
  /**
   * 根据论文或者项目id论文或者项目信息
   * @param <array> 包含需要更新的信息
   * @param <string> 更新的数据类型 'paper' || 'project'
   * @param <int> $id 论文或者项目
   * @return <boolen> 成功：true 失败：false
   */
  function update_other($update_info, $type, $id)
  {
    // 若用户id不指定，则为$this->_id
    $id = ($id === null ? $this->_id : $id);
    if($type === 'paper' || $type === 'project')
    {
      $this->db->where('id', $id);
      return $this->db->update($type, $update_info);
    }
    else
    {
      return false;
    }
  }
  
  /**
   * 根据条件获取教师信息
   * 获取一条教师信息！！
   * 
   * @param <array> $condition
   * @return <mix> 成功：关联数组 失败：false
   */
  function get_info($condition = null)
  {
    // 若条件不指定，则默认获取id为$this->_id的教师信息 
    if($condition === null){
      $condition = array('id' => $this->_id);
    }
    $this->db->where($condition);
    $query = $this->db->get($this->_table);
    if($query->num_rows() == 0) return FALSE;
    return $query->row_array();
  }
  
  /**
   * 根据给定的条件搜索教师,若不指定条件则将返回所有教师数据
   * 其中 对教师名称进行模糊（like）搜索
   */
  function search_teacher($condition = null)
  {
    if($condition !== null)
    {
      if(array_key_exists('name', $condition))
      {
        $this->db->like('name', $condition['name']); 
        unset($condition['name']);
      }
      $this->db->where($condition);
    }
    $query = $this->db->get($this->_table);
    return $query->result_array();
  }
  
  /**
   * 获取教师的论文信息
   * @param <array> $condition
   * @return <array> 若没有论文则返回空数组
   */
  function get_paper($condition = null){
    // 若条件不指定，则默认获取id为$this->_id的教师信息 
    if($condition === null){
      $condition = array('teacher_id' => $this->_id);
    }
    $this->db->where($condition);
    $query = $this->db->get('paper');
    return $query->result_array();
  }
  
  /**
   * 获取教师的科研项目信息
   * @param <array> $condition
   * @return <array> 若没有项目则返回空数组
   */
  function get_project($condition = null){
    // 若条件不指定，则默认获取id为$this->_id的教师信息 
    if($condition === null){
      $condition = array('teacher_id' => $this->_id);
    }
    $this->db->where($condition);
    $query = $this->db->get('project');
    return $query->result_array();
  }
  
  /**
   * 添加教师的论文或者项目信息
   * @param <string> $type 类型 paper/ project
   * @param <array> $data (
   *  teacher_id
   *  name
   *  brief
   *  date
   * )
   * @return <mix> 成功返回id 否则 false
   */
  function add_other($type, $data){
    if($this->db->insert($type, $data) !== FALSE)
    {
      return $this->db->insert_id();
    }
    else
    {
      return FALSE;
    }
  }
  
  /**
   * 删除教师的论文或者项目信息
   * @param <string> id
   * @param <string> type
   * @return <boolen> 
   */
  function delete_other($id, $type){
    if($this->db->delete($type, array('id' => $id)))
    {
      return TRUE;
    }
    else
    {
      return FALSE;
    }
  }
  
  /**
   * 修改教师的密码
   * @param <string> $id
   * @param <string> $password
   */
  function update_password($id, $password)
  {
    // 若用户id不指定，则为$this->_id
    $id = ($id === null ? $this->_id : $id);
    $update_info = array('password' => $password);
    $this->db->where('id', $id);
    return $this->db->update('teacher', $update_info);
  }
  
  /**
   * 教师激活，将教师的activited属性设置为true
   * @param <string> $id 教师id
   */
  function active($id){
    // 若用户id不指定，则为$this->_id
    $id = ($id === null ? $this->_id : $id);
    $update_info = array('activated' => true);
    $this->db->where('id', $id);
    return $this->db->update('teacher', $update_info);
  }
  
  /**
   * 获取教师的激活信息
   */
  function get_active($id){
    $teacher_info = $this->get_info(array('id' => $id));
    return $teacher_info['activated'];
  }
}
?>