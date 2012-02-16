<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-2-6
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 检查用户是否登录，处理用户登录，登出，以及从session中获取用户信息等。
 */

class M_auth extends CI_Model {

	/**
	 * 
	 * 用于存储用户信息
	 * @var <mix> 未设置：null 登录：<array>(
   *  type 用户类型
   *  info 用户信息
   * )
	 */
	private $_user;

	/**
	 * 
	 * 用于判断是否登录
	 * @var <mix> 未设置：null 登录：true 未登录：false
	 */
	private $_login = NULL;

	/**
	 * 
	 * CI实例
	 * @var <class>
	 */
	private $_CI;

	/**
	 * 
	 * 构造函数，初始化以及从session中读取用户数据
	 */
	function __construct()
	{
		parent::__construct();

		// 链接数据库
		$this->load->database();

		// 实例化CI
		$this->_CI = & get_instance();

		// 载入相关模型，类库以及helper
		$this->load->helper('url');
		$this->load->library('session');

		// 从session中获取用户信息
		$this->_user = unserialize($this->session->userdata('user'));
	}

	/**
	 * 判断用户是否已经登录
	 * @return <boolen> 登录：true 未登录：false
	 */
	function has_login()
	{
		// 如果_login 已经设置过
		if (NULL !== $this->_login)
		{
			return $this->_login;
		}
		// 如果_login 尚未设置(即尚未进行登录判断)
		else
		{
			// 判断session中是否存在用户信息
			if(!empty($this->_user) && NULL !== $this->_user['info']['id'])
			{
				return ($this->_login = TRUE);
			}
			return ($this->_login = FALSE);
		}
	}

	/**
	 * 处理用户登出
	 */
	function logout()
	{
		$this->session->sess_destroy();
	}

	/**
	 * 用于在确认用户的登录状态后，读取用户的数据
   * @return <mix> 若用户未登录： false 已经登录：<array>
	 */
	function get_user_info()
	{
	  if($this->_login !== TRUE){
	    return FALSE;
	  }
		return $this->_user;
	}

	/**
	 * 处理用户的登录
	 * @param <array> $user
	 */
	function login($user)
	{
		// 获取用户信息
		$this->_user = $user;
		$this->set_session();
	}

	/**
	 * 设置session
	 */
	function set_session()
	{
		// 将用户信息序列化
		$session_data = array('user' => serialize($this->_user));
		$this->session->set_userdata($session_data);
	}
  
  /**
   * 获取当前的用户sessino信息
   */
  function get_session()
  {
    return unserialize($this->session->userdata('user'));
  }
}

?>
