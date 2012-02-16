<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 2011-3-5
 * UTF-8
 * neekey <ni184775761@gmail.com>
 * 
 * 用于id的加密和解密
 */
 
class M_idcode extends CI_Model
{
  function __construct()
  {
    parent::__construct();
  }
  /**
   * 根据给定id，进行加密
   * @param <int> $id
   * @return <string> 加密后的id
   * 
   * 加密过程：
   * 获取当日在一年中的天数，当前的月份以及在该月中的天数，分别为yday，mon，mday
   * 利用随机数函数得到四个五位的随机数
   * 将四个随机数分别和(id + 1)以及从日期中获取的三个数字相乘然后再相加。
   */
  function id_encrypt($id)
  {
    $date_arr = getdate();
    
    $randomkey = rand(10000, 99999);
    $randomkey2 = rand(10000, 99999);
    $randomkey3 = rand(10000, 99999);
    $randomkey4 = rand(10000, 99999);
    $random_id = (string)(($id + 1) * ($randomkey) + $randomkey2 * $date_arr["yday"] + $randomkey3 * $date_arr["mon"] + $randomkey4 *$date_arr["mday"]);
    return ($code = $random_id .  $randomkey2 . $randomkey3 . $randomkey4 . (string)$randomkey);
  }
  
  /**
   * 对加密过的id进行反解密
   * @param <string> $code
   * @return <int> id
   */
  function id_decode($code)
  {
    $date_arr = getdate();
    $randomkey = substr($code, -5);
    $randomkey2 = substr($code, -20, 5);
    $randomkey3 = substr($code, -15, 5);
    $randomkey4 = substr($code, -10, 5);
    $random_id = substr($code, 0, -20);
    $random_id -= ($randomkey2 * $date_arr["yday"] + $randomkey3 * $date_arr["mon"] + $randomkey4 *$date_arr["mday"]);
    return ($id = $random_id / $randomkey - 1);
  }
}
