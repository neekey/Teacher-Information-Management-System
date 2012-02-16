function import(url){
  $.ajax({
    url: url,
    async: false,
    dataType: "script",
    type: "post",
    success: function(data){
      console.log("JavaScript 文件导入成功，以下为脚本内容！");
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.log("JavaScript 文件导入失败！");
      console.log("textStatus: " + textStatus);
      console.log("errorThrown: " + errorThrown);
    }
  });
}

console.log("import_test path: " + nyJS.utility.get_local_path());
nyJS.utility.importJS("base/test_import");
nyJS.utility.importJS("base/test_import");

var ajax_test = m_ajax_base.create();
var test = "test";

alert(import_test);
alert(home_test);


