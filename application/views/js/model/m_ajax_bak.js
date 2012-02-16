/**
 * 用于所有页面的通用js文件
 * 
 */
 
// 封装ajax的相关操作
var m_ajax_base = nyJS.model.create({
  constructor: function(){
    // success 回调函数队列
    this.success = {};
    // error 回调函数队列
    this.error = {};
    // complete 回调函数队列
    this.complete = {};
    // before_send 回调函数队列
    this.before_send = {};
  },
  prototype: {
    /**
      * 重写【父实例】的 create方法： 因为controller具有构造函数
      * 重写后，子类实例的构造过程中将先调用父类构造方法
      */
    create: function(child_obj){
      // 若child_obj 则置为空对象
       child_obj = child_obj || {};
       
       // 父类的构造函数,同时也用于闭包
       // 若this是一个函数，那么其构造函数为 this.prototype.constructor
       // 若this为一个实例对象，那么其构造函数为 this.constructor
       var parent_cons = this.constructor || this.prototype.constructor;
       
       // 欲构造的子类构造函数，同时用于闭包
       var child_cons = child_obj.constructor;
       
       child_obj.constructor = function(){
         parent_cons.call(this);
         // 若用户指定了构造函数
         if(child_cons !== undefined ){
           child_cons.call(this);
         }
       }
       
       var child_fn = parent_cons.inherit(child_obj);
       return new child_fn();
   },
    /**
     * ajax 请求的基本url
     */
    base_url: "http://localhost/MyPHP/picshare/index.php/",
    /**
     * 设置ajax 请求基本url
     * @param <string> base_url
     */
    set_baseurl: function(base_url){
      this.base_url = base_url;
    },
    /**
     * ajax 默认设置
     */
    ajax_setting: {
      // 设置header
      headers: {
        http_type: "ajax"
      },
      // url
      url: "",
      // 是否发送异步请求
      async: true,
      // 返回数据的类型
      dataType: "json",
      // 数据发送方式
      type: "post",
      // 实际发送数据
      data: ""
    },
    /**
     * 向服务器发送请求
     * @param <object> ajax_info {
     *   type <string> 数据操作类型
     *   data <object>
     *   url <string> 相对基地址的地址
     * 	 dataType <string> 服务器数据返回类型，默认json
     *   async <boolen> 是否发送异步请求，默认true
     *   _data <object> 用于传递给回调函数的额外参数
     * }
     */
    post: function(ajax_info){
      var closure_this = this;
      // 设置this.ajax_setting 的回调函数
      // 在此处设置一个是因为在原型的ajax_setting中无法使用闭包，
      // 若在构造函数中设置，则因为prototype在构造函数之前实现
      
      // ajax请求成功
      this.ajax_setting.success = function(data, textStatus, jqXHR){
        var args = {
          data: data,
          textStatus: textStatus,
          jqXHR: jqXHR,
          _data: ajax_info._data
        }
        for(var fn_name in closure_this.success){
          closure_this.success[fn_name](args);
        }
      };
      // ajax请求失败
      this.ajax_setting.error = function(jqXHR, textStatus, errorThrown){
        for(var fn_name in closure_this.error){
          closure_this.error[fn_name](jqXHR, textStatus, errorThrown);
        }
      };
      // ajax请求完成
      this.ajax_setting.complete = function(jqXHR, textStatus){
        for(var fn_name in closure_this.complete){
          closure_this.complete[fn_name](jqXHR, textStatus);
        }
      };
      // ajax请求即将发送前
      this.ajax_setting.beforeSend = function(jqXHR, settings){
        for(var fn_name in closure_this.before_send){
          closure_this.before_send[fn_name](jqXHR, settings);
        }
      };
      
      // 处理url
      ajax_info.url = this.base_url + ajax_info.url;
      // 处理数据
      ajax_info.data = {
        type: ajax_info.type,
        data: JSON.stringify(ajax_info.data)
      }
      delete ajax_info.type;
      
      // 获取一份this.ajax_setting的拷贝
      // 更新设置的操作在拷贝上进行，以保持this.ajax_setting 默认设置的不变
      var ajax_temp_setting = {};
      for(var setting_name in this.ajax_setting){
        ajax_temp_setting[setting_name] = this.ajax_setting[setting_name];
      }
      // 设置新的设置
      for(setting_name in ajax_info){
        ajax_temp_setting[setting_name] = ajax_info[setting_name];
      }
      
      // 发送ajax请求
      return $.ajax(ajax_temp_setting);
    },
    /**
     * 向回调函数列表中添加函数
     * @param <object> 回调函数列表 {
     *   type: {
     *     fn_name: fn,
     *   }
     *   type2: {
     *     fn_name: fn,
     *     fn_name2: fn2
     *   }
     * }
     */
    callback: function(callback_obj){
      var type, fn_obj;
      for(var callback_type in callback_obj){
        type = callback_type;
        fn_obj = callback_obj[callback_type];
        
        // 根据tytpe的值决定添加的回调列表
        switch(type){
          case "success":{
            var callback_list = this.success;
            break;
          }
          case "error":{
            var callback_list = this.error;
            break;
          }
          case "complete":{
            var callback_list = this.complete;
            break;
          }
          case 'before_send':{
            var callback_list = this.before_send;
          }
          default:{
          }
        }
        
        // 若callback_list 为undefined则说明type错误，什么也不做
        if(callback_list !== undefined){
          for(var fn_name in fn_obj){
            callback_list[fn_name] = fn_obj[fn_name];
          }
        }
      }
    }
  }
});

