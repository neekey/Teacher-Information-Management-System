<html>
<head>
<title>404 Page Not Found</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css">

body: {
  text-align: center;
}
#base_container {
  width:100%;
  height: 100%;
  background-color: #d5d5d5;
  padding: 50px 0 50px 0;
  min-height: 580px;
}
#header {
  padding: 20px;
  width: 350px;
  height: 60px;
  background-color: #4282C0;
  margin: 0px auto 10px auto;
  background-image: url('jscss/img/common/site_logo.png');
  background-repeat: no-repeat;
  background-position: 25px 20px;
}
#content {
  text-align: center;
  overflow: hidden;
  padding: 20px;
  width: 350px;
  background-color: white;
  margin: auto;
}
#content label {
  display: inline-block;
  width: 90px;
}
#submit_reset {
  float: right;
}
</style>
</head>
<body>
  <div id='base_container'>
   <div id='content' >
    <p id="result_msg"><?php echo $heading . '<br>' . '您请求的页面不存在！'; ?></p>
    <p><?php echo anchor('login/', '返回首页'); ?></p>
   </div>
	</div>
</body>
</html>