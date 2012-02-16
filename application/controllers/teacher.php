<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 管理员首页
 */

class Teacher extends MY_Controller {

  /**
   * 用于存储职称教研所等信息
   */
  private $item;
  
  function __construct()
  {
    parent::__construct();
    // 载入模型
    $this->load->model(array('m_idcode', 'm_user', 'm_teacher_info', 'm_item'));
    
    // 权限检查
    $this->_auth_check();
    
    
  }
  
  function index(){
    
    // 对id进行解密
    $id = $this->user_info['id'];
    $id_str = $this->m_idcode->id_encrypt($id);
    // 检查id是否存在
    if($this->m_user->check_id_exist($id, 'teacher'))
    {
      // 配置css 和 js文件
      $this->_page_set(array(
        "title" => "教师个人中心",
        'js' => array('base/setting', 'model/m_ajax', 'helper/upload', 'admin/teacher_edit', 'jcrop/jcrop-min'),
        'css' => array('jcrop/jcrop', 'admin/teacher_edit')
      ));
      // 检查该教师是否处于激活状态
      if(($if_activated = $this->m_teacher_info->get_active($id)) === 'false'){
        $this->_add_js(array('admin/teacher_activitation'));
      };
      // 教师信息模型初始化
      $this->m_teacher_info->init($id);
    
      // 获取教师信息
      $this->data['teacher_info'] = $this->m_teacher_info->get_info();
      $this->data['teacher_info']['id_str'] = $id_str;
      // 若教师已经上传头像，则读取头像信息
      if($this->data['teacher_info']['pic_id'] !== null){
        $this->data['teacher_info']['avator'] = 
            $this->data['url']['img'] . 'show/' . $this->m_idcode->id_encrypt($this->data['teacher_info']['pic_id']);
        
      }
      // 获取职称，教研单位信息
      $this->data['item'] = $this->_get_item();
      // 获取论文信息
      $this->data['paper'] = $this->m_teacher_info->get_paper();
      // 获取科研项目信息
      $this->data['project'] = $this->m_teacher_info->get_project();
      
      $this->load->view('v_teacher_edit', $this->data);
    }
    else
    {
      $this->_load_result('您访问的页面不存在');
    }
  }
  
  /**
   * 登录以及权限验证, 重写了父类方法
   * @override
   */
  function _auth_check()
  {
    parent::_auth_check();
    if($this->user_type !== 'teacher')
    {
      $this->_load_result('您没有查看该页面的权限', $this->data['url']['login'], '请先登录！');
    }
  }
  
  /**
   * 教师信息编辑
   * @param <string> $id_str 进行了加密的教师id
   */
  function teacher_edit($id_str)
  {
    $this->_page_set(array(
      "title" => "教师信息",
      'js' => array('base/setting', 'model/m_ajax', 'admin/teacher_edit')
    ));
    
    // 对id进行解密
    $id = $this->m_idcode->id_decode($id_str);
    // 检查id是否存在
    if($this->m_user->check_id_exist($id, 'teacher'))
    {
      $this->m_teacher_info->init($id);
    
      // 获取教师信息
      $this->data['teacher_info'] = $this->m_teacher_info->get_info();
      $this->data['teacher_info']['id_str'] = $id_str;
      // 获取职称，教研单位信息
      $this->data['item'] = $this->_get_item();
      // 获取论文信息
      $this->data['paper'] = $this->m_teacher_info->get_paper();
      // 获取科研项目信息
      $this->data['project'] = $this->m_teacher_info->get_project();
      
      $this->load->view('v_teacher_edit', $this->data);
    }
    else
    {
      $this->_load_result('您访问的页面不存在');
    }
    
  }
  
  /**
   * 获取职称，教研单位信息
   * 赋值给$this->item
   * @return <array> $this->item
   */
  function _get_item()
  {
    $title1 = $this->m_item->get_title1();
    $title2 = $this->m_item->get_title2();
    $tru = $this->m_item->get_tru();
    $this->item = array(
      'title1' => $title1,
      'title2' => $title2,
      'tru' => $tru
    );
    
    return $this->item;
  }
  
  /**
   * 
   */
  function _teacher_info_handle($teacher_info)
  {
    // 处理生日
    $birthday = getdate($teacher_info['birthday']);
    $teacher_info['birthday_year'] = $birthday['year'];
    $teacher_info['birthday_month'] = $birthday['mon'];
    $teacher_info['birthday_day'] = $birthday['mday'];
    
    // 处理入职时间
    $report_date = getdate($teacher_info['report_date']);
    $teacher_info['report_date_year'] = $report_date['year'];
    $teacher_info['report_date_month'] = $report_date['mon'];
    
    return $teacher_info;
  }
}
