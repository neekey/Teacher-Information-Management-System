<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-13
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 用于载入js和css文件
 */

class Jscss extends MY_Controller
{
	function __construct()
	{
		parent::__construct();
		$this->load->helper('file');
    // 用于浏览器缓存
    // $this->_cache();
	}
	
	/**
	 * 用于载入js文件
	 * @param <string> $file_name 为文件名，不需要后缀
	 */
	function js()
	{
		$file_name = $this->_get_path();
    // 用于浏览器缓存
    header('ETag: "jscss"');
		header("Content-type: text/javascript");
		$file_path = $this->data['path']["js_base"] . $file_name . ".js";
		log_message("DEBUG", "JS PATH:" . $file_path);
		$content = file_get_contents($file_path);
		echo $content;
	}
	
	/**
	 * 用于载入css文件
	 * @param <string> $file_name 为文件名，不需要后缀
	 */
	function css()
	{
		$file_name = $this->_get_path();
    // 用于浏览器缓存
    header('ETag: "jscss"');
		header("Content-type: text/css");
		$file_path = $this->data['path']["css_base"] . $file_name . ".css";
		$content = file_get_contents($file_path);
		echo $content;
	}
	
	/**
	 * 用于载入图片
	 * 图片必须放置在views/img 下 在css中使用，例：
	 *     views/css/common/globle.css文件中：
	 *     background: url('../../img/common/button_bg.png');
	 */
	function img()
	{
		$this->load->model(array('m_img'));
		$file_name = $this->_get_path();
	    
		$file_path = $this->data['path']['css_img_base'] . $file_name;
		
		$type = $this->m_img->get_mime_by_path($file_path);
		$this->m_img->show_by_path($file_path, $type);
	}
	/**
	 * 从url中获取文件路经
	 */
	function _get_path()
	{
		$segment = $this->uri->segment_array();
		$seg_mum = count($segment);
		if($seg_mum === 3)
			return $segment[3];
		else
		{
			$path = "";
			for($i = 3; $i <= $seg_mum; $i++)
			{
				if($i !== ($seg_mum))
					$path .= ($segment[$i] . "/");
				else
					$path .= $segment[$i];
			}
		}
		return $path;
	}
  
  /**
   * 若第二次访问相同文件，则发送403给浏览器，让其使用浏览器缓存
   */
  function _cache()
  {
    $headers = apache_request_headers();
    if(isset($headers["If-None-Match"]) && $headers["If-None-Match"] === '"jscss"')
    {
      log_message("DEBUG", "IF PART!!!");
      header('Etag:'."jscss",true,304);
        exit(0);
    }
  }
  /**
   * 若第二次访问相同图片，则发送403给浏览器，让其使用浏览器缓存
   */
  function _img_cache()
  {
    $headers = apache_request_headers();
    if(isset($headers["If-None-Match"]) && $headers["If-None-Match"] === '"img"')
    {
      log_message("DEBUG", "IF PART!!!");
      header('Etag:'."img",true,304);
        exit(0);
    }
  }
}
 ?>