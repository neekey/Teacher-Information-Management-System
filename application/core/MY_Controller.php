<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

  /**
   * 用户是否已经登录
   * @var <boolen>
   */
  protected $login = False;
  
  /**
   * 用户类型
   * 管理员或者老师
   * @var <mix> 未登录： null 登录: <string> "admin"/"teacher"
   */
   protected $user_type = null;
   
  /**
   * 教师基本信息
   * @var <mix> 未登录：null 登录：array
   */
  protected $user_info = null;
  
  /**
   * 存储页面的链接信息，页面相对地址，js，css等。
   * 一般作为传入view的数据参数
   * @var <array> (
   *  login,
   *  urer_type,
   *  user_info,
   *  path
   *  url
   *  page
   *    title,
   *    default_js,
   *    default_css,
   *    
   * )
   */
  protected $data;
  
  
  function __construct()
  {
    parent::__construct();
    
    // 默认载入的helper
    $this->load->helper(array('url', 'form'));
    // 默认载入的model
    $this->load->model(array('m_auth'));
    // 载入配置文件
    $this->data = $this->config->item('setting');
    
    // 判断用户是否已经登录
    if($this->m_auth->has_login())
    {
      $this->login = TRUE;
      $user = $this->m_auth->get_user_info();
      $this->user_type = $user["type"];
      $this->user_info = $user["info"];
    }
    else
    {
      $this->login = False;
    }
    
    $this->data["login"] = $this->login;
    $this->data["user_type"] = $this->user_type;
    $this->data["user_info"] = $this->user_info;
  }
  
  /**
   * 用来手动设置页面标题
   * @param <string> $title
   */
  function _set_title($title)
  {
    $this->data["page"]["title"] = $title;
  }
  
  /**
   * 添加js文件
   */
  function _add_js($js_array)
  {
    foreach($js_array as $js)
    {
      // 若该文件不存在
      if(!in_array($js, $this->data["page"]["js"]))
      {
        $this->data["page"]["js"][] = $js;
      }
    }
  }
  
  /**
   * 添加css文件
   */
  function _add_css($css_array)
  {
    foreach($css_array as $css)
    {
      // 若该文件不存在
      if(!in_array($css, $this->data["page"]["css"]))
      {
        $this->data["page"]["css"][] = $css;
      }
    }
  }
  
  /**
   * 取消css 或者 js文件
   */
  function _remove_cssjs($type, $str)
  {
    $key = array_search($str, $this->data["page"][$type]);
    array_splice($this->data["page"][$type], $key, 1);
  }
  
  /**
   * 设置页面信息
   * @param <array> $page_info (
   *  title <string> 页面标题
   *  js <array> 载入的js文件 
   *  css <array> 载入的css文件
   * )
   * 注意，这里的js和css是直接作为$this->data['page']['js']或者css 而不是添加
   * 三个数据都可选
   */
  function _page_set($page_info)
  {
    // 设置页面标题
    if(!empty($page_info["title"]))
    {
      $this->_set_title($page_info["title"]);
    }
    // 设置js
    if(!empty($page_info["js"]))
    {
      $this->data["page"]["js"] = $page_info["js"];
    }
    // 设置css
    if(!empty($page_info["css"]))
    {
      $this->data["page"]["css"] = $page_info["css"];
    }
  }
  
  /**
   * 检查是否登录，否则跳转到登录页面
   */
  function _auth_check()
  {
    if(FALSE === $this->login)
      redirect($this->data['url']['login']);
  }
  
  /**
   * 用于操作完成后显示结果
   * 由参数默认值可知，若不给定第二和第三个参数，则页面将链接到首页。
   * 并且会自动将第一个参数作为页面title
   * @param <string> $result_msg
   * @param <string> $redirect_url
   * @param <string> $redirect_title
   */
  function _load_result($result_msg = "您的操作结束", $redirect_url = null, $redirect_title = "返回首页")
  {
    $this->_page_set(array(
        "title" => $result_msg,
        'js' => array(),
        'css' => array('admin/login')
      ));
    if (null === $redirect_url) 
      $redirect_url = $this->data['url']['base'];
      
    $this->data['page']['result_msg'] = $result_msg;
    // 设置页面标题
    $this->_set_title($result_msg);
    
    $this->data['page']["redirect_url"] = $redirect_url;
    $this->data['page']["redirect_title"] = $redirect_title;
    $this->load->view("v_result", $this->data);
  }
  
}