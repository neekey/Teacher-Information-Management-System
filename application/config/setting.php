<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-2-9
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 网站设置
 */
 
require("config.php");
$base_url = $config["base_url"];
$config = array("setting" => array(
  /**
   * 网站中的各种链接设置
   * 一律在末尾加上/
   */
  "url" => array(
    "base" => $base_url,                                        // 主页
    'admin_base' => 'admin/',
    'teacher_base' => 'teacher/',
    "login" => "login/",                                        // 登录
    "logout" => "login/logout/",                                // 用户注销
    "usercenter" => "usercenter/",                              // 用户中心
    "img" => $base_url . "index.php/img/",              // 图片显示基地址
    "js" => $base_url . "index.php/jscss/js/",
    "css" => $base_url . "index.php/jscss/css/"
  ),
  /**
   * 相关文件路经设置
   */
  "path" => array(
    /* js 和 css文件的默认载入目录 */
    "js_base" => $base_url . "application/views/js/", // for linux
    "css_base" => $base_url . "application/views/css/", // for linux
    'css_img_base' => $base_url . 'application/views/img/', // for linux
    /* 错误图片地址 */
    "error_img" => $base_url . "error/error.jpg"
  ),
  /**
   * 关于视图页面的一些设置
   */
  "page" => array(
    /* 默认载入的页面标题 */
    "title" => "默认页面标题",
    /* 默认载入的CSS和JS文件 */
    "default_css" => array('common/reset', 'common/globle-style', 'common/globle-struct', 'common/header', 'common/main'),
    "default_js" => array('base/jquery-1.5.2.min', 'base/json2', 'base/nyJS_base', 'base/setting', 'helper/ajax_result_handle'),
    "js" => array(),
    "css" => array()
  ),
  /**
   * 关于图片上传的设置
   */
  'upload' => array(
    'upload_path' => './upload/img/',
    'allowed_types' => 'jpg|png|bmp',
    'max_size' => '100000',
    'encrypt_name' => TRUE,
    'overwrite' => FALSE
  ),
  /**
   * 关于教师头像的设置
   */
  'avator' => array(
    'width' => 200,
    'height' => 200
    
  )
));
