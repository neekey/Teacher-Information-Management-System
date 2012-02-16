/**
 * @author Neekey <ni184775761@gmail.com>
 * @version 0.0.1
 * 
 * 要求：jQuery 1.5 <http://jquery.com/>
 * 
 * 框架名称：nyJS
 * 简介：
 *    本框架旨在让前段的JavaScript开发中使用MVC的设计模式
 * 另外本框架也提供一些简单的UI组建，以及响应的工具包（如JavaScript文件的导入）等
 *    框架还在开发中，欢迎下载测试。帮助文档以及相关说明将在后续放出。
 */
(function(window, undefined){
 //===============================================================================
 // 继承的实现 该部分的方法只能被函数对象调用，函数实例将无法获得这些方法
 //===============================================================================
 
 // 为所有的函数对象添加一个基类方法，这个方法的作用是向函数的原型中添加一个函数
 Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
 };
 // 添加 add_proto 方法
 // 为函数的原型添加内容（proto_obj),并通过if_overlap来控制是否覆盖已有属性
 Function.method("add_proto", function(proto_obj, if_overlap){
   for(var name in proto_obj){
     if(if_overlap){
       this.prototype[name] = proto_obj[name];
     }
     else{
       if(this.prototype[name] === undefined){
         this.prototype[name] = proto_obj[name];
       }
     }
   }
 });
 // 添加 set_cons 方法
 // 设置函数原型的构造函数（prototype.constructor)
 Function.method("set_cons", function(cons){
   this.prototype.constructor = cons;
 });
 
 // 添加 set_super 方法
 // 将父类的构造函数添加到当前函数中
 // 在子函数的构造函数中可以通过：arguments.callee._super.call(this, 参数...)来调用父函数的构造函数
 Function.method("set_super", function(parent_cons){
   this._super = parent_cons;
 });
 // 添加 inherit 方法
 // 构造一个以当前函数为父类的子函数
 // @param <object> child_obj 包括：constructor构造函数以及prototype函数原型
 // @param <boolen> 是否继承父类的构造函数 默认为false
 // 参数可为空
 Function.method("inherit", function(child_obj, if_par_cons){
   if_par_cons = if_par_cons || false;
   // 父函数的构造函数，作为闭包引用
   var parent_cons = this.prototype.constructor;
   // 父函数的原型，作为闭包引用
   var parent_prot = this.prototype;
   
   // 子函数的构造函数
   var child_fn;
   
   // 若继承父类构造函数
   if(if_par_cons === true){
     child_fn = function(args){
       parent_cons.call(this, args);
       // 若用户指定了构造函数
       if(child_obj.constructor !== Object){
         child_obj.constructor.call(this, args);
       }
     };
   }
   else {
     // 若参数中未给定构造函数，则默认构造函数为object
     child_fn = (child_obj.constructor === Object) ? function(){} : child_obj.constructor;
   }
   
   // 若 prototype属性不存在，则直为空对象
   child_obj.prototype = child_obj.prototype || {};
   
   // 将父函数的原型添加到子函数中
   child_fn.add_proto(parent_prot, true);
   
   // 为子函数添加自己的原型
   child_fn.add_proto(child_obj.prototype, true);
   
   // 重设子函数的原型构造函数
   child_fn.set_cons(child_fn);
   
   // 为子函数添加super 指向父函数的构造函数
   // 在子函数的构造函数中可以通过：arguments.callee.super.call(this, 参数...)来调用父函数的构造函数
   child_fn.set_super(parent_cons);
   
   // 返回子函数
   return child_fn;
 });
 //===========================================
 // 继承的实现 --- end
 //===========================================
 

 
 //===========================================
 // 基类 base
 //===========================================
 function base(){};
 base.add_proto({
   /**
    * 创建自身子类实例
    * @param <object> child_obj  子类的构造函数和原型{
    *   constructor: function(){},
    *   prototype: {}
    * }
    * @param <boolen> if_par_cons 子类是否在构造函数中调用父类构造函数
    *   注意，父类构造函数将在子类的构造函数内容之前被调用，该调用无法传递任何参数给父类构造函数
    *   默认为 true
    * @return <object>
    * 
    * 若不给定参数，则直接返回构造函数为空的继承自父类的实例对象
    * 
    * 该方法适用于函数对象以及函数实例
    */
   create: function(child_obj, if_par_cons){
       // 若child_obj 则置为空对象
       child_obj = child_obj || {};
       
       if_par_cons = if_par_cons || true;
       
       // 父类的构造函数,同时也用于闭包
       // 若this是一个函数，那么其构造函数为 this.prototype.constructor
       // 若this为一个实例对象，那么其构造函数为 this.constructor
       var parent_cons = this.constructor || this.prototype.constructor;
       
       // 若调用父类构造函数
       if(if_par_cons === true){
         // 欲构造的子类构造函数，同时用于闭包
         var child_cons = child_obj.constructor;
         
         child_obj.constructor = function(){
           parent_cons.call(this);
           // 若用户指定了构造函数
           if(child_cons !== undefined ){
             child_cons.call(this);
           }
         }
       }
       
       // 若写为： return new this.constructor.inherit(child_obj);
       // 将导致 inherit 内部this指向出错，原因未知...
       var child_fn = parent_cons.inherit(child_obj);
       return new child_fn();
     },
   /**
    * 向实例对象添加方法
    * @param fn_obj <object>
    */ 
   add_method: function(fn_obj){
     for(var name in fn_obj){
       this[name] = fn_obj[name];
     }
   }
 });
 
 //===========================================
 // 控制器 controller
 //===========================================
 var controller = base.inherit({
   constructor: function(event_list){
     // ====以下为非函数成员变量====
     /**
      * 用于存储当前控制响应的函数列表
      * 以事件名为索引, 每一项包括函数名与函数{
      *   fn_name: fn,
      *   fn_name2: fn2
      * }
      * 默认为空
      * 为函数命名是为了方便标示，用于在事件列表中删除绑定的函数
      */
     this.response_list = {};
     
     /**
      * 用于存储当前控制器响应的ajax函数列表{
      *   ajax_event_name: {
      *     ajax_type: {
      *       fn_name: fn
      *     } 
      *   }
      * }
      */
     this.ajax_list = {};
     
     // ====以下为构造函数内容====
     
     // this._event 为controller默认向其响应的事件列表
     // 若参数不给出，则默认为全局变量nyJS._event
     if(event_list === undefined){
       this._event = nyJS._event;
     }
     else{
       this._event = event_list;
     }
   },
   prototype: {
     /**
      * 向事件响应列表中添加事件
      * @param <object> obj {
      *   event_name: {
      *     fn_name: fn
      *   }
      * }
      */
     response_add: function(obj){
       for(var event_name in obj){
         if(this.response_list[event_name] === undefined){
           this.response_list[event_name] = {};
         }
         for(var fn_name in obj[event_name]){
           this.response_list[event_name][fn_name] = obj[event_name][fn_name];
         }
       }
     },
     /**
      * 删除事件响应列表中指定事件名称的项目
      * @param <object> remove_obj {
      *   event_name
      *   fn_name
      * }
      * 一次删除一个项目，自动检查是否存在该项目
      */
     response_remove: function(remove_obj){
       // 若该事件存在
       if(this.response_list[remove_obj.event_name] !== undefined){
         delete this.response_list[remove_obj.event_name][remove_obj.fn_name];
       }
     },
     /**
      * 响应事件池中的函数
      * @param <object> res_list{
      *   event_name: {
      *     fn_name: fn,
      *     fn_name2: fn2
      *   }
      * }
      * 
      */
     response: function(res_list){
       var res_obj;
       for(var event_name in res_list){
         // 对该事件中的每一个函数
         for(var fn_name in res_list[event_name]){
           
           // 向事件列表nyJS._event.list中添加函数
           res_obj = {
             fn_name: fn_name,
             fn: res_list[event_name][fn_name]
           };
           this._event.list[event_name].bind(res_obj)
           
           // 想该控制器的函数列表中添加函数
           this.response_add(res_list);
         }
       }
     },
     /**
      * 取消对某个事件的响应
      * @param <object> remove_obj {
      *   event_name
      *   fn_name
      * }
      */
     unresponse: function(event_obj){
       this.response_remove(event_obj);
       // 取消事件列表中该函数的绑定
       this._event.list[event_obj.event_name].unbind(event_obj.fn_name);
     },
     /**
      * 响应事件池中的ajax事件
      * @param <object> {
      *   ajax_name: {
      *     ajax_type: {
      *       fn_name: fn
      *     }
      *   }
      * }
      */
     response_ajax: function(res_list){
       for(var ajax_name in res_list){
         nyJS._event.ajax_list[ajax_name].bind(res_list[ajax_name]);
         this.response_add_ajax(res_list);
       }
     },
     /**
      * 向this.ajax_list中添加函数
      * @param <object> event_obj {
      *   ajax_name: {
      *     ajax_type: {
      *       fn_name: fn
      *     }
      *   }
      * }
      */
     response_add_ajax: function(event_obj){
       for(var ajax_name in event_obj){
         if(this.ajax_list[ajax_name] === undefined){
           this.ajax_list[ajax_name] = {};
         }
         for(var ajax_type in event_obj[ajax_name]){
           if(this.ajax_list[ajax_name][ajax_type] === undefined){
             this.ajax_list[ajax_name][ajax_type] = {};
           }
           for(var fn_name in event_obj[ajax_name][ajax_type]){
             this.ajax_list[ajax_name][ajax_type][fn_name] = event_obj[ajax_name][ajax_type][fn_name];
           }
         }
       }
     },
     /**
      * 取消ajax事件的响应
      * @param <object> event_obj{
      *   ajax_name,
      *   ajax_type,
      *   fn_name
      * }
      */
     unresponse_ajax: function(event_obj){
       delete this.ajax_list[event_obj.ajax_name][event_obj.ajax_type][event_obj.fn_name];
       nyJS._event.ajax_list[event_obj.ajax_name].unbind(event_obj);
     }
   }
 });


 //===========================================
 // 事件模型 ny_event
 //=========================================== 
 var ny_event = base.inherit({
   /**
    * 构造函数
    * event_obj {
    *   type
    *   name
    *   jq
    * }
    */ 
   constructor: function(event_obj){
     // ====以下为非函数成员变量====
     /**
      * 绑定在该事件上的函数列表
      * 以函数名称作为索引
      * fn_list[fn_name] = fn
      */
     this.fn_list = this.fn_list || {};
     
     // ====以下为构造函数内容====
     this.type = event_obj.type;
     this.jq = event_obj.jq;
     this.name = event_obj.name;
     
     // 用于传递给函数的参数
     this.arguments = {
       jq: this.jq,
       type: this.type,
       name: this.name
     }
     /**
      * 运行所有绑定在该事件上的函数
      * @param <object> args: this.arguments
      */
     var this_closure = this;
     this.run_fns = function(){
       // 用于传递给函数列表中函数的参数
       var args = this_closure.arguments;
       // 将事件对象传递给args._this
       args._this = this;
       
       var test = {};
       // 用于有些事件响应函数通过返回 false来阻止服务器默认行为
       var fn_return = true;
       for(var fn_name in this_closure.fn_list){
         // 若函数返回值为false 则 阻止服务器行为
          if(this_closure.fn_list[fn_name](args) === false){
            fn_return = false;
          }
       }
       return fn_return;
     };
     
     // 为jq绑定事件
     this.jq.bind(this.type, this.run_fns);
   },
   // 原型
   prototype: {
     /**
      * 添加事件到事件列表
      * @param <object> fn_obj{
      *   fn_name: 函数名称
      *   fn: 函数
      * }
      */
     bind: function(fn_obj){
         this.fn_list[fn_obj.fn_name] = fn_obj.fn;
     },
     /**
      * 根据给定的函数名取消事件绑定
      * @param <string> fn_name
      */ 
     unbind: function(fn_name){
       if(this.fn_list[fn_name] !== undefined){
         delete this.fn_list[fn_name];
       }
     },
     /**
      * 向事件对象的jq中添加对象
      */
     add_jq: function(jq){
       var closure_this =this;
       jq.each(function(){
         closure_this.jq.push(this);
       });
       
       this.constructor({
         type: this.type,
         name: this.name,
         jq: this.jq
       });
     },
     /**
      * 设置事件对象的jq(覆盖)
      */
     set_jq: function(jq){
       this.jq = jq;
       
       this.constructor({
         type: this.type,
         name: this.name,
         jq: this.jq
       });
     }
   }
 });
 
 //===========================================
 // 事件模型 ajax_event 继承自ny_event
 // 并将继承其构造函数
 //=========================================== 
 var ajax_event = base.inherit({
   /**
    * 构造函数
    * @param <object> event_obj {
    *   name: 事件名称,
    *   setting: 与 $.ajax 的参数相符
    * }
    */
   constructor: function(event_obj){
     /**
      * ajax 默认设置
      */
     this.ajax_setting = {
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
       data: "",
       // 默认的超时时间为30秒
       timeout: 30000
     };
     
     // ajax事件名称，用于在ajax事件列表中作为索引
     this.name = event_obj.name;
     this.type = "ajax";
     // ajax设置
     for(var setting_name in event_obj.setting){
         this.ajax_setting[setting_name] = event_obj.setting[setting_name];
     }
     
     // success 回调函数队列
     this.success = {};
     // error 回调函数队列
     this.error = {};
     // complete 回调函数队列
     this.complete = {};
     // before_send 回调函数队列
     this.beforeSend = {};
     
     // 闭包引用
     var closure_this = this;
     
     /**
      * 作为传递给回调函数的自定义参数,可以是任意数据类型
      */
     this.additional_data = {};
     
     // 回调函数设置
     // success
     this.ajax_setting.success = function(data, textStatus, jqXHR){
       var args = {
         data: data,
         textStatus: textStatus,
         jqXHR: jqXHR,
         additional: closure_this.additional_data
       };
       for(var fn_name in closure_this.success){
         closure_this.success[fn_name](args);
       }
     };
     // error
     this.ajax_setting.error = function(jqXHR, textStatus, errorThrown){
       var args = {
         errorThrown: errorThrown,
         textStatus: textStatus,
         jqXHR: jqXHR,
         additional: closure_this.additional_data
       };
       for(var fn_name in closure_this.error){
         closure_this.error[fn_name](args);
       }
     };
     // complete
     this.ajax_setting.complete = function(jqXHR, textStatus){
       var args = {
         textStatus: textStatus,
         jqXHR: jqXHR,
         additional: closure_this.additional_data
       };
       for(var fn_name in closure_this.complete){
         closure_this.complete[fn_name](args);
       }
     };
     // beforeSend
     this.ajax_setting.beforeSend = function(jqXHR, settings){
       var args = {
         settings: settings,
         jqXHR: jqXHR,
         additional: closure_this.additional_data
       };
       for(var fn_name in closure_this.beforeSend){
         closure_this.beforeSend[fn_name](args);
       }
     };
   },
   prototype: {
     
     /**
      * 向服务器发送请求
      * @param <object> ajax_info {
      *   type <string> 数据操作类型
      *   data <object>
      *   url <string> 相对基地址的地址
      *   dataType <string> 服务器数据返回类型，默认json
      *   async <boolen> 是否发送异步请求，默认true
      *   additional <object> 用于传递给回调函数的额外参数
      * }
      */
     post: function(ajax_info){
       var closure_this = this;
       
       // 处理数据
       ajax_info.data = {
         type: ajax_info.type,
         data: JSON.stringify(ajax_info.data)
       };
       delete ajax_info.type;
       
       // 设置额外数据
       if(ajax_info.additional !== undefined){
         this.additional_data = ajax_info.additional;
       }
       
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
       $.ajax(ajax_temp_setting);
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
     bind: function(callback_obj){
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
             var callback_list = this.beforeSend;
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
     },
     /**
      * 取消对ajax事件的绑定
      * @param <object> {
      *   ajax_type
      *   fn_name
      * }
      */
     unbind: function(obj){
       var type = obj.ajax_type;
       if(type === 'success' || type === 'error' || type === 'complete' || type === 'beforeSend'){
         delete this[type][obj.fn_name];
       }
     }
   }
 }, true);
 
 //===========================================
 // 事件列表 _event
 //=========================================== 
 var _event = base.inherit({
   constructor: function(_event_name){
     this.name = this.name || _event_name;
     /**
      * 存储事件的事件列表
      * list[name] = event
      */
     this.list = {};
     this.ajax_list = {}
   },
   prototype: {
     /**
      * 为一个jquery在事件列表中注册
      * @param <object> event_info{
      *   type: 事件类型，该参数的取值与jquery的bind函数需要参数一致
      *   name: 事件名称,
      *   jq: jquery对象
      * }
      */
     reg: function(event_info){
       var event_obj = {
         type: event_info.type,
         name: event_info.name,
         jq: event_info.jq
       };
       var new_event = new ny_event(event_obj);
       this.add(new_event);
     },
     /**
      * 向事件列表中添加事件
      * @param <ny_event>
      */
     add: function(event_obj){
       if(event_obj.type === 'ajax'){
         this.ajax_list[event_obj.name] = event_obj;
       }
       else{
         this.list[event_obj.name] = event_obj;
       }
     },
     /**
      * 向事件目标jq中添加对象
      * @param <string> 事件名称
      * @param <jQuery>
      */
     add_jq: function(event_name, jq){
       this.list[event_name].add_jq(jq);
     },
     /**
      * 设置事件目标jq对象
      * @param <string> 事件名称
      * @param <jQuery>
      */
     set_jq: function(event_name, jq){
       this.list[event_name].set_jq(jq);
     },
     /**
      * 向事件列表中删除指定名称的事件
      * @param <string> event_name
      */
     remove: function(name){
       if(this.list[name] !== undefined){
         delete this.list[name];
       }
     },
     /**
      * 向ajax事件列表中删除指定名称的事件
      * @param <string> event_name
      */
     remove_ajax: function(name){
       if(this.ajax_list[name] !== undefined){
         delete this.list[name];
       }
     }
   }
 })
 
 //===========================================
 // 模型 model
 //=========================================== 
 var model = base.inherit({
   constructor: function(){
     this.ajax_list = {};
   },
   prototype: {
     /**
      * 为一个ajax事件注册
      * @param <object> event_info{
      *   name: 事件名称,
      *   setting: ajax设置
      * }
      */
     reg_ajax: function(event_info){
       var event_obj = {
         type: event_info.type,
         name: event_info.name,
         setting: event_info.setting
       };
       var new_event = new ajax_event(event_obj);
       this.ajax_list[event_info.name] = new_event;
       // 向事件列表中添加ajax事件
       nyJS._event.add(new_event);
     },
     /**
      * 向ajax列表中添加事件
      */
     add_ajax: function(new_event){
       this.ajax_list[new_event.name] = new_event;
     },
    /**
     * 向服务器发送请求
     * @param <object> ajax_info {
     *   name <string> 进行操作的ajax事件名称
     *   type <string> 数据操作类型
     *   data <object>
     * ---------- option ---------------
     *   url <string> 相对基地址的地址
     *   dataType <string> 服务器数据返回类型，默认json
     *   async <boolen> 是否发送异步请求，默认true
     *   additional <object> 用于传递给回调函数的额外参数
     * }
     */
    post: function(ajax_info){
      var ajax_name = ajax_info.name;
      delete ajax_info.name;
      this.ajax_list[ajax_name].post(ajax_info);
    }
  }
 });
 
 //===========================================
 // 视图 view
 //=========================================== 
 var view = base.inherit({
   constructor: function(){
   },
   prototype: {
   }
 })
 
 //===========================================
 // 组件基类 component_base
 //=========================================== 
 var component_base = base.inherit({
   constructor: function(){
     // ====以下为非函数成员变量====
     
     // 视图
     this.view = new view();
     // 模型
     this.model = new model();
     // 事件列表
     this._event = new _event("component2");
     // 核心的js对象
     this.base_jq = {};
     // 辅助对象
     this.other_jq = {};
     
     // ====以下为非函数成员变量====
     
     // 构造指向 组件本身事件列表的控制器
     // 若使用 this.controller = new controller(this._event) 的写法会出错，原因不明...
     var new_contr = new controller(this._event);
     this.controller = new_contr;
   },
   prototype: {
     // 实现组建提供的外部接口事件
     bind: function(event_obj){
       this.controller.response(event_obj);
     }
   }
 })
 
 //===========================================
 // 组件方法与类型-容器 component
 // component 实际上并非为一个组建类
 // 所有的组建类的定义都在其成员_coms中，component的
 // 构造函数通过遍历_coms为自身添加所有构造这些组件的方法
 // 构造组建的方法与组建类名一致
 //=========================================== 
 function component(){
 }
 
 component.prototype = {
   // 用于创建组件实例
   // @param <string> com_type 组建名称
   // @param <object> com_info 构造组件需要的参数
   // @return <object> 组件实例
   // ex: nyJS.component.create("tip", {option});
   create: function(com_type, com_info){
     var new_com = new this._coms[com_type](com_info);
     return new_com;
   },
   // 组建类列表
   // 每个组建构造函数中均需要调用其父类构造函数：
   // arguments.callee._super.call(this)
   
   _coms: {
     // "tip"组件
     tip: component_base.inherit({
       /**
        * 给定 tip内容，以及相关设置参数构造一个tip组件
        * @param <object> com_info{
        *   text: tip的内容,
        *   tag: 包裹内容的标签，默认为p
        *   class: 标签的类名
        * }
        */
       constructor: function(com_info){
         
         // ====以下为非函数成员变量====
         this.text = "";
         this.tag = "p";
         this._class = "nyJS_com_tip";
         
         // ====以下为构造函数内容====
         
         // 初始化数据
         this.text = com_info.text || this.text;
         this.tag = com_info.tag || this.tag;
         this._class = com_info._class || this._class;
         
         // 构造jq对象，默认将隐藏
         this.base_jq = $("<" + this.tag + " class ='" + this._class + "' >" + this.text + "</" + this.tag + ">").appendTo("body").hide();
         
         // 为组件添加相应事件接口
         this._event.reg({
           jq: this.base_jq,
           type: "click",
           name: "click"
         });
       },
       prototype: {
         // 设置tip内部的文字
         set: function(new_text){
           this.text = new_text;
           this.base_jq.text(new_text);
         },
         // 获取tip的文字
         get: function(){
           return this.text;
         },
         /**
          * 显示tip
          * option参数和jquery中的show()参数一致
          */
         show: function(option){
           return this.base_jq.show(option);
         },
         /**
          * 隐藏tip
          * option参数和jquery中的hide()参数一致
          */
         hide: function(option){
           return this.base_jq.hide(option);
         },
         /**
          * 让tip的动画效果延迟
          * option参数和jquery中的delay()参数一致
          */
         delay: function(option){
           return this.base_jq.delay(option);
         },
         /**
          * 将tip移动到指定元素后面作为兄弟元素
          */
         after: function(target_elem){
           $(target_elem).after(this.base_jq);
         }
       }
     }, true),
     // form 表单组建
     form: component_base.inherit({
       /**
        * form组建构造函数
        * @param <object> com_info{
        *   
        * }
        */
       constructor: function(com_info){
         
         // ====以下为非函数成员变量====
         
         // 用于错误提示的tip类
         this.tag = "p";
         // 用于错误提示的tip类
         this._class = "nyJS_com_form_tip";
         
         // ====以下为构造函数内容====
         
         // 初始化数据
         this.tag = com_info.tag || this.tag;
         this._class = com_info._class || this._class;
         this.base_jq = com_info.jq || this.base_jq;
         
         this.init();
         
       },
       prototype: {
         /**
          * 对表单进行初始化，将对form内的所有元素重新添加事件
          */
         init: function(){
           // 为组件添加相应事件接口
           this._event.reg({
             jq: this.base_jq.find('input[type=submit], button[type=submit]'),
             type: "click",
             name: "submit"
           });
           this._event.reg({
             jq: this.base_jq.find('input, textarea, select'),
             type: "change",
             name: "change"
           });
           
           
           var form = this;
           this.controller.response({
             submit: {
               form_submit: function(){
                 if(!form.check()){
                   return false;
                 }
               }
             },
             change: {
               field_change: function(args){
                 form.check_field(args._this);
               }
             }
           });
         },
         // 表单对象的表单验证以表单字段的class中是否含有对应关键字来
         // 决定如何进行验证
         // 验证规则放在prototype中, 让所有form实例对象共享这个配置
         // rule: {
         //   msg: 当验证不通过时输出的错误文字,
         //   test: 用于进行验证的函数，返回true或者false
         // }
         // test: function(obj){}, obj为当前验证字段dom对象
         rules: {
           required: {
             msg: "This field is required.",
             test: function(obj){
               return obj.value.length > 0;
             }
           },
           email: {
             msg: "Not a valid email address.",
             test: function(obj){
               // 若value为空则为真，若不为空则验证邮箱是否正确
               return !obj.value || /^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i.test(obj.value);
             }
           },
           /**
            * 用于两个表单的值是否匹配
            * 需要在验证表单中添加属性 match='target_id'
            */
           match: {
             msg: "两次输入不匹配!",
             test: function(obj){
               var target = $(obj).attr('match');
               return !obj.value || (obj.value === $('#' + target).val());
             }
           },
           phone: {
             msg: "Not a valid phone number.",
             test: function(obj){
               var m = /(\d{3}).*(\d{3}).*(\d{4})/.exec( obj.value);
               // 若value为空则为真，若不为空则验证邮箱是否正确
               return !obj.value || m;
             }
           }
         },
         /**
          * 设置表单检查的规则
          * 创建新的规则或者覆盖默认规则
          * @param <object> rules{
          *   required: {
          *     msg: 错误提示,
          *     test: function(){
          *     }
          *   }
          * }
          */
         set_rules: function(rules){
           rules = rules || {};
           for(var i in rules){
             // 若该规则尚未设置
             if(this.rules[i] === undefined){
               this.rules[i] = rules[i];
             }
             // 覆盖默认规则
             else{
               for(var j in rules[i]){
                 this.rules[i][j] = rules[i][j];
               }
             }  
           }
         },
         /**
          * 对表单进行验证
          * @return <boolen> 
          */
         check: function(){
           // 表单验证结果，作为闭包
           var check_result = true;
           
           var rules = this.rules;
           // 用于闭包的form组建对象
           var form = this;
           
           // 考虑到可能jq包含多个表单
           this.base_jq.each(function(){
             var tip;
             // 对表单内的每个字段进行遍历
             for(var i = 0; i < this.elements.length; i++){
               // 若已经存在错误提示， 则隐藏错误提示 tip
               if(this.elements[i].nyJS_tip !== undefined){
                 this.elements[i].nyJS_tip.hide();
               }
               // 对每个规则进行遍历
               for(var j in rules){
                 
                 // 验证该表单字段是否含有响应的类名， 若存在，则进行验证
                 var re = new RegExp("(^|\\s)" + j + "(\\s|$)");
                 if(re.test(this.elements[i].className) && !rules[j].test(this.elements[i])){
                   check_result = false;
                   
                   // 若该字段还没有被 添加 tip组件, 则新建一个tip， 添加到当前字段的dom对象中
                   if(this.elements[i].nyJS_tip === undefined){
                     this.elements[i].nyJS_tip = nyJS.component.create("tip", {
                       tag: form.tag,
                       _class: form._class
                     });
                     // 将tip组建放到当前dom对象后面
                     $(this.elements[i]).after(this.elements[i].nyJS_tip.base_jq);
                   }
                   // 设置错误信息
                   this.elements[i].nyJS_tip.set(rules[j].msg);
                   // 显示错误
                   this.elements[i].nyJS_tip.show();
                 }
               }
             }
           });
           return check_result;
         },
         /**
          * 对单个字段进行检查
          * @param <HTMLElement> elem
          * @return <boolen>
          */
         check_field: function(elem){
           // 若已经存在错误提示， 则隐藏错误提示 tip
           if(elem.nyJS_tip !== undefined){
             elem.nyJS_tip.hide();
           }
           // 对每个规则进行遍历
           var check_result = true;
           for(var j in this.rules){
             
             // 验证该表单字段是否含有响应的类名， 若存在，则进行验证
             var re = new RegExp("(^|\\s)" + j + "(\\s|$)");
             if(re.test(elem.className) && !this.rules[j].test(elem)){
               check_result = false;
               
               // 若该字段还没有被 添加 tip组件, 则新建一个tip， 添加到当前字段的dom对象中
               if(elem.nyJS_tip === undefined){
                 elem.nyJS_tip = nyJS.component.create("tip", {
                   tag: this.tag,
                   _class: this._class
                 });
                 // 将tip组建放到当前dom对象后面
                 $(elem).after(elem.nyJS_tip.base_jq);
               }
               // 设置错误信息
               elem.nyJS_tip.set(this.rules[j].msg);
               // 显示错误
               elem.nyJS_tip.show();
             }
           }
           return check_result;
         },
         submit: function(){
           this.base_jq.submit();
         },
         /**
          * 隐藏所有的tip
          */
         clear_tip: function(){
           
           // 考虑到可能jq包含多个表单
           this.base_jq.each(function(){
             // 对表单内的每个字段进行遍历
             for(var i = 0; i < this.elements.length; i++){
               // 若存在tip 则隐藏
               if(this.elements[i].nyJS_tip !== undefined){
                 this.elements[i].nyJS_tip.hide();
               }
             }
           });
         }
       }
     }, true),
     /**
      * 日期选择控件
      */
     date: component_base.inherit({
       /**
        * 构造函数
        * @param <object> {
        *   target:
        *   year:
        *   month:
        *   day:
        *   setting: {
        *     year:{
        *       min:,
        *       max:
        *     },
        *     with_zero: false 天数和月数是否在前面添加0
        *   }
        * }
        */
       constructor: function(com_info){
         
         // 设置jQuery对象
         this.base_jq = com_info.target;
         this.other_jq = {
           year: com_info.year,
           month: com_info.month,
           day: com_info.day
         };
         
         // 读取用户设置
         if(com_info.setting !== undefined){
           for(var set_name in com_info){
             this.setting[set_name] = com_info[set_name];
           }
         }
         
         // 建立菜单
         this.build_select({
           jq: this.other_jq.year,
           min: this.setting.year.min,
           max: this.setting.year.max
         });
         this.build_select({
           jq: this.other_jq.month,
           min: 1,
           max: 12
         });
         this.update_day();
         
         // 读取默认事件戳
         var default_timestamp = this.base_jq.val();  
         this.set_select(default_timestamp)
         
         this.date = new Date(this.base_jq.val() * 1000);
         var closure_this = this;
         // 注册事件
         this._event.reg({
           jq: $([this.other_jq.year[0], this.other_jq.month[0]]),
           type: "change",
           name: "day_change"
         });
         this._event.reg({
           jq: $([this.other_jq.year[0], this.other_jq.month[0], this.other_jq.day[0]]),
           type: "change",
           name: "date_change"
         });
         // 响应事件
         this.controller.response({
           day_change: {
             update_day: function(){
               closure_this.update_day();
             }
           },
           date_change: {
             update_date: function(){
               closure_this.update_date();
             }
           }
         })
         
       },
       prototype: {
         /**
          * 组建设置
          */
         setting: {
           year: {
             min: ((new Date()).getFullYear() - 50) > 1970 ? ((new Date()).getFullYear() - 50) : 1970,
             max: (new Date()).getFullYear()
           },
           with_zero: false
         },
         /**
          * 建立一个菜单
          * @param <object> select_info{
          *   jq: select元素对应的jQuery对象,
          *   max: 最大值,
          *   min: 最小值,
          *   selected: 默认选中的选项值, 默认为min
          * }
          */
         build_select: function(select_info){
           select_info.selected = select_info.selected || select_info.min;
           // 清空选项
           select_info.jq.empty();
           var option_value;
           for(var i = select_info.max; i >= select_info.min; i--){
             if(i < 10 && this.setting.with_zero){
               option_value = '0' + i;
             }
             else{
               option_value = i;
             }
             if(i == select_info.selected){
               setTimeout(function() { 
               select_info.jq.append('<option selected="selected" value="' + i +'">' + option_value + '</option>');}, 1);
             }
             else{
               select_info.jq.append('<option value="' + i +'">' + option_value + '</option>');
             }
           }
         },
         /**
          * 获取当前用户选择的时间戳
          */
         get_timestamp: function(){
           return (this.date.valueOf() / 1000);
         },
         /**
          * 根据timestamp（以秒记时间戳）设置整个组建
          * 包括菜单和目标值
          * @param <int> timestamp 以秒记的时间戳
          */
         set_date: function(timestamp){
           this.set_select(timestamp);
           this.update_date(timestamp);
         },
         /**
          * 设置target上的时间戳
          * @param <int> timestamp 以毫秒记的时间戳
          */
         set_timestamp: function(timestamp){
           this.base_jq.val(timestamp / 1000);
         },
         /**
          * 根据timestamp（以秒记时间戳）设置菜单项
          * 注意 目标值没有进行设置
          * @param <int> timestamp 以秒记的时间戳
          */
         set_select: function(timestamp){
           var closure_this = this;
             this.date = new Date(timestamp * 1000);
             /* 解决ie6 selected 属性无法修改的错误 */
             setTimeout(function(){
               closure_this.other_jq.year.val(closure_this.date.getFullYear());
             closure_this.other_jq.month.val(closure_this.date.getMonth() + 1);
             closure_this.other_jq.day.val(closure_this.date.getDate());}, 1);
         },
         /**
          * 获取指定年份和月份下的天数
          */
         get_day: function(){
           var year = this.other_jq.year.val();
           var month = this.other_jq.month.val();
           switch(parseInt(month))
           {
             case 1:
             case 3:
             case 5:
             case 7:
             case 8:
             case 10:
             case 12:
                return 31;
                break;
             case 4:
             case 6:
             case 9:
             case 11:
                return 30;
                break;
             case 2:
                if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
                    return 29;
                else
                    return 28;
                break;
            } 
         },
         /*
          * 返回当前菜单的年月日
          */
         get_date_info: function(){
         	return {
         		year: this.other_jq.year.val(),
         		month: this.other_jq.month.val(),
         		day: this.other_jq.day.val(),
         		timestamp: this.get_timestamp() 
         	}
         },
         /**
          * 根据当前用户选择更新时间
          */
         update_date: function(){
           var year = this.other_jq.year.val();
           var month = this.other_jq.month.val();
           var day = this.other_jq.day.val();
           this.date.setFullYear(year);
           // 月份是从0开始的
           this.date.setMonth(month - 1);
           this.date.setDate(day);
           var timestamp = this.date.valueOf();
           this.set_timestamp(timestamp);
         },
         /**
          * 根据当前的年份和月份构造 天数菜单
          */
         update_day: function(){
           // 获取天数
           var day_num = this.get_day();
           var day_value = this.other_jq.day.val();
           this.build_select({
             jq: this.other_jq.day,
             min: 1,
             max: day_num
           });
           
           if(day_value <= day_num){
           	 var closure_this = this;
           	 /* 解决 ie6 selected 属性无法修改的 问题 */
             setTimeout(function(){
             	closure_this.other_jq.day.val(day_value);}, 1);
           }
           
         }
       }
     }, true),
     tab: component_base.inherit({
       /**
        * 构造函数
        * @param <object> com_info {
        *   jq: 作为整个tab的容器
        *   class: 具有该class的a元素将能透过其href属性来指定显示的内容
        *     默认为‘tab’
        *   clicked_class: 当tab被点击后将被赋予的calss类
        * }
        */
       constructor: function(com_info){
         this._class = com_info._class || this._class;
         this.base_jq = com_info.jq;
         
         // 作为闭包引用
         var closure_this = this;
         // 用于存放所有的目标,对应的jQuery对象
         this.targets = {};
         
         /**
          * 储存所有tab标签的列表，每个成员为对应tab A元素的jQuery对象
          * 每个对象具有tar_target 指向目标对应的jQuery对象
          * target_id 为目标的id值
          */
         this.tabs = this.base_jq.find('a.' + this._class);
         
         // 将每个tab的目标绑定在自己的属性tab_target上
         this.tabs.each(function(){
           var target_id = $(this).attr('href').substr(1);
           this.tab_target = $('#' + target_id);
           this.target_id = target_id;
           // 将target放多列表中
           closure_this.targets[target_id] = this.tab_target;
         });
         
         // 注册tab点击事件
         this._event.reg({
           type: 'click',
           name: 'tab_click',
           jq: this.tabs
         });
         
         // 响应tab点击事件
         this.controller.response({
           tab_click: {
             tab_switch: function(args){
               closure_this.hide_all();
               args._this.tab_target.show();
               closure_this.change_class(args._this);
             }
           }
         });
         
         // 默认显示第一个元素
         this.show(this.tabs[0].target_id);
         
       },
       prototype: {
         _class: 'tab',
         clicked_class: 'clicked_tab',
         /**
          * 隐藏所有的tab
          */
         hide_all: function(){
           this.tabs.each(function(){
             this.tab_target.hide();
           });
         },
         /**
          * 根据target的id显示target
          */
         show: function(target_id){
           this.hide_all();
           this.targets[target_id].show();
         },
         /**
          * 当tab被点击后，进行class的更新
          * 先对所有的tab取消clicked_class，然后为被点击的tab添加clicked_tab
          */
         change_class: function(clicked_tab){
           var clicked_class = this.clicked_class;
           this.tabs.each(function(){
             $(this).removeClass(clicked_class);
           });
           $(clicked_tab).addClass(clicked_class);
         },
         /**
          * 添加一个在tab被点击时的回调函数
          * @param <function> fn
          */
         click: function(fn){
           // 产生一个随机数作为id
           var random_num = Math.random() * 10000;
           var response_obj = {tab_click:{}};
           response_obj.tab_click['tab_' + random_num] = fn;
           // 响应tab点击事件
           this.controller.response(response_obj);
           return this;
         }
       }
     }, true),
     /**
      * 分页组件
      */
     paging: component_base.inherit({
       /**
        * com_info {
        *   data
        *   class
        *   tag
        *   id
        *   setting {
        *     offset: 30
        *     link_num: 3
        *     next: '下一页'
        *     prev: '上一页'
        *     first: '首页'
        *     last: '末页'
        *   }
        * }
        */
       constructor: function(com_info){
         // 读取组件设置
         this._class = com_info._class || this._class;
         this.id =com_info.id || this.id;
         this.tag = com_info.tag || this.tag;
         for(var set_name in com_info.setting){
           this.setting[set_name] = com_info.setting[set_name];
         }
         
         // 初始话组建DOM
         this.init(com_info.data);
         
       },
       prototype: {
         init: function(data){
           
           this.data = data || [];
           
           // 初始化变量们
           this.onswitch_fn = this.onswitch_fn || {};
           this.cur_list = [];
           this.total_num = this.data.length;
           this.total_page = parseInt(this.data.length / this.setting.offset);
           if((this.total_page < this.data.length / this.setting.offset) || this.data.length === 0){
             this.total_page += 1;
           }
           
           this.cur_index = 1;
           this.first_index = 1;
           this.last_index = this.total_page;
           
           this.set_cur(this.cur_index);
           
           this.build();
           
           this.update_visibility();
           
           /**
            * 注册事件
            * 所有的a元素被点击
            */
           this._event.reg({
             jq: this.base_jq.find('a'),
             type: 'click',
             name: 'page_switch'
           });
           
           var closure_this = this;
           this.controller.response({
             page_switch: {
               rebuild: function(args){
               	 /* 在ie8以下 无法直接获取href的值，获得的均为绝对的url地址 */
               	 var a_href = $(args._this).attr('href');
                 var cur_index = a_href.substring(a_href.indexOf('#') + 1);
                 // 设置当前页并跟新数据
                 closure_this.set_cur(cur_index);
                 // 根据新的当前页更新各部分的可见性
                 closure_this.update_visibility();
                 // 更新各链接的值
                 closure_this.update_value();
                 // 重新添加事件
                 closure_this._event.set_jq('page_switch', closure_this.base_jq.find('a'));
                 
                 for(switch_fn_name in closure_this.onswitch_fn){
                 	closure_this.onswitch_fn[switch_fn_name](args);
                 }
               }
             }
           });
         
         },
         build: function(){
           // 若base_jq为空对象 则创建（说明这是在组件的构造函数中的调用）
           if(jQuery.isEmptyObject(this.base_jq)){
             var paging = '<' + this.tag + ' class="' + this._class + '" id="' + this.id +'" ></' + this.tag +'>';
             this.base_jq =  $(paging);
           }
           // 清空
           this.base_jq.empty();
           
           this.first = $('<span class="' + this._class + '_first" id="' + this.id +'_first" ><a href="#' + this.first_index + '" >' + this.setting.first + '</a></span>').appendTo(this.base_jq);
           this.prev = $('<span class="' + this._class + '_prev" id="' + this.id +'_prev" ><a href="#' + this.prev_index + '" >' + this.setting.prev + '</a></span>').appendTo(this.base_jq);
           this.cur_left = $('<span class="' + this._class + '_cur_left" id="' + this.id +'_cur_left" ></span>').appendTo(this.base_jq);
           this.cur = $('<span class="' + this._class + '_cur" id="' + this.id +'_cur" >' + this.cur_index + '</span>').appendTo(this.base_jq);
           this.cur_right = $('<span class="' + this._class + '_cur_right" id="' + this.id +'_cur_right" ></span>').appendTo(this.base_jq);
           this.next = $('<span class="' + this._class + '_next" id="' + this.id +'_next" ><a href="#' + this.next_index + '" >' + this.setting.next + '</a></span>').appendTo(this.base_jq);
           this.last = $('<span class="' + this._class + '_last" id="' + this.id +'_last" ><a href="#' + this.last_index + '" >' + this.setting.last+ '</a></span>').appendTo(this.base_jq);
         
         },
         /* 将组件放置到指定dom元素后面 */
         after: function(target_dom){
           $(target_dom).after(this.base_jq);
         },
         /* 组件的相关设置 */
         setting: {
           /* 每页的数量 */
           offset: 30,
           /* 放在你当前页码的前面和后面的“数字”链接的数量 */
           link_num: 3,
           next: '下一页',
           prev: '上一页',
           first: '首页',
           last: '末页'
         },
         id: 'nyJS_paging',
         _class: 'nyJS_paging',
         tag: 'p',
         /**
          * 根据当前页建立当前页两遍的数字链接 
          */
         set_link_num: function(){
           // 清空
           this.cur_right.empty();
           this.cur_left.empty();
           // 获取link_num的长度
           var right_num = this.get_index('cur_right');
           var left_num = this.get_index('cur_left');
           // 建立links
           for(var index = (this.cur_index + 1); index < (this.cur_index + right_num + 1); index++){
             this.cur_right.append('<a href="#' + index + '" >' + index + '</a>');
           }
           for(index = (this.cur_index - left_num); index < this.cur_index; index++){
             this.cur_left.append('<a href="#' + index + '" >' + index + '</a>');
           }
         },
         /**
          * 获得当前列表的内容
          */
         get_list: function(page_num){
           if(page_num === undefined){
             page_num = this.cur_index;
           }
           // 检查是否超过页数
           if(page_num <= this.total_page){
             // 获取该页最后一项的索引值
             var list_right = ((this.setting.offset * page_num) > (this.total_num) ? this.total_num : this.setting.offset * page_num) - 1;
             var list = [];
             for(var index = this.setting.offset * (page_num - 1); index <= list_right; index++){
                list.push(this.data[index]);
             }
             return list;
           }
         },
         set: function(offset){
           
         },
         /**
          * 根据当前的页数获得其他页数
          */
         get_index: function(type){
           switch(type){
             case 'cur':
               return this.cur_index;
               break;
             case 'next':
               return (this.cur_index + 1 > this.total_page) ? 0 : this.cur_index + 1;
               break;
             case 'prev':
               return (this.cur_index - 1 < 1) ? 0 : this.cur_index - 1;
               break;
             case 'first':
               return this.first_index;
               break;
             case 'last':
               return this.last_index;
               break;
             case 'cur_right':
               return ((this.cur_index + this.setting.link_num) > this.total_page) ? this.total_page - this.cur_index : this.setting.link_num;
               break;
             case 'cur_left':
               return ((this.cur_index - this.setting.link_num) < this.first_index) ? this.cur_index - this.first_index  : this.setting.link_num;
               break;
           }
         },
         /**
          * 设置当前页，并更新其他index的值以及当前页的数据(this.cur_list)
          */
         set_cur: function(cur_num){
           // 检查页数是否合法
           if(cur_num > 0 && cur_num <= this.total_page){
             this.cur_index = parseInt(cur_num);
             this.next_index = this.get_index('next');
             this.prev_index = this.get_index('prev');
             this.first_index = this.get_index('first');
             this.last_index = this.get_index('last');
             this.cur_right_index = this.get_index('cur_right');
             this.cur_left_index = this.get_index('cur_left');
           }
           this.cur_list = this.get_list();
         },
         /**
          * 更新组件中个部分的可见性（根据当前页的状态）
          */
         update_visibility: function(){
           // 重建列表
           this.build();
           
           var cur_num = this.cur_index;
           if(this.cur_index !== this.first_index){
             this.first.show();
             this.prev.show();
           } 
           else{
             this.first.hide();
             this.prev.hide();
           } 
           if(this.cur_index !== this.last_index){
             this.last.show();
             this.next.show();
           } 
           else{
             this.last.hide();
             this.next.hide();
           } 
           this.set_link_num();
           
           if(this.total_page > 1){
             this.base_jq.show();
           }
           else {
             this.base_jq.hide();
           }
         },
         /**
          * 更新各链接的值
          */
         update_value: function(){
           this.cur.text(this.cur_index);
           this.prev.find('a').attr('href', '#' + this.prev_index);
           this.next.find('a').attr('href', '#' + this.next_index);
         },
         /**
          * 翻页事件接口，该方法将在翻页组件更新后被调用
          */
         onswitch: function(fn){
         	// 产生一个随机数作为id
           var random_num = Math.random() * 10000;
           this.onswitch_fn['paging_switch_' + random_num] = fn;
           return this;
         }
       }
     }, true),
     overlay: component_base.inherit({
       /**
        * com_info {
        *   target 
        *   color
        *   id cover 的id
        *   class cover 的class
        *   before_show()
        *   before_hide()
        * }
        */
       constructor: function(com_info){
         this.other_jq.target = com_info.target;
         this.before_show = com_info.before_show || this.before_show;
         this.before_hide = com_info.before_hide || this.before_hide;
         
         this.base_jq = $('<div id="' + this.id + '" class="' + this._class + '" ></div>');
         this.base_jq.css({
           width: '100%',
           height: '100%',
           display: 'none',
           position: 'absolute',
           top: '0',
           left: '0',
           'z-index': '8'
         });
         this.base_jq.appendTo(document.body);
         this.other_jq.overlay = $('<div id="' + this.id + '_cover" class="' + this._class + '_cover" ></div>');
         this.other_jq.overlay.css({
           width: '100%',
           height: $(document).height() + 'px',
           'background-color': this.color,
           opacity: '0.5'
         });
         this.other_jq.target_container = $('<div id="' + this.id + '_container" class="' + this._class + '_container" ></div>');
         this.other_jq.target_container.css({
           width: this.other_jq.target.css('width'),
           height: this.other_jq.target.css('height'),
           position: 'absolute',
           top: (parseInt($(window).height()) - parseInt(this.other_jq.target.height()))/2 + 'px',  
           left: (parseInt($(document).width()) - parseInt(this.other_jq.target.width()))/2 + 'px', 
           'z-index': '999'
         });
         this.other_jq.target_container.appendTo(this.base_jq);
         this.other_jq.overlay.appendTo(this.base_jq);
         this.other_jq.target.appendTo(this.other_jq.target_container);
         
         var closure_this = this;
         // 添加事件
         this._event.reg({
           type: 'click',
           jq: this.other_jq.overlay,
           name: 'cover_click'
         });
         
         this.controller.response({
           cover_click: {
             hide: function(){
               closure_this.hide();
             }
           }
         });
       },
       prototype: {
         id: 'nyJS_overlay',
         _class: 'nyJS_overlay',
         color: 'black',
         show: function(option){
           this.before_show();
           this.base_jq.show(option);
         },
         hide: function(option){
           this.before_hide();
           this.base_jq.hide(option);
         },
         before_show: function(){
         },
         before_hide: function(){
         }
       }
     }, true)
   }
 };
 

 //===========================================
 // 其他工具函数 Utilities
 //===========================================
 function Utilities(){
 }; 
 Utilities.add_proto({
   
   /**
    * 用于导入js文件
    * 支持绝对路经和相对路经导入（相对当前js文件）
    * 支持多级嵌套导入
    * @url <string> js文件的路经
    * @script_name js文件的别名，若指定 则将保留一份导入的脚本备份，以便再次调用
    * @if_run 是否在载入后马上运行
    */
   importJS: function(url, script_name, if_run){
     if_run = (if_run === undefined) ? true : if_run;
     var closure_this = this;
     url = this.handle_url(url);
     
     // 下面两句是为了解决嵌套导入的问题，如 A文件中导入了B，B文件中又导入了C
     // 思路是：当A开始进行导入操作时（还未导入成功，但是B文件的绝对路经已经计算出来了以后，将B的绝对路经入栈
     // 这个时候在B中导入C的时候，直接读取栈顶元素（也就是B）作为当前文件路经进行计算C的绝对路经
     // 每次在success和error回调函数中将栈顶元素弹出
     
     // 将url添加到import_stack中
     this.import_stack.push(url);
     
     // 若文件尚未导入过
     if(!this.if_imported(url)){
       var ajax_setting = {
         url: url,
         async: false,
         type: "post",
         success: function(data){
           console.log("JavaScript 文件导入成功，以下为脚本内容！");
           console.log(data);
           // 若脚本指定了别名，则将其储存
           if(script_name !== undefined){
             closure_this.script_list[script_name] = data;
           }
           // 建导入文件的url添加到 import_list 中
           closure_this.import_list.push(url);
           // 将import_stack上的文件pop掉
           closure_this.import_stack.pop();
         },
         error: function(jqXHR, textStatus, errorThrown){
           console.log("JavaScript 文件导入失败！");
           console.log("textStatus: " + textStatus);
           console.log("errorThrown: " + errorThrown);
           // 将import_stack上的文件pop掉
           closure_this.import_stack.pop();
         }
       };
       if(if_run == true){
         ajax_setting.dataType = "script";
       }
       else {
         ajax_setting.dataType = "text";
       }
       $.ajax(ajax_setting);
     }
     else{
       console.log(url + "--- 导入失败，该文件无法重复导入！");
     }
   },
   /**
    * 返回指定别名的脚本
    * @param <string> script_name
    */
   script: function(script_name){
     return this.script_list[script_name];
   },
   /**
    * 将相对路经转化为绝对路经
    * 若为绝对路经则直接返回
    */
   handle_url: function(url){
     // 若为完整路经
     if(url.toLowerCase().indexOf("://") > 0 ){
       return url;
     }
     // 若为相对路经
     else{
         // 获取当前文件路经
       var local_path = this.get_local_path();
       // 保存网址协议部分， 以备最后重新构造url的时候使用
       var http_str = local_path.substring(0, local_path.indexOf("://") + 3);
       // 将网址中的协议部分和最后的文件部分去掉
       local_path = local_path.substring(local_path.indexOf("://") + 3, local_path.lastIndexOf("/"));
       // 利用“/”将url分割
       var local_array = local_path.split("/");
       var url_array = url.split("/");
       
       while(url_array.length > 0){
         // 若为".."，则将local_array中最后一个元素pop掉
         if(url_array[0] === ".."){
           local_array.pop();
         }
         // 若不为"..", 则可能为文件名或者路经名，push到local_array中去
         else{
           local_array.push(url_array[0]);
         }
         // 删除url_array的第一个元素
         url_array.splice(0, 1);
       }
     }
    
     // 构造新url
     var url_handled = http_str;
     for(var i = 0; i < local_array.length; i++){
       if(i !== (local_array.length - 1)){
         url_handled += (local_array[i] + "/");
       }
       else{
         url_handled += local_array[i];
       }
     }
     return url_handled;
   },
   /**
    * 获取当前javascript所在文件的绝对路经
    * 通过动态的创建一个script标签，并赋予id，通过定位它来找到当前Script
    * 使用script是为了在head中也可以使用
    * 
    * @return <string> 路经
    */
   get_local_path: function(){
     // 若导入文件栈中还有文件，说明当前导入是在上一个被导入的文件中
     if(this.import_stack.length > 0){
       return this.import_stack[this.import_stack.length - 1];
     }
     // 根据前缀和当前时间戳作为临时 script节点的id
     var timestamp = (new Date()).valueOf();
     var id_prefix = "timestamp_";
     var script_id = id_prefix + timestamp;
     // 添加script
     document.write("<script id=\"" + script_id + "\" ></script>");
     var temp_script = document.getElementById(script_id);
     // 利用新建的script找到当前文件所在scrip
     var _this = temp_script.previousSibling;
     // 删除新建的这个script
     temp_script.parentNode.removeChild(temp_script);
     // 返回路经
     return _this.src;
   },
   /**
    * 检查url是否已经导入
    * 该url需要为被处理过的绝对路经
    * @param <string> url
    * @return <boolen>
    */
   if_imported: function(url){
     for(var i = 0; i < this.import_list.length; i++){
       if(this.import_list[i] === url){
         return true;
       }
     }
     return false;
   },
   /**
    * 用于存储已经导入的文件 防止同一文件重复导入
    */
   import_list: [],
   /**
    * 正在导入的文件栈
    * 用于存放一个文件在导入开始和导入操作完成之间的临时url备份
    * 用于解决多级嵌套导入的问题
    */
   import_stack: [],
   /**
    * 用于存储导入的脚本（当导入的脚本被指定别名时）
    */
   script_list: {}
 });
 
 window.nyJS = {
   model: new model(),
   view: new view(),
   _event: new _event("nyJS"),
   component: new component(),
   utility: new Utilities()
 }
 nyJS.controller = new controller();
 
})(window);
