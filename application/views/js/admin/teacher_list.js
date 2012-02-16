/**
 * 用于教师列表部分的js 
 * 
 * @author Neekey <ni184775761@gmai.com>
 */
// ajax 模型
// nyJS.utility.importJS('../model/m_ajax');

// ========================================
// 构造控制器
// ========================================
var c_list = nyJS.controller.create();

// ========================================
// 创建组件
// ========================================

// 全部教师
var list_all = nyJS.component.create('paging', {
  _class: 'list_all paging',
  id: 'list_all_paging',
  setting: {offset: 20}
});

// 根据教研单位分类的教师
var list_tru = nyJS.component.create('paging', {
  _class: 'list_tru paging',
  id: 'list_tru_paging',
  setting: {offset: 20}
});

// 根据职称1分类的教师
var list_title1 = nyJS.component.create('paging', {
  _class: 'list_title1 paging',
  id: 'list_title1_paging',
  setting: {offset: 20}
});

// 根据职称2分类的教师
var list_title2 = nyJS.component.create('paging', {
  _class: 'list_title2 paging',
  id: 'list_title2_paging',
  setting: {offset: 20}
});



$(document).ready(function(){
  
  // ========================================
  // 创建组件
  // ========================================
  
  // 构造tab组建 
  var list_tab = nyJS.component.create('tab',{
    jq: $('#category'),
    _class: 'list_tab'
  });
  
  // 构造tip组建 用于ajax动作的信息通知
  var ajax_tip = nyJS.component.create('tip',{
    tag: 'p',
    _class: 'ajax_tip tip',
    text: '正在保存...'
  });
  
  // 预先请求所有教师信息
  m_teacher.post({
    name: 'teacher_search',
    type: 'search',
    data: {
      condition: {}
    },
    additional: 'all'
  });
  
  // ========================================
  // 构造视图
  // ========================================
  var v_list = nyJS.view.create({
    constructor: function(){
      for(var pag_name in this.paging){
        this.paging[pag_name].after(this.ul[pag_name]);
      }
    },
    prototype: {
      list_info: $('#teacher_list .title .list_info'),
      /**
       * 根据当前状态更新信息
       */
      update_info: function(type){
        var total_num = this.paging[type].total_num;
        var cur_page = this.paging[type].cur_index;
        var cur_num =  cur_page * this.paging[type].setting.offset;
        cur_num = cur_num > total_num ? total_num : cur_num;
        var str = String(cur_num) + '/' + String(total_num) + ' 第' + String(cur_page) + '页';
        this.list_info.text(str);
      },
      ul: {
        all: $('#list_all ul'),
        tru: $('#list_tru ul'),
        title1: $('#list_title1 ul'),
        title2: $('#list_title2 ul')
      },
      paging: {
        all: list_all,
        tru: list_tru,
        title1: list_title1,
        title2: list_title2
      },
      empty: function(type){
        this.ul[type].empty();
      },
      build: function(type, data){
        this.empty(type);
        var new_li = '';
        if(data.length === 0){
          $('<p>该类目下尚无任何教师！</p>').appendTo(this.ul[type]);
        }
        for(var index = 0; index < data.length; index++){
          new_li = '<li id="' + data[index].id + '">';
          new_li += '<a href="' + teachersys.base_url + 'admin/teacher_edit/' + data[index].id + '">';
          new_li += '<span class="teacher_name">' + data[index].name + '</span>';
          new_li += '<span class="teacher_sex">' + (data[index].sex === 'female' ? '女' : '男') + '</span>';
          new_li += '<span class="teacher_tru">' + $('#tru_' + data[index].teac_rese_unit + ' a').text() + '</span></a></li>';
          $(new_li).appendTo(this.ul[type]);
        }
      },
      init_paging: function(type, data){
        this.paging[type].init(data);
      },
      get_list: function(type, page_num){
        return this.paging[type].get_list(page_num);
      }
    }
  });
  
  // ========================================
  // 事件响应
  // ========================================
  
  /* 为解决ie系列的兼容性问题（见博客<http://neekey.net/blog/?p=32>[子容器在响应事件方法中移除自身将导致事件无法冒泡到父元素] 
   * 所以在此没有使用注册和相应的方式处理事件，而是修改了paging组件，添加了onswitch事件，使得列表更新方法在分页组件更新后被调用
  */
  page_switch_click = function(args){
  	var class_str = $(args._this).parent().attr('class');
    var type = class_str.split(' ')[0].substring(5);
    var a_href = $(args._this).attr('href');
    var page_num = a_href.substring(a_href.indexOf('#') + 1);
    var new_data = v_list.get_list(type, page_num);
    v_list.build(type, new_data);
    v_list.update_info(type);
  };
  list_all.onswitch(page_switch_click);
  list_tru.onswitch(page_switch_click);
  list_title1.onswitch(page_switch_click);
  list_title2.onswitch(page_switch_click);
  
  list_tab.click(function(args){
    // 获取类型
    var type = $(args._this).attr('href').substr(6);
    // 判断是否是所有教师
    if(type !== 'all'){
      
      var condition = {};
      // 构造条件
      switch(type){
        case 'title1':
          condition['title1_type'] = $(args._this.parentNode).attr('id').substr(7);
          break;
        case 'title2':
          condition['title2'] = $(args._this.parentNode).attr('id').substr(7);
          break;
        case 'tru':
          condition['teac_rese_unit'] = $(args._this.parentNode).attr('id').substr(4);
          break;
      }
      // 请求数据
      m_teacher.post({
        name: 'teacher_search',
        type: 'search',
        data: {
          condition: condition
        },
        additional: type
      });
    }
  });
  
  
  // ========================================
  // ajax事件响应
  // ========================================
  c_list.response_ajax({
    /**
     * 用于教师信息列表获取的ajax
     */
    teacher_search: {
      before_send: {
        ajax_loading: function(){
          ajax_tip.set('正在获取数据...');
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
            var type = args.additional;
            var data = args.data.data.list;
            // 重新初始化组建
            v_list.init_paging(type, data);
            // 获取当前页数据
            var cur_data = v_list.get_list(type);
            // 建立列表
            v_list.build(type, cur_data);
            v_list.update_info(type);
            ajax_tip.set('数据载入成功！');
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
    
});





