/**
 * 用于生成 教师激活其信息可见行的tip
 */
$(document).ready(function(){
  
  
  // ========================================
  // 创建视图
  // ========================================
  var v_active = nyJS.view.create({
    constructor: function(){
      this.build();
    },
    prototype: {
      dom_str: '<div id="activation_tip">\
                 <span>您当前处于未激活状态，您的个人信息对其他人不可见。请确定正确修改自己的信息后，点击激活按钮，以便其他人能查看到您的信息。</span>\
                 <input type="button" id="activation_button" value="现在激活" />\
                </div>',
      build: function(){
        this.active_tip = $(this.dom_str).prependTo('body').hide();
        this.active_tip.show('slow');
        this.tip = $('#activation_tip span');
        this.button = $('#activation_button');
      },
      show: function(){
        this.active_tip.show.apply(this, arguments);
      },
      hide: function(){
        this.active_tip.hide.apply(this.active_tip, arguments);
      },
      destroy: function(){
        this.active_tip.remove();
      },
      text: function(text){
        this.tip.text(text);
      },
      button_text: function(text){
        this.button.val(text);
      },
      button_disabled: function(dis){
        this.button.attr('disabled', dis);
      }
    }
  });
  
  // ========================================
  // 创建控制器
  // ========================================
  var c_active = nyJS.controller.create();
  
  // ========================================
  // 注册事件
  // ========================================
  nyJS._event.reg({
    jq: $('#activation_button'),
    type: 'click',
    name: 'activition'
  });
  
  // ========================================
  // 时间相应
  // ========================================
  c_active.response({
    activition: {
      active: function(){
        // 向服务器发送激活请求
        m_teacher.post({
          name: 'teacher_active',
          type: 'teacher_active',
          data: {
            id_str: m_teacher.get_id_str()
          }
        });
      }
    }
  });
  
  c_active.response_ajax({
    teacher_active: {
      before_send: {
        ajax_loading: function(){
          v_active.button_text('正在激活...');
          v_active.button_disabled(true);
        }
      },
      complete: {
        ajax_finish: function(){
        }
      },
      // 数据请求成功，利用试图将数据填充到表单中
      success: {
        ajax_success: function(args){
          var result = ajax_helper.success(args)
          if(result === true){
            v_active.button.hide();
            v_active.text('激活成功！');
            v_active.active_tip.delay(3000).hide('fast', function(){v_active.destroy();});
            
          }
          else{
            v_active.button_text('激活失败！请重试！');
            v_active.button_disabled(false);
          }
          
        }
      },
      error: {
        ajax_error: function(args){
          v_active.text(ajax_helper.error(args));
          v_active.button_text('激活失败！请重试！');
          v_active.button_disabled(false);
        }
      }
    }
  });
  
})
