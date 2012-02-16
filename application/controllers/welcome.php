<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends MY_Controller {

	function __construct()
	{
		parent::__construct();
    $this->_add_js(array("jquery", "nyJS"));
	}

	function index()
	{
	  $test_arr = array(
      'name' => 'test',
      'sex' => 'male',
      'age' => 21
    );
    print_r(apache_get_modules ( ));
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */