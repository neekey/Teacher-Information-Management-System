/**
 * 教师信息编辑页面的全局js文件
 * 在该文件工导入其他其他js文件
 */
 
/*
// 教师基本信息部分js
nyJS.utility.importJS('teacher_basic', 'teacher_basic', false);
// 教师论文项目信息部分js
nyJS.utility.importJS('teacher_other', 'teacher_other', false);
// 教师论文项目信息部分js
nyJS.utility.importJS('teacher_login', 'teacher_login', false);
// 教师头像上传部分js
nyJS.utility.importJS('teacher_avator', 'teacher_avator', false);
*/

$(document).ready(function(){
  
  // ========================================
  // 创建组件
  // ========================================
  
  // 构造tab组建 
  var teacher_info_tab = nyJS.component.create('tab',{
    jq: $('#teacher_info_container, #header'),
    _class: 'tab_1'
  });
  teacher_info_tab.click(function(){
    // tab切换的时候把教师论文信息部分的表单隐藏
    v_other_form.hide();
  });
  
  
  // 构造tip组建 用于ajax动作的信息通知
  var ajax_tip = nyJS.component.create('tip',{
    tag: 'p',
    _class: 'ajax_tip tip',
    text: '正在保存...'
  });
  
  teacher_info_tab.click(function(args){
    teacher_info_tab.tabs.each(function(){
      $(this).parent().removeClass('clicked_tab_li');
    });
    $(args._this).parent().addClass('clicked_tab_li');
  });
  
  /*
  eval(nyJS.utility.script('teacher_basic'));
  eval(nyJS.utility.script('teacher_other'));
  eval(nyJS.utility.script('teacher_login'));
  eval(nyJS.utility.script('teacher_avator'));
  */
  
  /* teacher_basic
  -------------------------------------------------------------------*/
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
	
  /* teacher_basic
  -------------------------------------------------------------------*/
	
	// ========================================
	// 创建控制器
	// ======================================== 
	var c_teacher_other = nyJS.controller.create();
	
	// ========================================
	// 创建组件
	// ========================================
	
	// 表单验证组建
	var teacher_other_form = nyJS.component.create('form',{
	  tag: 'p',
	  _class: 'paper_project_form_tip',
	  jq: $('#paper_project_form')
	});
	
	// 设置 验证规则
	teacher_other_form.set_rules({
	  required:{
	    msg: '该字段不能为空！'
	  }
	});
	
	// date组件
	var post_date = nyJS.component.create('date',{
	  target: $('#paper_project_date'),
	  year: $('#paper_project_date_year'),
	  month: $('#paper_project_date_month'),
	  day: $('#paper_project_date_day')
	});
	
	
	// ========================================
	// 创建视图
	// ========================================
	var v_other_form = nyJS.view.create({
	  constructor: function(){
	    this.hide();
	  },
	  prototype: {
	    form: $('#paper_project_form'),
	    form_type: $('#form_type'),
	    id: '',
	    /**
	     * 为表单设置类型
	     * @param <string> type
	     * @param <string> id
	     */
	    set_type: function(type, id){
	      this.form_type[0].value = type;
	      $('#form_type')[0].value = type;
	      this.id = id;
	    },
	    fill_form: function(name, brief, date){
	      $('#paper_project_name').val(name);
	      $('#paper_project_brief').val(brief);
	      post_date.set_date(date);
	    },
	    get_type: function(){
	      return this.form_type[0].value;
	    },
	    get_name: function(){
	      return $('#paper_project_name').val();
	    },
	    get_brief: function(){
	      return $('#paper_project_brief').val();
	    },
	    /* 获取时间戳 , 用于发送到服务器 */
	    get_date: function(){
	      return post_date.get_date_info();
	    },
	    get_date_info: function(){
	      var date = post_date.get_date_info();
	      date.month = (parseInt(date.month) <= 9) ? ('0' + date.month ) : date.month;
	      date.day = (parseInt(date.day) <= 9) ? ('0' + date.day ) : date.day;
	      return date;
	    },
	    get_form_data: function(){
	      var form_data = {
	        name: this.get_name(),
	        date: this.get_date().timestamp,
	        brief: this.get_brief()
	      }
	      return form_data;
	    },
	    clear: function(){
	      this.form[0].reset();
	      teacher_other_form.clear_tip();
	    },
	    hide: function(){
	      this.form.hide();
	      $('#project_container').show();
	      $('#paper_container').show();
	    },
	    show: function(){
	      this.form.show();
	      $('#project_container').hide();
	      $('#paper_container').hide();
	    }
	  }
	});
	
	var item_list = nyJS.view.create({
	  constructor: function(){
	    var paper_list = $('#paper_list li');
	    var project_list = $('#project_list li');
	    
	    var closure_this = this;
	    paper_list.each(function(){
	      var id = this.id;
	      closure_this.paper[id] = $(this);
	    });
	    project_list.each(function(){
	      var id = this.id;
	      closure_this.project[id] = $(this);
	    });
	    
	    this.paper_ul = $('#paper_list');
	    this.project_ul = $('#project_list');
	  },
	  prototype: {
	    /**
	     * 储存paper li jQuery对象的列表，以id作为索引
	     */
	    paper: {},
	    /**
	     * 储存project li jQuery对象的列表，以id作为索引
	     */
	    project: {},
	    /**
	     * 更新指定id的列表项信息
	     * @param obj {
	     *   type
	     *   id
	     *   name
	     *   date
	     * }
	     */
	    update: function(obj){
	      var item = this[obj.type][obj.id];
	      if(obj.name !== undefined){
	        item.find('.name').text(obj.name);
	      }
	      if(obj.date !== undefined){
	        item.find('.post_date').text(obj.date);
	      }
	    },
	    remove: function(id, type){
	      this[type][id].remove();
	      if(this[type + '_ul'].find('li').length === 0){
	        // 添加当前尚无任何记录
	        if(type === 'paper'){
	          $('<p>尚无任何论文记录！</p>').appendTo(this[type + '_ul']);
	        }
	        else {
	          $('<p>尚无任何科研项目记录！</p>').appendTo(this[type + '_ul']);
	        }
	      }
	      delete this[type][id];
	    },
	    /**
	     * 插入新数据
	     * @param obj {
	     *   type
	     *   id
	     *   name
	     *   date
	     * }
	     */
	    add: function(obj){
	      // 清理列表中的‘当前没有任何记录'的提示
	      this[obj.type + '_ul'].find('p').remove();
	      
	      // 建立新的列表
	      var new_str = "<li id='" + obj.id +"' >";
	      new_str += "<a href='#paper_project_form' class='tab_2' >";
	      new_str += "<span class='name'>" + obj.name + "</span>";
	      new_str += "</a><span class='post_date'>" + obj.date.year + "-" + obj.date.month + "-" + obj.date.day +"</span>";
	      new_str += "<input type='button' value='删除' class='delete input_button' /></li>";
	      
	      var newli;
	      if(obj.type === 'paper'){
	        this.paper[obj.id] = $(new_str);
	        this.paper_ul.append(this.paper[obj.id]);
	        newli = this.paper[obj.id];
	      }
	      else {
	        this.project[obj.id] = $(new_str);
	        this.project_ul.append(this.project[obj.id]);
	        newli = this.project[obj.id]
	      }
	      
	      // 为新加入的li添加事件
	      nyJS._event.add_jq('teacher_other_delete', newli.find('.delete'));
	      nyJS._event.add_jq('tab_click', newli.find('.tab_2'));
	    }
	  }
	});
	
	// ========================================
	// 事件注册
	// ========================================
	
	// 表单字段的值发生变化时
	nyJS._event.reg({
	  type: 'change',
	  name: 'teacher_other_change',
	  jq: $('#paper_project_form input, #paper_project_form select, #paper_project_form textarea')
	});
	
	nyJS._event.reg({
	  type: 'click',
	  name: 'teacher_other_delete',
	  jq: $('#other_info .delete')
	});
	
	nyJS._event.reg({
	  type: 'click',
	  name: 'teacher_other_close',
	  jq: $('#paper_project_close')
	});
	
	nyJS._event.reg({
	  type: 'click',
	  name: 'tab_click',
	  jq: $('#other_info .tab_2')
	});
	
	
	// ========================================
	// 事件响应
	// ========================================
	
	
	c_teacher_other.response({
	  // 当表单内容发生变化时
	  teacher_other_change: {
	    form_change: function(args){
	      // 对当前字段进行检查
	      if(teacher_other_form.check_field(args._this) === true){
	        // 获取表单类型
	        var form_type = v_other_form.get_type();
	        var type = form_type.substr(0, form_type.indexOf('_'));
	        
	        // 若为编辑的表单
	        if(form_type === 'paper_edit' || form_type === 'project_edit'){
	          // 获取字段名
	          var field_name = args._this.id;
	          field_name = field_name.substr(field_name.indexOf('paper_project_') + 14);
	          
	          // 获取值
	          var value = args._this.value;
	          
	          // 如果为时间选择菜单
	          if($(args._this).siblings('input').length > 0){
	            value = $(args._this).siblings('input').val();
	            field_name = $(args._this).siblings('input').attr('name');
	            field_name = field_name.substr(field_name.indexOf('paper_project_') + 14);
	          }
	          
	          // 构建更新的对象
	          var update = {};
	          update[field_name] = value;
	          // 传递给回调函数的参数，用于更新列表
	          var addi_update = {};
	          addi_update[field_name] = value;
	          addi_update.type = type;
	          addi_update.id = v_other_form.id;
	          addi_update._this = args._this;
	          
	          // 发送ajax请求
	          m_teacher.post({
	            name: 'teacher_other_update',
	            type: 'update_other',
	            data: {
	              id: v_other_form.id,
	              id_str: m_teacher.get_id_str(),
	              type: type,
	              update: update
	            },
	            additional: addi_update
	          });
	        }
	        // 若为添加项目的表单
	        else{
	          
	          // 对整个表单进行验证
	          if(teacher_other_form.check() === true){
	            var add_data = v_other_form.get_form_data();
	            var addi_data = add_data;
	            addi_data.type = type;
	            m_teacher.post({
	              name: 'teacher_other_add',
	              type: 'add_other',
	              data: {
	                id_str: m_teacher.get_id_str(),
	                type: type,
	                add_data: v_other_form.get_form_data()
	              },
	              additional: (addi_data.date = v_other_form.get_date_info(), addi_data)
	            });
	          }
	        }
	      }
	    }
	  },
	  // 当点击删除按钮时
	  teacher_other_delete: {
	    item_delete: function(args){
	      // 获取id 以及类型
	      var id = $(args._this).parent().attr('id');
	      var type = $(args._this).parents('ul[id$=_list]').attr('id');
	      type = type.substr(0, type.indexOf('_list'));
	      
	      m_teacher.post({
	        name: 'teacher_other_delete',
	        type: 'delete_other',
	        data: {
	          id_str: m_teacher.get_id_str(),
	          type: type,
	          id: id
	        },
	        additional: {
	          id: id,
	          type: type
	        }
	      });
	    }
	  },
	  teacher_other_close: {
	    form_close: function(){
	      v_other_form.hide();
	    }
	  },
	  tab_click: {
	    deceide_type: function(args){
	      // 清空表单
	      v_other_form.clear();
	      
	      // 判断操作类型
	      var type;
	      var id;
	      // 若为添加论文
	      if(args._this.id === 'add_paper'){
	        type = 'paper_add';
	      }
	      // 若为添加项目
	      else if(args._this.id === 'add_project'){
	        type = 'project_add';
	      }
	      // 若为某个论文列表项
	      else if($(args._this).parents('ul#paper_list').length > 0){
	        type = 'paper_edit';
	      }
	      // 若为某个项目列表项
	      else{
	        type = 'project_edit'
	      }
	      
	      // 获取id
	      if(type.indexOf('_edit') >= 0){
	        id = $(args._this).parent().attr('id');
	      }
	      
	      // 设置表单类型
	      v_other_form.set_type(type, id);
	    },
	    form_loading: function(args){
	      // 根据表单类型进行操作
	      var type = v_other_form.get_type();
	      
	      switch(type){
	        /**
	         * 若为编辑信息
	         */
	        case 'paper_edit':
	        case 'project_edit':{
	          // 从服务器中请求项目或者论文信息
	          type = type.substr(0, type.indexOf('_'));
	          m_teacher.post({
	            name: 'teacher_other_get',
	            type: 'get_other',
	            data: {
	              id: v_other_form.id,
	              id_str: m_teacher.get_id_str(),
	              type: type
	            },
	            additional: ''
	          });
	          break;
	        }
	        /**
	         * 若为添加信息
	         */
	        case 'paper_add':
	        case 'project_add': {
	          v_other_form.show();
	        }
	      }
	    }
	  }
	});
	
	
	
	
	// ajax事件响应
	c_teacher_other.response_ajax({
	  // 教师项目或者论文信息的获取
	  teacher_other_get: {
	    before_send: {
	      ajax_loading: function(){
	        ajax_tip.set('正在载入数据...');
	        ajax_tip.show();
	      }
	    },
	    complete: {
	      ajax_finish: function(){
	        ajax_tip.delay(4000).hide(1);
	      }
	    },
	    // 数据请求成功，利用试图将数据填充到表单中
	    success: {
	      ajax_success: function(args){
	        var result = ajax_helper.success(args)
	        if(result === true){
	          var form_data = args.data.data.data;
	          v_other_form.fill_form(form_data.name, form_data.brief, form_data.date);
	          v_other_form.show();
	          ajax_tip.set('数据成功载入！');
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
	  },
	  // 更新教师论文或者项目
	  teacher_other_update: {
	    before_send: {
	      loading: function(){
	        ajax_tip.set('正在保存...');
	        ajax_tip.show();
	      }
	    },
	    complete: {
	      finish: function(){
	        ajax_tip.delay(4000).hide(1);
	      }
	    },
	    // 数据请求成功，更新列表
	    success: {
	      success: function(args){
	        var result = ajax_helper.success(args)
	        if(result === true){
	          // 更新列表
	          if(args.additional.brief === undefined){
	            if(args.additional.date !== undefined){
	              args.additional.date = m_teacher.handle_date(args.additional.date);
	            }
	            item_list.update(args.additional);
	          }
	          
	          var field_name = $(args.additional._this).siblings('label').text();
	          ajax_tip.set('您对 ' + field_name + '  的更改已经保存！');
	          console.log(args.data.receive_text);
	        }
	        else
	          ajax_tip.set('保存失败！请稍候重试');
	      }
	    },
	    error: {
	      error: function(args){
	        ajax_tip.set(ajax_helper.error(args));
	      }
	    }
	  },
	  // 添加项目或者论文信息
	  teacher_other_add: {
	    before_send: {
	      loading: function(){
	        ajax_tip.set('正在添加...');
	        ajax_tip.show();
	      }
	    },
	    complete: {
	      finish: function(){
	        ajax_tip.delay(4000).hide(1);
	        // v_other_form.hide();
	      }
	    },
	    // 数据请求成功，更新列表
	    success: {
	      success: function(args){
	        var result = ajax_helper.success(args)
	        if(result === true){
	          var add_data = args.additional;
	          add_data['id'] = args.data.data.id;
	          // 将新的项目插入列表
	          item_list.add(add_data);
	          // 将表单设置为编辑状态
	          v_other_form.set_type(add_data.type + '_edit', args.data.data.id);
	          
	          ajax_tip.set('添加成功！您可以继续编辑信息！');
	        }
	        else
	          ajax_tip.set('保存失败！请稍候重试');
	      }
	    },
	    error: {
	      error: function(args){
	        ajax_tip.set(ajax_helper.error(args));
	      }
	    }
	  },
	  teacher_other_delete: {
	    before_send: {
	      loading: function(){
	        ajax_tip.set('正在删除...');
	        ajax_tip.show();
	      }
	    },
	    complete: {
	      finish: function(){
	        ajax_tip.delay(4000).hide(1);
	      }
	    },
	    // 数据请求成功，更新列表
	    success: {
	      success: function(args){
	        var result = ajax_helper.success(args)
	        if(result === true){
	          item_list.remove(args.additional.id, args.additional.type);
	          ajax_tip.set('删除成功！');
	        }
	        else
	          ajax_tip.set('保存失败！请稍候重试');
	        
	      }
	    },
	    error: {
	      error: function(args){
	        ajax_tip.set(ajax_helper.error(args));
	      }
	    }
	  }
	})
	
  /* teacher_login
  -------------------------------------------------------------------*/
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
	            password: v_pass_form.password()
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

  /* teacher_avator
  -------------------------------------------------------------------*/
  // ========================================
// 创建视图
// ========================================
var v_upload = nyJS.view.create({
  contructor: function(){
    
  },
  prototype: {
    upload: $('#img_upload'),
    preview: $('#preview img'),
    avator_temp: $('#avator_temp img'),
    avator: $('#avator img'),
    form: $('#avator_upload_form'),
    crop: $('#avator_crop'),
    Jcrop_api: null,
    /* 保存图像的原始信息  为解决ie6无法根据 width获得原始尺寸的问题*/
    img_ori_info: {},
    set_url: function(img_name, url){
      this[img_name].attr('src', url);
    },
    reset: function(){
      this.crop.hide();
      this.set_url('preview', '');
      this.set_url('avator_temp', '');
      this.form[0].reset();
      this.form.show();
      if(this.Jcrop_api !== null) {
        this.Jcrop_api.destroy();
      }
      /* 更新 avator_temp */
      $('#avator_temp').empty().append('<img />');
      this.avator_temp = $('#avator_temp img');
    },
    /**
     * 根据图片大小，适应容器大小调整图片显示尺寸
     */
    resize: function(){
      var width = this.avator_temp[0].width;
      var height = this.avator_temp[0].height;
      if((width / 400.0) > (height / 500.0)){
        var new_width = 400;
        var new_height = parseInt(400 * height / width);
      }
      else {
        var new_width = parseInt(500 * width / height);
        var new_height = 500;
      }
      
      this.avator_temp.css({
        width: new_width + 'px',
        height: new_height + 'px'
      });
      this.preview.css({
        width: new_width + 'px',
        height: new_height + 'px'
      });
    },
    /**
     * 根据裁剪选取修改缩略图
     */
    show_preview: function(coords){
      // 获取图片的缩放后尺寸（为了适应容器大小而设置的尺寸，并非实际尺寸）
      var width_str = v_upload.avator_temp.css('width');
      var height_str = v_upload.avator_temp.css('height');
      var img_info = {
        width: parseInt(width_str.substring(0, width_str.indexOf('px'))),
        height: parseInt(height_str.substring(0, height_str.indexOf('px')))
      };

      var rx = 200 / coords.w;
      var ry = 200 / coords.h;
      v_upload.preview.css({
        width: Math.round(rx * img_info.width) + 'px',
        height: Math.round(ry * img_info.height) + 'px',
        marginLeft: '-' + Math.round(rx * coords.x) + 'px',
        marginTop: '-' + Math.round(ry * coords.y) + 'px'
      });
    }
  }
});


/**
 * 图片ajax上传
 */
ajax_upload.upload({
  url: teachersys.base_url + 'img/upload/',
  form_id: 'avator_upload_form',
  submit_id: 'avator_upload_form input[type=button]',
  complete: function(responseData){
    
    v_upload.form.hide();
    v_upload.crop.show();
    
    var img_preview = $('#preview img');
    var img_avator = $('#avator_temp img');
    if(responseData.data){
    	// 设置缩略图图片地址
	    v_upload.set_url('preview', responseData.data.url);
	    // 设置待裁剪图片地址
	    v_upload.set_url('avator_temp', responseData.data.url);
	    v_upload.avator_temp.load(function(){
	      /* 备份原始图像信息 */
	      v_upload.img_ori_info.width = this.width;
	      v_upload.img_ori_info.height = this.height;
	      
	      v_upload.resize();
	      // 添加裁剪控件
	      v_upload.Jcrop_api = $.Jcrop(this, {
	        onChange: v_upload.show_preview,
	        onSelect: v_upload.show_preview,
	        aspectRatio: 1
	      }); 
	      $('#avator_temp img').unbind('load');
	    });
    }
    
  }
});

// ========================================
// 创建组控制器
// ========================================
var c_upload = nyJS.controller.create();

// ========================================
// 创建组件
// ========================================
// overlay
var overlay = nyJS.component.create('overlay', {
  target: $('#img_upload'), 
  before_show: function(){
    v_upload.reset();
  }, 
  before_hide: function(){
    //alert('before_hide');
  }
});

// ========================================
// 注册事件
// ========================================
nyJS._event.reg({
  type: 'click',
  jq: $('#avator a.avator_tip'),
  name: 'avator_click'
});
nyJS._event.reg({
  type: 'click',
  jq: $('#crop_save'),
  name: 'crop_save'
});
nyJS._event.reg({
  type: 'click',
  jq: $('#avator_upload_close'),
  name: 'avator_upload_close'
});
/*
 * 解决ie6 hover问题
 */
nyJS._event.reg({
  type: 'mouseover',
  jq: $('#avator'),
  name: 'avator_mouseover'
});
nyJS._event.reg({
  type: 'mouseout',
  jq: $('#avator'),
  name: 'avator_mouseout'
});

// ========================================
// 响应事件
// ========================================
c_upload.response({
  avator_click: {
    upload_show: function(){
      overlay.show('slow');
    }
  },
  avator_upload_close: {
    close: function(){
      overlay.hide();
    }
  },
  crop_save: {
    save: function(){
      var crop_info = v_upload.Jcrop_api.tellScaled();
      // 如果用户已经选择好了裁剪区域
      if(crop_info.w !== 0){
        var ori_width = v_upload.img_ori_info.width;
        var new_width = $('#avator_temp img').css('width');
        new_width = parseInt(new_width.substring(0, new_width.indexOf('px')));
        var r = ori_width / new_width;
        var img_url = $('#avator_temp img').attr('src');
        var id_str = img_url.substring(img_url.lastIndexOf('/') + 1);
        m_teacher.post({
          name: 'crop_save',
          type: 'avator_crop',
          data: {
            id_str: m_teacher.get_id_str(),
            pic_id_str: id_str,
            ori_width: parseInt(crop_info.w * r),
            ori_height: parseInt(crop_info.h * r),
            ori_x: parseInt(crop_info.x * r),
            ori_y: parseInt(crop_info.y * r)
          }
        });
      }
      else {
        alert('请先选择裁剪区域！');
      }
    }
  },
  avator_mouseover: {
  	show_a: function(){
  		$('#avator a').show();
  		$('#avator').addClass('avator_hover');
  	}
  },
  avator_mouseout: {
  	show_a: function(){
  		$('#avator a').hide();
  		$('#avator').removeClass('avator_hover');
  	}
  }
});

// ========================================
// 响应ajax事件
// ========================================
c_upload.response_ajax({
  /**
   * 用于教师信息更新的ajax
   */
  crop_save: {
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
          ajax_tip.set('您的头像已经保存！');
          v_upload.set_url('avator', v_upload.avator_temp.attr('src') + '/'); // 添加/ 防止浏览器缓存
        }
        else
          ajax_tip.set('保存失败！请稍候重试');
        
        overlay.hide();
      }
    },
    error: {
      ajax_error: function(args){
        ajax_tip.set(ajax_helper.error(args));
      }
    }
  }
})

  
});
