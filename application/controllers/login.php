<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 教师和管理员的登录页面
 */

class Login extends MY_Controller {

  function __construct()
  {
    parent::__construct();
    $this->load->library('form_validation');
    $this->data['page']['default_css'] = array('common/reset', 'common/globle-style');
    $this->_page_set(array(
      "title" => "login",
      'css' => array('admin/login'),
      'js' => array('admin/login')
    ));
  }

  function index()
  {
    
    if($this->login === TRUE){
      if($this->user_type === 'teacher'){
        redirect('teacher/');
      }
      else{
        redirect('admin/');
      }
    }
    else{
      $this->load->view("v_login", $this->data);
    }
  }
  
  /**
   * 用户提交登录表单
   * 成功登录后将重定向到首页
   */
  function submit()
  {
    // 检查用户是否提交了表单
    if(isset($_POST))
    {
      // 导入model 并根据post中的user_type初始化模型
      $this->load->model(array('m_user'));
      $this->user_type = $this->input->post('user_type', TRUE);
      $this->m_user->init($this->user_type);
      
      // 若表单有误，返回注册页面
      if(!$this->_form_check())
      {
          $this->load->view('v_login', $this->data);
      }
      // 若表单正确
      else
      {
          // 登录
          $this->m_auth->login(array(
            "type" => $this->data['user_type'] = $this->user_type,
            "info" => $this->data['user_info'] = $this->user_info
          ));
          $this->data['login'] = $this->login = TRUE;
          if($this->user_type === 'teacher'){
            redirect('teacher/');
          }
          else{
            redirect('admin/');
          }
      }
    }
    else
    {
      redirect("login");
    }
    
  }
  
  /**
   * 对提交的表单进行验证
   * 在该函数中设置表单验证规则
   * @return <boolen> 正确：true 错误：false
   */
  function _form_check()
  {
    // 定义表单验证规则
    $rules = array(
       array(
             'field' => 'user_type',
             'label' => 'User Type',
             'rules' => 'required'
       ),
       array(
             'field'   => 'username',
             'label'   => 'Username',
             'rules'   => 'required|callback__username_check'
       ),
       array(
             'field'   => 'password',
             'label'   => 'Password',
             'rules'   => 'required|callback__user_check'
       )
    );

    // 设置规则
    $this->form_validation->set_rules($rules);
    $this->form_validation->set_message('required', '该字段不能为空！');
    $this->form_validation->set_error_delimiters('<p class="input_tip tip">', '</p>');

    if(!$this->form_validation->run())
    {
        return FALSE;
    }
    else
    {
        return TRUE;
    }
  }
    
  /**
   * 验证用户名是否存在
   * 在该函数中设置用户名存在时的错误提示
   * @param <string> $username
   * @return <boolen> 存在：false 不存在：true
   */
  function _username_check($username)
  {
    // 检查用户类型是否有误
    if($this->user_type === FALSE || ($this->user_type !== 'admin' && $this->user_type !== 'teacher'))
    {
      $this->form_validation->set_message('_username_check', '');
      return FALSE;
    }
    // 检查用户是否存在
    if(!$this->m_user->check_username_exist($username))
    {
      $this->form_validation->set_message('_username_check', '用户名不存在!');
      return FALSE;
    }
    else return TRUE;
  }
    
  /**
   * 验证用户密码和用户名是否匹配
   * 若匹配则将用户信息赋给成员变量$this->user_info
   * @param <string> $password
   * @return <boolen> 匹配：true 不匹配：false
   */
  function _user_check($password)
  {
    // 检查用户类型是否有误
    if($this->user_type === FALSE || ($this->user_type !== 'admin' && $this->user_type !== 'teacher'))
    {
      $this->form_validation->set_message('_username_check', '');
      return FALSE;
    }
    
    // 构造登录信息查询条件
    $condition = array("password" => $password);
    
    // 若用户为教师，则其用户名为email
    if($this->user_type === 'teacher')
    {
      $condition['email'] = $this->input->post("username", TRUE);
    }
    else 
    {
      $condition['username'] = $this->input->post("username", TRUE);
    }
    
    // 检查用户名与密码是否匹配
    if(FALSE !== ($this->user_info = $this->m_user->get_login_info($condition)))
    {
      return TRUE;
    }
    else 
    {
      $this->form_validation->set_message('_user_check', '密码错误！');
      return FALSE;
    }
  }
    
  /**
   * 用户登出
   * 处理用户注销，成功后显示跳转页
   */
  function logout()
  {
    // 设置页面标题
    $this->_page_set(array(
      "title" => "注销成功"
    ));
    $this->m_auth->logout();
    $this->_load_result("注销成功！", $this->data['url']['login']);
  }
}
