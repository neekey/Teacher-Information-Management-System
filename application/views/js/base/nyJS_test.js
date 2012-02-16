
var ajax_test = m_ajax_base.create();

ajax_test.callback("success",{
  ajax_callback: function(data){
    alert(data.type);
  }
});
ajax_test.post({
  type: "ajax_test",
  url: "home/ajax/",
  data: {
    ajax_data: "ajax_data"
  }
});


