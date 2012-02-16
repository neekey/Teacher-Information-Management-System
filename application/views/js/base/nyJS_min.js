/**
 * @author Neekey
 */

(function(window,undefined){
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
       /**
        * 设置header
        */ 
       headers: {
         http_type: "ajax"
       },
       /**
        * url
        */ 
       url: "",
       /**
        * 是否发送异步请求
        */ 
       async: true,
       /**
        * 返回数据的类型
        */
       dataType: "json",
       /**
        * 数据发送方式
        */
       type: "post",
       /**
        * 实际发送数据
        */ 
       data: 30000,
       /**
        * 默认的超时时间为30秒
        */
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
 
 
 
 window.nyJS = {
   model: new model(),
   view: new view(),
   _event: new _event("nyJS")
 }
 nyJS.controller = new controller();	
})(window);