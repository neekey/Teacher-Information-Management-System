/**
 * 用于教师基本信息部分的js 
 * 本js文件需要被 teacher_info_edit.js 文件导入
 * 本文件中使用了许多父文件 teacher_info_edit.js 定义的组建及变量
 * 
 * @author Neekey <ni184775761@gmai.com>
 */

// ========================================
// 构造控制器
// ========================================
var c_teacher = nyJS.controller.create();

// 构造表单组建 basic_info_form
var basic_info_form = nyJS.component.create('form',{
  tag: 'p',
  _class: 'basic_info_form_tip  tip input_tip',
  jq: $('#basic_info_form')
});
// 设置 验证规则
basic_info_form.set_rules({
  required:{
    msg: '该字段不能为空！'
  },
  email: {
    msg: '非法的email格式！'
  },
  phone: {
    msg: '非法的手机号码格式！'
  }
})

// 创建date组建
var birthday_select = nyJS.component.create('date',{
  target: $('#birthday'),
  year: $('#birthday_year'),
  month: $('#birthday_month'),
  day: $('#birthday_day')
});

// 创建date组建
var report_select = nyJS.component.create('date',{
  target: $('#report_date'),
  year: $('#report_date_year'),
  month: $('#report_date_month'),
  day: $('#report_date_day')
});

// ========================================
// 注册事件
// ========================================

// 表单字段的值发生变化时
nyJS._event.reg({
  type: 'change',
  name: 'teacher_info_change',
  jq: $('#basic_info_form input, #basic_info_form select, #basic_info_form textarea')
});

// ========================================
// 事件响应
// ========================================
c_teacher.response({
  teacher_info_change: {
    /**
     * 当字段改变，对教师信息进行更新
     */
    teacher_info_change_fn: function(args){
      // 对当前字段进行检查
      if(basic_info_form.check_field(args._this) === true){
        
        
        // 获取当前字段值
        var value = args._this.value;
        // 获取字段类型
        var field_name = args._this.name;
        
        // 如果为时间选择菜单
        if($(args._this).siblings('input').length > 0){
          value = $(args._this).siblings('input').val();
          field_name = $(args._this).siblings('input').attr('name');
        }
        
        var update = {};
        update[field_name] = value;
        
        // 发送ajax请求 对教师信息进行更新
        m_teacher.post({
          name: 'teacher_info',
          type: 'update',
          data: {
            id_str: m_teacher.get_id_str(),
            update: update
          },
          additional: args._this
        });
      }
    }
  }
});

// ========================================
// ajax事件响应
// ========================================
c_teacher.response_ajax({
  /**
   * 用于教师信息更新的ajax
   */
  teacher_info: {
    before_send: {
      ajax_loading: function(){
        ajax_tip.set('正在保存...');
        ajax_tip.show();
      }
    },
    complete: {
      ajax_finish: function(args){
        ajax_tip.delay(4000).hide(1);
      }
    },
    success: {
      ajax_success: function(args){
        var result = ajax_helper.success(args)
        if(result === true){
          var field_name = $(args.additional).siblings('label').text();
          ajax_tip.set('您对 ' + field_name + '  的更改已经保存！');
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