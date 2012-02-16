/**
 * 登录界面js文件
 * 主要进行表单验证
 */
$(document).ready(function(){
  
  var c_login = nyJS.controller.create();
  
  // 构造表单组建 basic_info_form
  var login_form = nyJS.component.create('form',{
    tag: 'p',
    _class: 'tip input_tip',
    jq: $('form')
  });
  // 设置 验证规则
  login_form.set_rules({
    required:{
      msg: '该字段不能为空！'
    }
  });
  
  // ========================================
  // 注册事件
  // ========================================
  
  // 表单字段的值发生变化时
  nyJS._event.reg({
    type: 'change',
    name: 'login_input_change',
    jq: $('input[type=text], input[type=password]')
  });
  nyJS._event.reg({
    type: 'click',
    name: 'login_reset',
    jq: $('input[type=reset]')
  })

  // ========================================
  // 事件响应
  // ========================================
  c_login.response({
    login_input_change: {
      /**
       * 当字段改变，对教师信息进行更新
       */
      check: function(args){
        login_form.check_field(args._this);
      }
    },
    login_reset: {
      reset: function(){
        login_form.clear_tip();
      }
    }
  });
  
  
});