<?php 
	header("Content-type:text/html;charset=utf-8");
	// var_dump($_POST);
	/*
		定义一个统一的返回格式
	*/
	$responseData = array("code" => 0, "message" => "");

	/*
		获取并过滤输入数据
	*/
	$username = isset($_POST['username']) ? trim(htmlspecialchars($_POST['username'])) : '';
	$password = isset($_POST['password']) ? $_POST['password'] : '';

	/*
		简单的数据验证
	*/
	if(!$username){
		$responseData['code'] = 1;
		$responseData['message'] = "用户名不能为空";
		echo json_encode($responseData);
		exit;
	}
	if(!$password){
		$responseData['code'] = 2;
		$responseData['message'] = "密码不能为空";
		echo json_encode($responseData);
		exit;
	}

	/*
		使用配置文件连接数据库
	*/
	require_once('db_config.php');
	$link = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

	if(!$link){
		$responseData['code'] = 3;
		$responseData['message'] = "服务器忙，请稍后再试";
		echo json_encode($responseData);
		exit;
	}

	mysqli_set_charset($link, "utf8");

	/*
		使用预处理语句防止SQL注入
	*/
	$stmt = mysqli_prepare($link, "SELECT * FROM users WHERE username=?");
	mysqli_stmt_bind_param($stmt, "s", $username);
	mysqli_stmt_execute($stmt);
	$res = mysqli_stmt_get_result($stmt);
	$row = mysqli_fetch_assoc($res);

	if(!$row) {
		$responseData['code'] = 4;
		$responseData['message'] = "用户名或密码错误";
		echo json_encode($responseData);
		exit;
	} else {
		/*
			使用password_verify函数验证密码
		*/
		if(password_verify($password, $row['password'])) {
			/*
				设置登录会话
			*/
			session_start();
			$_SESSION['user_id'] = $row['id'];
			$_SESSION['username'] = $row['username'];
			
			$responseData['message'] = "登录成功";
			$responseData["username"] = $row['username'];
			echo json_encode($responseData);
		} else {
			$responseData['code'] = 4;
			$responseData['message'] = "用户名或密码错误";
			echo json_encode($responseData);
			exit;
		}
	}

	mysqli_close($link);
 ?>