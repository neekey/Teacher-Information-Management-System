<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 用于进行ajax数据交互的控制器
 */

class Ajax extends MY_Controller {
  
  /**
   * ========================================================
   * ajax数据传输说明：
   * ========================================================
   * 
   * 一般从服务器端发送过来的数据经过model处理后为ajax_data:(
   *  type 操作类型
   *  data 数据
   * )
   * 
   * 每次对浏览器的回复 response_data 包括：(
   *  type 操作类型
   *  result 操作结果
   *  data 返回的数据
   *    若 result为false 则在data中必须有error作为错误原因
   * ) 这个封装的过程由model来完成
   * 
   * 另外所有对教师的操作都需要提供教师的id字符串，即在data中需要包换id_str
   * 控制器通过id_str来进行权限验证
   */
  
  /**
   * 经过model处理过的来自浏览器的ajax信息
   */
  private $ajax_data;
  
  function __construct()
  {
    parent::__construct();
    $this->load->model(array('m_ajax', 'm_item', 'm_idcode', 'm_teacher_info', 'm_user', 'm_img'));
    
    // 如果不是ajax请求，如用户直接访问该页面
    if($this->m_ajax->check_ajax() === FALSE){
      $this->_load_result("您访问的页面不存在!");
    }
    
    // 获得ajax数据
    $this->ajax_data = $this->m_ajax->get_ajax();
    
  }
  
  /**
   * 教师信息的修改和获取
   */
  function teacher_info()
  {
    // 检查用户是否登录
    $this->_auth_check($this->ajax_data['type']);
    
    // 获得ajax数据
    $type = $this->ajax_data['type'];
    $data = $this->ajax_data['data'];
    $id_str = $data['id_str'];
    $id = $this->m_idcode->id_decode($id_str);
    
    // 验证用户权限是否充足
    if($this->user_type !== 'admin')
    {
      if(intval($this->user_info['id']) !== $id)
      {
        echo $this->user_info['id'];
        $this->m_ajax->ajax_error($type, '权限有误，您无法进行该操作！');
      }
    }
    
    $result_data = array('error' => null);
    switch($type){
      /**
       * 更新教师信息
       * data (
       *  id_str 教师id_str,
       *  update 教师的更新信息 数组 *数组索引值与数据库中字段对应*
       * )
       */
      case 'update': {
        $update = $data['update'];
        $result = ($this->m_teacher_info->update($update, $id) === TRUE) ? true : false;
        break;
      }
      /**
       * 更新教师论文项目信息
       * data (
       *  update 项目或者论文的更新信息 数组 *数组索引值与数据库中字段对应*
       *  type 论文还是项目 paper / project
       *  id 论文或者项目id
       * )
       */
      case 'update_other': {
        $result = ($this->m_teacher_info->update_other($data['update'], $data['type'], $data['id']) === TRUE) ? true : false;
        break;
      }
      /**
       * 添加论文或者项目信息
       * data (
       *  add_data 
       *  id_str 教师id_str,
       *  type 论文还是项目 paper / project
       * )
       */
      case 'add_other': {
        $data['add_data']['teacher_id'] = $id;
        $result = $this->m_teacher_info->add_other($data['type'], $data['add_data']);
        if( $result !== FALSE)
        {
          $result_data['id'] = $result;
          $result = TRUE;
        }
        else
        {
          $result = FALSE;
        }
        break;
      }
      /**
       * 获取教师论文项目信息
       * data (
       *  type 论文还是项目 paper / project
       *  id_str 教师id_str,
       *  id 论文或者项目id
       * )
       */
      case 'get_other': {
        if($data['type'] === 'paper'){
          $paper_data = $this->m_teacher_info->get_paper(array('id' => $data['id']));
          if(sizeof($paper_data) <= 0)
          {
            $result = FALSE;
            $result_data['error'] = '您查找的数据不存在！';
          }
          else 
          {
            $result = TRUE;
            $result_data['data'] = $paper_data[0];
          }
        }
        else if($data['type'] === 'project'){
          $project_data = $this->m_teacher_info->get_project(array('id' => $data['id']));
          if(sizeof($project_data) <= 0)
          {
            $result = FALSE;
            $result_data['error'] = '您查找的数据不存在！';
          }
          else 
          {
            $result = TRUE;
            $result_data['data'] = $project_data[0];
          }
        }
        else {
          $result = FALSE;
          $result_data['error'] = '错误的操作类型！';
        }
        break;
      }
      /**
       * 删除教师论文项目信息
       * data (
       *  id_str 教师id_str,
       *  id 项目id
       *  type 类型
       * )
       */
      case 'delete_other': {
        $result = $this->m_teacher_info->delete_other($data['id'], $data['type']);
        break;
      }
      /**
       * 更新教师密码
       * data (
       *  id_str 教师id_str,
       *  password 更新的密码
       * )
       */
      case 'update_password': {
        $result = $this->m_teacher_info->update_password($id, $data['password']);
        break;
      }
      /**
       * 图像裁剪
       * data (
       *  id_str 教师id_str
       *  pic_id_str 图像id_str
       *  ori_width 原始图像裁剪区域的宽度
       *  ori_height 原始图像裁剪区域的高度
       *  ori_x 原始图像裁剪区域左上角x坐标
       *  ori_y 原始图像裁剪区域友上角y坐标
       * )
       */
      case 'avator_crop': {
        $pic_id = $this->m_idcode->id_decode($data['pic_id_str']);
        $teacher_id = $this->m_idcode->id_decode($data['id_str']);
        
        $result = $this->m_img->crop($pic_id, $data['ori_width'], $data['ori_height'], $data['ori_x'], $data['ori_y'], $this->data['avator']['width'], $this->data['avator']['height']);
        // 若图像裁剪成功
        if($result !== FALSE)
        {
          // 获取教师信息（教师当前的头像id号，若存在 则将原先图像删除）
          $teacher_info = $this->m_teacher_info->get_info(array('id' => $teacher_id));
          
          $this->m_img->update(array('croped' => 1), $pic_id);
          $this->m_teacher_info->update(array('pic_id' => $pic_id), $teacher_id);
          
          // 一定要在教师信息被更新后删除，因为图片id为外键
          if($teacher_info['pic_id'] !== null)
          {
            $this->m_img->delete($teacher_info['pic_id']);
          }
        }
        break;
      }
      case 'teacher_active':{
        if(($result = $this->m_teacher_info->active($this->user_info['id'])) !== true){
          $result = false;  
          $result_data['error'] = '教师激活失败[数据库修改操作失败]！';
        }
        break;
      }
      default: {
        $result = false;
        $result_data['error'] = '无法识别的操作类型！';
      }
    }
    $this->m_ajax->response_ajax($type, $result, $result_data);
  }
  
  /**
   * 教师搜索
   */
  function search()
  {
    /**
     * ajax_data: (
     *  type: 'search'
     *  data: (
     *    condition
     *  )
     * )
     */
    $type = $this->ajax_data['type'];
    $data = $this->ajax_data['data'];
    
    // 验证用户权限是否充足
    if($this->user_type !== 'admin')
    {
      $this->m_ajax->ajax_error($type, '权限有误，您无法进行该操作！');
    }
    $result_data = array(
      'error' => null,
      'list' => $this->m_teacher_info->search_teacher($data['condition']));
    $result_data['list'] = $this->_handle_search_result($result_data['list']);
    
    $this->m_ajax->response_ajax($type, true, $result_data);
  }
  
  /**
   * 添加教师
   */
  function add_teacher(){
    // 验证用户权限是否充足
    if($this->user_type !== 'admin')
    {
      $this->m_ajax->ajax_error($type, '权限有误，您无法进行该操作！');
    }
    
    /**
     * ajax_data: (
     *  type: 'add_teacher'
     *  data: (
     *    email
     *    name
     *  )
     * )
     */
    $type = $this->ajax_data['type'];
    $data = $this->ajax_data['data'];
    $result_data = array('error' => null);
    
    if($this->m_user->check_username_exist($data['email'], 'teacher') === FALSE)
    {
      $new_id = $this->m_user->insert_newuser($data, 'teacher');
      // 对id进行加密
      $new_id_str = $this->m_idcode->id_encrypt($new_id);
      
      $result_data['id_str'] = $new_id_str;
      $result = true;
    }
    else
    {
      $result_data['error'] = $data['email'] . '已经存在!';
      $result_data['error_type'] = 'email_exist';
      $result = false;
    }
    $this->m_ajax->response_ajax($type, $result, $result_data);
  }
  
  /**
   * 用于信息项目的数据操作
   */
  function item(){
    // 验证用户权限是否充足
    if($this->user_type !== 'admin')
    {
      $this->m_ajax->ajax_error($type, '权限有误，您无法进行该操作！');
    }
    
    /**
     * ajax_data: (
     *  type: 'add_teacher'
     *  data: (
     *    type: 用于说明是对哪个项目的操作，如title1_type, tru_place 等
     *    id: item的id（添加操作除外）
     *    name: 在添加和更新时的数据
     *    type_id: (当进行tru_place的插入操作时)
     *  )
     * )
     */
    $type = $this->ajax_data['type'];
    $data = $this->ajax_data['data'];
    $result_data = array('error' => null);
    
    switch($type)
    {
      case 'update':
        $result = $this->m_item->update($data['type'], $data['id'], $data['name']);
        break;
      case 'add':
        if($data['type'] === 'tru_place')
        {
          $result = $this->m_item->add_tru_place($data['name'], $data['type_id']);
        }
        else 
        {
          $result = $this->m_item->add($data['type'], $data['name']);
        }
        if($result !== FALSE)
        {
          $result_data['id'] = $result;
          $result = TRUE;
        }
        break;
      case 'delete':
        $result = $this->m_item->delete($data['type'], $data['id']);
        break;
      case 'get':
        $result = $this->m_item->get_tru_place($data['type_id']);
        if(sizeof($result) !== FALSE){
          $result_data['data'] = $result;
          $result = TRUE;
        }
        else
        {
          $result = FALSE;
        }
    }
    
    $this->m_ajax->response_ajax($type, $result, $result_data);
  }
  
  /**
   * 处理教师搜索结果
   * 将密码等重要信息删除
   */
  function _handle_search_result($result){
    for($i = 0; $i < sizeof($result); $i++)
    {
      $keys = array_keys($result[$i]);
      foreach($keys as $key){
        if(($key !== 'id') && ($key !== 'name') && ($key !== 'sex') && ($key !== 'teac_rese_unit') && ($key !== 'brief')){
          unset($result[$i][$key]);
        }
        // 对id进行加密
        if($key === 'id'){
          $result[$i][$key] = $this->m_idcode->id_encrypt($result[$i][$key]);
        }
      }
    }
    
    return $result;
  }
  /**
   * 登录以及权限验证, 重写了父类方法
   * @override
   */
  function _auth_check($type)
  {
    if($this->login === FALSE)
    {
      $this->m_ajax->ajax_error($type, '您尚未登录，没有进行操作的权限!');
    }
  }
  
}
