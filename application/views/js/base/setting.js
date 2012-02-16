/**
 * 用于全局变量设置等的js文件
 */
 
(function(window, undefined){
  function setting(){
    /**
     * ajax地址
     */
    this.ajax_url = this.base_url + 'ajax/'
  }
  setting.prototype = {
    /**
     * 网站基地址
     */
    base_url: 'http://localhost/MyPHP/teachersys/index.php/'
  }
  window.teachersys = new setting();
})(window);

