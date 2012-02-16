<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-2-5
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 封装了添加新用户，删除用户的数据库操作
 * 检查用户名是否存在，用户名密码是否匹配等
 */

class M_user extends CI_Model
{
	/**
   * 用于作为查询的数据表
   */
  private $_table;
  
  /**
   * 用于标示用户类别
   * admin/teacher
   */
  private $_user_type = "admin";
	
	function __construct()
  {
      parent::__construct();
      $this->load->database();
      // 设置数据库查询表
      $this->_table = array(
        "admin" => "admin",
        "teacher" => "teacher"  
      );
  }
  
  /**
   * 设置用户类别，这在该模型的其他函数中
   * 若不手动设定，则默认为这个类别
   * @param <string> $user_type
   */
  function init($user_type)
  {
    $this->_user_type = $user_type;
  }
    
	/**
 	 * 检查用户名是否存在
 	 * @param <string> $username
   * @param <string> $user_type 用户类别 admin/teacher
 	 * @return <boolean> 存在：true 不存在：false
 	 */
  function check_username_exist($username, $user_type = null)
  {
    // 若用户类别不指定，则为$this->_user_type
    $user_type = ($user_type === null ? $this->_user_type : $user_type);
    
    if($user_type === 'teacher')
    {
      $this->db->where('email', $username);
    }
    else
    {
      $this->db->where('username', $username);
    }
    $query = $this->db->get($this->_table[$user_type]);
    if($query->num_rows() > 0)
    {
        return TRUE;
    }
    else return FALSE;
  }
  
  /**
 	 * 根据给定的id检查用户是否存在
 	 * @param <int> $id
   * @param <string> $user_type 用户类别 admin/teacher
 	 * @return <boolean> 存在：true 不存在：false
 	 */
  function check_id_exist($id, $user_type = null)
  {
    // 若用户类别不指定，则为$this->_user_type
    $user_type = ($user_type === null ? $this->_user_type : $user_type);
    
  	$this->db->where('id', $id);
    $query = $this->db->get($this->_table[$user_type]);
    if($query->num_rows() > 0)
    {
        return TRUE;
    }
    else return FALSE;
  }

  /**
   * 添加新用户
   * @param <array> $data
   * @param <string> $user_type 用户类别 admin/teacher
   * @return <int> 新用户的id
   */
  function insert_newuser($data, $user_type = null)
  {
    // 若用户类别不指定，则为$this->_user_type
    $user_type = ($user_type === null ? $this->_user_type : $user_type);
    
    $this->db->insert($this->_table[$user_type], $data);
    return $this->db->insert_id();
  }
  
  /**
   * 根据给定用户id删除用户
   * @param <int> $id
   */
  function remove_user($id, $user_type = null)
  {
    // 若用户类别不指定，则为$this->_user_type
    $user_type = ($user_type === null ? $this->_user_type : $user_type);
    
  	$this->db->where('id', $id);
	  $this->db->delete($this->_table[$user_type]); 
  }
  
  /**
   * 根据给定的条件搜索用户，返回用户列表
   * @param <array> $key_list
   * @return <array>
   */
  function search_user($key_list,  $user_type = null)
  {
    // 若用户类别不指定，则为$this->_user_type
    $user_type = ($user_type === null ? $this->_user_type : $user_type);
    
  	foreach ($key_list as $key)
  	{
      $this->db->or_like("username", $key);
  	}
  	$query = $this->db->get($this->_table[$user_type]);
  	if ($query->num_rows > 0) return $query->result_array();
  	else return false;
  }
  
  /**
   * 根据条件返回用户登录信息（id，用户名，密码）
   * @param <array> $condition
   * @return <mix> 成功：关联数组 失败：false
   */
  function get_login_info($condition, $user_type = null)
  {
    // 若用户类别不指定，则为$this->_user_type
    $user_type = ($user_type === null ? $this->_user_type : $user_type);
    
    $this->db->where($condition);
    $query = $this->db->get($this->_table[$user_type]);
    if($query->num_rows() == 0) return FALSE;
    else return $query->row_array();
  }
}
?>