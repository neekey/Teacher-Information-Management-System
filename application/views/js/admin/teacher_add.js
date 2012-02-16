/**
 * 教师添加页面的全局js文件
 * 在该文件工导入其他其他js文件
 */

$(document).ready(function(){
  // ========================================
  // 创建控制器
  // ========================================
  var c_add = nyJS.controller.create({
    prototype: {
      /**
       * 当添加了一个 添加教师的列表后重建表单组建
       */
      rebuild_form: function(){
        form = nyJS.component.create('form', {
          tag: 'span',
          _class: 'add_form_tip input_tip',
          jq: $('#teacher_add_form')
        });
        // 为新 添加 按钮添加事件
        nyJS._event.add_jq('add', $('#add_ul li:last-child .add_button'));
        // 为新 修改 按钮添加事件
        nyJS._event.add_jq('edit', $('#add_ul li:last-child .edit_button'));
         // 为新 修改 按钮添加事件
        nyJS._event.add_jq('close', $('#add_ul li:last-child .close_button'));
      }
    }
  });
  
  // ========================================
  // 创建视图
  // ========================================
  
  // 教师添加列表
  var v_add_list = nyJS.view.create({
    constructor: function(){
      this.ul.find('.edit_button, .close_button').hide();
    },
    prototype: {
      ul: $('#add_ul'),
      /**
       * 用于管理教师已经成功添加的列表 jQuery对象
       * 教师id为索引
       */ 
      li: {},
      /**
       * 获取指定li内的表单值
       * 返回教师数据{
       *   email
       *   name
       * }
       */
      get_value: function(li){
        var new_teacher = {
          email: $(li).find('.email').val(),
          name: $(li).find('.name').val()
        };
        return new_teacher;
      },
      /**
       * 添加一个 用于添加教师的列表
       */
      add_li: function(){
        var new_li = "<li ><label class='email_label' >邮箱</label>";
        new_li += "<input class='email required input_text' type='text' />";
        new_li += "<label class='email_label' >姓名</label>";
        new_li += "<input class='name required input_text' type='text' />";
        new_li += "<input class='add_button input_button' type='button' value='添加' >";
        new_li += "<input class='edit_button input_button' type='button' value='修改' style='display: none' >";
        new_li += "<input class='close_button input_button' type='button' value='关闭' style='display: none' ></li>";
        $(new_li).appendTo(this.ul);
      },
      /**
       * 将一个列表由 添加改为编辑状态
       */
      save_li: function(li, id_str){
        // 将教师id_str储存为li的teacher_id_str属性
        li.teacher_id_str = id_str;
        // 将当前表单信息添加进去
        li.teacher_data = {
          name: $(li).find('.name').val(),
          email: $(li).find('.email').val()
        };
        // 将邮箱表单设置为不可编辑
        $(li).find('.email').attr('disabled', 'disabled');
        // 将添加按钮隐藏
        $(li).find('.add_button').hide();
        // 显示修改按钮
        $(li).find('.edit_button').show();
        $(li).find('.close_button').show();
        $(li).append('<a href="' + teachersys.base_url + 'admin/teacher_edit/' + id_str + '" >详细信息</a>');
      },
      /**
       * 检查li的值教上一次有没有变化
       */
      check_li_change: function(li){
        return (li.teacher_data.name !== $(li).find('.name').val() || li.teacher_data.email !== $(li).find('.email').val())
      },
      update_li_data: function(li){
        li.teacher_data.name = $(li).find('.name').val();
        li.teacher_data.email = $(li).find('.email').val();
      }
    }
  });
  
  // ========================================
  // 创建组件
  // ========================================
  
  // 构造tip组建 用于ajax动作的信息通知
  var ajax_tip = nyJS.component.create('tip',{
    tag: 'p',
    _class: 'ajax_tip',
    text: '正在搜索...'
  });
  
  // 表单验证组建
  var form = nyJS.component.create('form', {
    tag: 'span',
    _class: 'add_form_tip input_tip tip',
    jq: $('#teacher_add_form')
  });
  
  // ========================================
  // 注册事件
  // ========================================
  
  // 添加教师按钮被点击
  nyJS._event.reg({
    type: 'click',
    name: 'add',
    jq: $('.add_button')
  });
  
  // 继续添加按钮被按下
  nyJS._event.reg({
    type: 'click',
    name: 'add_item',
    jq: $('#add_item')
  });
  
  // 修改按钮被按下
  nyJS._event.reg({
    type: 'click',
    name: 'edit',
    jq: $('.edit_button')
  });
  
  // 关闭按钮被按下
  nyJS._event.reg({
    type: 'click',
    name: 'close',
    jq: $('.close_button')
  });
  
  // ========================================
  // 响应事件
  // ========================================
  c_add.response({
    // 添加教师按钮被点击
    add: {
      add_teacher: function(args){
        var for_check = $(args._this).siblings('.email, .name');
        // 对所在列表进行验证
        if((form.check_field(for_check[0]) === true) && (form.check_field(for_check[1]) === true)){
          
          // 获取表单信息
          var new_teacher = v_add_list.get_value(args._this.parentNode);
          var email_node = $(args._this.parentNode).find('.email');
          // 向服务器发送数据
          m_teacher.post({
            name: 'teacher_add',
            type: 'add_teacher',
            data: new_teacher,
            additional: args._this.parentNode
          });
          
        }
      }
    },
     // 继续添加按钮被按下
    add_item: {
      add_item: function(){
        // 添加一个新列表
        v_add_list.add_li();
        // 为该新列表添加事件
        c_add.rebuild_form();
      }
    },
    // 修改按钮被按下
    edit: {
      update: function(args){
        var for_check = $(args._this).siblings('.email, .name');
        // 对所在列表进行验证
        if((form.check_field(for_check[0]) === true) && (form.check_field(for_check[1]) === true)){
          
          var li = args._this.parentNode;
          // 检查表单的值是否有发生变化
          if(v_add_list.check_li_change(li)){
            
            // 获得数据
            var update = v_add_list.get_value(li);
            // 发送ajax请求 对教师信息进行更新
            m_teacher.post({
              name: 'teacher_info',
              type: 'update',
              data: {
                id_str: li.teacher_id_str,
                update: update
              },
              additional: li
            });
          }
        }
      }
    },
    close: {
      // 将li移除
      remove_li: function(args){
        $(args._this.parentNode).remove();
      }
    }
  });
  
  // ========================================
  // ajax事件响应
  // ========================================
  c_add.response_ajax({
    // 教师添加
    teacher_add: {
      before_send: {
        ajax_loading: function(){
          ajax_tip.set('正在提交数据...');
          ajax_tip.show();
        }
      },
      complete: {
        ajax_finish: function(){
          ajax_tip.delay(4000).hide(1);
        }
      },
      // 数据请求成功
      success: {
        ajax_success: function(args){
          var data = args.data;
          var li = args.additional;
          
          var result = ajax_helper.success(args)
          if(result === true){
            var id_str = data.data.id_str;
            // 修改列表为编辑状态
            v_add_list.save_li(li, id_str);
            ajax_tip.set('教师添加成功!');
          }
          else{
            // 若邮箱已经存在
            if(data.data.error_type === 'email_exist'){
              
              var email_jq = $(li).find('.email')
              var email = email_jq.val();
              // 先将表单内容清空
              email_jq.val('');
              // 对表单进行检查，使得tip产生
              form.check_field(email_jq[0]);
              // 还原表单内容
              email_jq.val(email);
              // 设置错误内容
              email_jq[0].nyJS_tip.set(data.data.error);
            }
            ajax_tip.set('教师添加失败...');
          }
          
        }
      },
      error: {
        ajax_error: function(args){
          ajax_tip.set(ajax_helper.error(args));
        }
      }
    },
    // 教师信息修改
    teacher_info: {
      before_send: {
        ajax_loading: function(){
          ajax_tip.set('正在提交数据...');
          ajax_tip.show();
        }
      },
      complete: {
        ajax_finish: function(){
          ajax_tip.delay(4000).hide(1);
        }
      },
      // 数据请求成功
      success: {
        ajax_success: function(args){
          var result = ajax_helper.success(args)
          if(result === true){
            var li = args.additional;
            var name = $(li).find('.name').val();
            v_add_list.update_li_data(li);
            ajax_tip.set('您对教师' + name + '信息修改成功！');
          }
          else
            ajax_tip.set(result);
        }
      },
      error: {
        ajax_error: function(args){
          ajax_tip.set(ajax_helper.error(args));
        }
      }
    }
  });
});

