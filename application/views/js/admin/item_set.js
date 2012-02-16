/**
 * 教师添加页面的全局js文件
 * 在该文件工导入其他其他js文件
 */
 
// ajax 模型
// nyJS.utility.importJS('../model/m_ajax');

$(document).ready(function(){
  // ========================================
  // 创建控制器
  // ========================================
  var c_item = nyJS.controller.create();
  
  // ========================================
  // 创建视图
  // ========================================
  var v_list = nyJS.view.create({
    constructor: function(){
      
    },
    prototype: {
      ul: {
        tru_type: $('#tru_type_ul'),
        tru_place: $('#tru_place_ul'),
        title1_type: $('#titl1_type_ul'),
        title1_level: $('#title1_level_ul'),
        title2: $('#title2_ul')
      },
      /**
       * 用于存储当前tru_place列表中的类别id
       * 避免重复读取数据
       */
      tru_place_id: '',
      tru_place_build: function(data, id){
        this.tru_place_id = id;
        this.ul.tru_place.empty();
        
        if(data.length === 0){
          this.ul.tru_place.append('<p class="tip" >该类目下暂时没有任何教研单位</p>');
        }
        else{
          for(var index = 0; index < data.length; index++){
            new_li = '<li id="tru_place_' + data[index].id + '">';
            new_li += '<input type="text" class="required input_text" value=' + data[index].name + ' />';
            new_li += '<input type="button" class="item_delete input_button" value="删除" /></li>';
            this.ul.tru_place.append(new_li);
          }
          
          nyJS._event.add_jq('item_delete', $('#tru_place_ul .item_delete'));
          nyJS._event.add_jq('item_change', $('#tru_place_ul .required'));
        }
          
      },
      // 添加项目
      add: function(type, data){
        var new_li = '<li id="tru_place_' + data.id + '"><input type="text" class="required input_text" value="' + data.name + '"><input type="button" class="item_delete input_button" value="删除">';
        if(type === 'tru_type'){
          new_li += '<a href="#" class="tru_place_show">&gt;&gt;</a>';
        }
        new_li += '</li>';
        var li_jq = $(new_li).appendTo(this.ul[type]);
        // 为新增的li添加事件
        nyJS._event.add_jq('item_change', li_jq.find('.required'));
        nyJS._event.add_jq('item_delete', li_jq.find('.item_delete'));
        if(type === 'tru_type'){
          nyJS._event.add_jq('show_tru_palce', li_jq.find('.tru_place_show'));
        }
      },
      del: function(li_id){
        $('#' + li_id).remove();
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
  
  // 表单验证组建
  var form = nyJS.component.create('form', {
    tag: 'span',
    _class: 'item_form_tip tip input_tip',
    jq: $('#item_form')
  });
  
  // tab组件
  var ul_tab = nyJS.component.create('tab', {
    jq: $('#item_container'),
    _class: 'item_tab'
  });
  
  // ========================================
  // 注册事件
  // ========================================
  
  // 添加项目按钮被点击
  nyJS._event.reg({
    type: 'click',
    name: 'add_item',
    jq: $('.add_item')
  });
  
  // 教研单位类别被点击
  nyJS._event.reg({
    type: 'click',
    name: 'tru_type_click',
    jq: $('#tru_type_ul li')
  });
  
  // 教研单位名称的展开按钮被点击
  nyJS._event.reg({
    type: 'click',
    name: 'show_tru_palce',
    jq: $('.tru_place_show')
  });
  
  // 所有表单的值发生变化时
  nyJS._event.reg({
    type: 'change',
    name: 'item_change',
    jq: $('#item_form li input')
  });
  
  // 项目删除按钮被点击时
  nyJS._event.reg({
    type: 'click',
    name: 'item_delete',
    jq: $('.item_delete')
  });
  
  // ========================================
  // 响应事件
  // ========================================
  
  // tab 点击后转换class 切换样式
  ul_tab.click(function(args){
    ul_tab.tabs.each(function(){
      $(this).parent().removeClass('clicked_tab_li');
    });
    $(args._this).parent().addClass('clicked_tab_li');
  });
  
  c_item.response({
    // 项目的值被修改时
    item_change: {
      item_update: function(args){
        // 对所在列表进行验证
        if(form.check_field(args._this) === true){
          
          // 获取表单信息
          var new_item = args._this.value;
          var li_id = args._this.parentNode.id;
          // 获取类型
          var type = li_id.substr(0, li_id.lastIndexOf('_'));
          // 获取id
          var id = li_id.substr(li_id.lastIndexOf('_') + 1);
          
          // 向服务器发送数据
          m_teacher.post({
            name: 'item_update',
            type: 'update',
            data: {
              type: type,
              id: id,
              name: new_item
            },
            additional: {
              name: new_item
            }
          });
        }
      }
    },
    // tru_place 显示
    show_tru_palce: {
      build_list: function(args){
        var li_id = args._this.parentNode.id;
        // 获取id
        var type_id = li_id.substr(li_id.lastIndexOf('_') + 1);
        if(type_id !== v_list.tru_place_id){
          
          // 发送ajax请求数据
          m_teacher.post({
            name: 'item_tru_place_get',
            type: 'get',
            data: {
              type: 'tru_place',
              type_id: type_id
            },
            additional: {
              type_id: type_id
            }
          });
        }
      },
      change_class: function(args){
        $('#tru_type_ul li').removeClass('choosed_tru_type');
        $(args._this).parent().addClass('choosed_tru_type');
      }
    },
    // 添加项目
    add_item: {
      add: function(args){
        var input = $(args._this).siblings('input.required')[0];
        // 验证表单
        if(form.check_field(input) === true){
          var name = input.value;
          var type = input.id.substr(0, input.id.lastIndexOf('_'));
          var data = {
            type: type,
            name: name
          };
          if(type === 'tru_place'){
            data.type_id = v_list.tru_place_id;
          }
          
          // 发送ajax请求数据
          m_teacher.post({
            name: 'item_add',
            type: 'add',
            data: data,
            additional: {
              type: type,
              data: {
                name: name
              },
              input: input
            }
          });
        }
      }
    },
    // 项目删除
    item_delete: {
      item_del: function(args){
        var name = $(args._this).siblings('input.required').val();
        var li_id = args._this.parentNode.id;
        // 获取类型
        var type = li_id.substr(0, li_id.lastIndexOf('_'));
        // 获取id
        var id = li_id.substr(li_id.lastIndexOf('_') + 1);
        // 向服务器发送数据
        m_teacher.post({
          name: 'item_delete',
          type: 'delete',
          data: {
            type: type,
            id: id
          },
          additional: {
            li_id: li_id,
            name: name
          }
        });
      }
    }
  });
  
  // ========================================
  // ajax事件响应
  // ========================================
  c_item.response_ajax({
    /**
     * 请求tru_place
     */
    item_tru_place_get: {
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
            var data = args.data.data.data;
            v_list.tru_place_build(data, args.additional.type_id);
            ajax_tip.set('数据载入成功！');
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
    },
    /**
     * 添加项目
     */
    item_add: {
      before_send: {
        ajax_loading: function(){
          ajax_tip.set('正在提交数据...');
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
            var data = args.additional.data;
            var type = args.additional.type;
            data.id = args.data.data.id;
            // 添加新的项目到列表中
            v_list.add(type, data);
            // 清空表单
            $(args.additional.input).val('');
            
            ajax_tip.set(data.name + ' 添加成功！');
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
    },
    /**
     * 删除项目
     */
    item_delete: {
      before_send: {
        ajax_loading: function(){
          ajax_tip.set('正在删除...');
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
            ajax_tip.set(args.additional.name + ' 成功删除！');
            // 删除项目
            v_list.del(args.additional.li_id);
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
    },
    /**
     * 修改项目
     */
    item_update: {
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
          if(result === true)
            ajax_tip.set(args.additional.name + ' 成功保存！');
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
  
  /* 
   * 页面的初始动作
   */
  $($('.tru_place_show')[0]).trigger('click');
});

