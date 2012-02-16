<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * 2011-3-5
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 作为ajax操作相关的操作
 */
 
 class M_ajax extends CI_Model
 {
   function __construct()
   {
     parent::__construct();
   }
   
   /**
   * 检查是否由javascript发起的ajax请求
   * 检查header中的 http_type 字段是否存在并未ajax
   * @return <boolen> 
   */
  function check_ajax()
  {
    // 获得request的header信息
    // $headers = apache_request_headers();
    // $headers['http_type'] = 'ajax'
    // 以上方法只能用于php以apache modual 安装的环境
    
    if(isset($_SERVER['HTTP_HTTP_TYPE']) && "ajax" === $_SERVER['HTTP_HTTP_TYPE'])
    {
      return true;
      // log_message("DEBUG", "ajax request!") ;
    }
    else
    {
      return false;
      // log_message("DEBUG", "WRONG request!");
    }
  }
  
  /**
   * 检验是否为ajax请求，获取ajax请求信息，以关联数组返回
   * @return <mix>
   * false: 不为ajax请求
   * $ajax_request: （
   *  "type" : 操作请求类型
   *  "data" : 实际请求数据
   * ）
   */
  function get_ajax()
  {
    // 若为ajax请求
    if($this->check_ajax())
    {
      // 若请求格式正确
      // _POST["data"]: json的字符串，用于存储实际数据
      // _POST["type"]: 请求类型
      if(($data_json = $this->input->post("data", true)) && ($type = $this->input->post("type", true)))
      {
        // 将json数据转化为关联数组
        //$date_array = json_decode($data_json, true);
        $ajax_request["type"] = $type;
        $ajax_request["data"] = json_decode($data_json, true);
        
        return $ajax_request;
      }
      else
      {
        return false;
      }
    }
    else
    {
      return false;
    }
  }
  
  /**
   * 向服务器端返回数据
   * @param <string> $type: 操作类型
   * @param <string> $result: 请求结果
   * @param <array> $data: 返回数据
   */
  function response_ajax($type, $result, $data = "")
  {
    $response = array(
      "type" => $type,
      "result" => $result,
      "data" => $data
    );
    echo json_encode($response);
  }
  
  /**
   * ajax请求错误,可能是未登录，权限不足，或者操作出错等
   * 该函数将停止php的运行
   * @param <string> $type 用户的ajax请求类型
   * @param <string> 错误信息
   */
  function ajax_error($type, $msg)
  {
    $this->response_ajax($type, false, array(
      'error' => $msg
    ));
    exit(0);
  }
 }
