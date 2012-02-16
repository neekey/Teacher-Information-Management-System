/**
 * 教师搜索页面的全局js文件
 * 在该文件工导入其他其他js文件
 */
 
// ajax 模型
// nyJS.utility.importJS('../model/m_ajax');

$(document).ready(function(){
  // ========================================
  // 创建控制器
  // ========================================
  var c_search = nyJS.controller.create();
  
  // ========================================
  // 创建视图
  // ========================================
  
  // 设置块
  var v_setting = nyJS.view.create({
    constructor: function(){
      
      // 默认将设置隐藏
      this.toggle();
    },
    prototype: {
      setting_div: $('#setting'),
      handler: $('#setting_handler'),
      tru: $('#teac_rese_unit'),
      sex: $('#sex'),
      title_type: $('#title1_type'),
      title_level: $('title1_level'),
      toggle: function(){
        this.setting_div.toggle();
      },
      get_setting: function(){
        var tru = this.tru.val();
        var sex = this.sex.val();
        var type = this.title_type.val();
        var level = this.title_level.val();
        
        var setting = {};
        if(tru !== 'null'){
          setting.teac_rese_unit = tru;
        }
        if(sex !== 'null'){
          setting.sex = sex;
        }
        if(type !== 'null'){
          setting.title1_type = type;
        }
        if(level !== 'null'){
          setting.title1_level = level;
        }
        return setting;
      },
      checked: function(){
        return (this.handler.attr('checked') === true);
      }
    }
  });
  
  // 搜索结果列表
  var v_list = nyJS.view.create({
    constructor: function(){
      
    },
    prototype: {
      url: teachersys.base_url + 'admin/teacher_edit/',
      ul: $('#teacher_list'),
      add_teacher: function(teacher){
        teacher.brief = this.brief_handle(teacher.brief);
        var new_li = '<li id="' + teacher.id + '"><a href="' + this.url + teacher.id + '" >';
        new_li += '<span class="teacher_name">' + teacher.name + '</span></a>';
        new_li += '<span class="teacher_sex">' + (teacher.sex === 'male' ? '男' : '女') + '</span>';
        new_li += '<span class="teacher_tru">' + this.get_tru_name(teacher.teac_rese_unit) + '</span>';
        if(teacher.brief !== '') new_li += '<p class="teacher_brief">' + teacher.brief + '</p>';
        new_li += '</li>';
        this.ul.append(new_li);
      },
      build_list: function(result){
        // 先清空结果列表
        this.ul.empty();
        if(result.length === 0){
          this.ul.append('无法找到相关教师！')
        }
        else{
          for(var i = 0; i < result.length; i++){
            this.add_teacher(result[i]);
          }
        }
      },
      get_tru_name: function(tru_id){
        return $('#teac_rese_unit option[value=' + tru_id + ']').text();
      },
      brief_handle: function(brief){
        brief = brief || '';
        if(this.get_str_lenght(brief) > 200)
          return this.sub_string_by_bytes(brief, 200) + '....';
        else
          return brief;
      },
      /**
       * 获取字符串所占字节数
       */
      get_str_lenght: function(str){
          return str.replace(/[^\x00-\xff]/g, 'xx').length;
      },
      /**
       * 根据指定字节数截取字符串
       */
      sub_string_by_bytes: function(val, maxBytesLen){
          var len = maxBytesLen;
          var result = val.slice(0, len);
          while(this.get_str_lenght(result) > maxBytesLen)
          {
              result = result.slice(0, --len);
          }
          return result;
      },
      set_result_info: function(result_num){
        $('#search_result h1 span.result_info').text('找到相关结果 ' + result_num + ' 个');
      }
    }
  });
  
  // ========================================
  // 创建组件
  // ========================================
  
  // 构造tip组建 用于ajax动作的信息通知
  var ajax_tip = nyJS.component.create('tip',{
    tag: 'p',
    _class: 'ajax_tip tip',
    text: '正在搜索...'
  });
  
  // ========================================
  // 注册事件
  // ========================================
  
  // 搜索设置选框的值发生变化
  nyJS._event.reg({
    type: 'change',
    name: 'setting_switch',
    jq: $('#setting_handler')
  });
  
  // 搜索按钮被按下
  nyJS._event.reg({
    type: 'click',
    name: 'search_submit',
    jq: $('#search_submit')
  });
  
  
  
  // ========================================
  // 响应事件
  // ========================================
  c_search.response({
    // 打开或者关闭搜索设置
    setting_switch: {
      
      seting_switch: function(){
        v_setting.toggle();
      }
    },
    search_submit: {
      search: function(){
        
        var name_value = $('#name').val();
        name_value = $.trim(name_value);
        // 检查表单是否为空
        if($('#name').val() !== ''){
          var condition = {};
          // 是否有搜索设置
          if(v_setting.checked()){
            condition = v_setting.get_setting();
          }
          condition.name = name_value;
          
          // 发送ajax请求
          m_teacher.post({
            name: 'teacher_search',
            type: 'search',
            data: {
              condition: condition
            }
          });
        }
        else {
          ajax_tip.set('搜索词不能为空');
          ajax_tip.show(1).delay(3000).hide(1);
        }
      }
    }
  });
  
  // ========================================
  // ajax事件响应
  // ========================================
  c_search.response_ajax({
    // 教师搜索
    teacher_search: {
      before_send: {
        ajax_loading: function(){
          ajax_tip.set('正在搜索数据...');
          ajax_tip.show();
        }
      },
      complete: {
        ajax_finish: function(){
          ajax_tip.delay(4000).hide(1);
          $('#search_result').show();
        }
      },
      // 数据请求成功，利用试图将数据填充到表单中
      success: {
        ajax_success: function(args){
          var result = ajax_helper.success(args)
          if(result === true){
            v_list.build_list(args.data.data.list);
            v_list.set_result_info(args.data.data.list.length);
            ajax_tip.set('搜索成功！');
            console.log(args.data.receive_text);
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
  
  // ========================================
  // 页面初始状态
  // ========================================
  $('#search_result').hide();
});
