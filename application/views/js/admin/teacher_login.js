/**
 * 用于教师密码修改部分的js 
 * 本js文件需要被 teacher_info_edit.js 文件导入
 * 本文件中使用了许多父文件 teacher_info_edit.js 定义的组建及变量
 * 
 * @author Neekey <ni184775761@gmai.com>
 */
 
// ========================================
// 创建控制器
// ======================================== 
var c_teacher_login = nyJS.controller.create();

// ========================================
// 创建视图
// ========================================
var v_pass_form = nyJS.view.create({
  constructor: function(){
    
  },
  prototype: {
    pass_form: $('#login_info_form'),
    pass: $('#password'),
    // 获取表单中的密码
    password: function(){
      return this.pass.val();
    },
    // 重置表单
    clear: function(){
      this.pass_form[0].reset();
    }
  }
});
// ========================================
// 创建组件
// ========================================

// 表单验证组建
var teacher_login_form = nyJS.component.create('form',{
  tag: 'p',
  _class: 'login_info_form_tip  tip input_tip',
  jq: $('#login_info_form')
});

// 设置 验证规则
teacher_login_form.set_rules({
  required:{
    msg: '该字段不能为空！'
  }
});

// ========================================
// 事件注册
// ========================================


// 表单字段的值发生变化时
nyJS._event.reg({
  type: 'change',
  name: 'teacher_login_change',
  jq: $('#login_info_form input')
});
// 修改字段被点击时
nyJS._event.reg({
  type: 'click',
  name: 'teacher_login_click',
  jq: $('#password_change')
});

// ========================================
// 事件响应
// ========================================


c_teacher_login.response({
  // 当表单内容发生变化时
  teacher_login_change: {
    field_check: function(args){
      teacher_login_form.check_field(args._this);
    }
  },
  // 当用户点击修改按钮
  teacher_login_click: {
    form_save: function(args){
      // 若表单正确
      if(teacher_login_form.check()){
        m_teacher.post({
          name: 'teacher_login_update',
          type: 'update_password',
          data: {
            id_str: m_teacher.get_id_str(),
            password: v_pass_form.password(),
          }
        });
      }
    }
  }
});

// ajax事件响应
c_teacher_other.response_ajax({
  // 密码修改
  teacher_login_update: {
    before_send: {
      ajax_loading: function(){
        ajax_tip.set('正在保存...');
        ajax_tip.show();
      }
    },
    complete: {
      // 数据请求完成，清空表单
      ajax_finish: function(){
        ajax_tip.delay(4000).hide(1);
        v_pass_form.clear();
      }
    },
    // 数据请求成功
    success: {
      ajax_success: function(args){
        var result = ajax_helper.success(args)
        if(result === true){
          ajax_tip.set('密码修改成功！');
        }
        else
          ajax_tip.set('保存失败！请稍候重试');
      }
    },
    error: {
      ajax_error: function(args){
        ajax_tip.set(ajax_helper.error(args));
      }
    }
  }
});