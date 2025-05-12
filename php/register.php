<?php
    header('content-type:text/html;charset="utf-8"');

    //定义一个统一的返回格式
    $responseData = array("code" => 0, "message" => "");

    // 获取并过滤输入数据
    $username = isset($_POST['username']) ? trim(htmlspecialchars($_POST['username'])) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $repassword = isset($_POST['repassword']) ? $_POST['repassword'] : '';
    $createTime = isset($_POST["createTime"]) ? (int)$_POST["createTime"] : time();
    

    //表单验证
    if(!$username){
        $responseData['code'] = 1;
        $responseData["message"] = "用户名不能为空";
        echo json_encode($responseData);
        exit;
    }

    // 增加用户名长度验证
    if(strlen($username) < 3 || strlen($username) > 20) {
        $responseData['code'] = 7;
        $responseData["message"] = "用户名长度应为3-20个字符";
        echo json_encode($responseData);
        exit;
    }

    if(!$password){
        $responseData['code'] = 2;
        $responseData["message"] = "密码不能为空";
        echo json_encode($responseData);
        exit;
    }

    // 增加密码强度验证
    if(strlen($password) < 6) {
        $responseData['code'] = 8;
        $responseData["message"] = "密码长度至少为6个字符";
        echo json_encode($responseData);
        exit;
    }

    if($password != $repassword){
        $responseData['code'] = 3;
        $responseData["message"] = "两次输入密码不一致";
        echo json_encode($responseData);
        exit;
    }

    // 使用配置文件方式连接数据库
    require_once('db_config.php');
    
    // 连接数据库
    $link = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    //判断数据库是否链接成功
    if(!$link){
        $responseData['code'] = 4;
        $responseData["message"] = "服务器忙，请稍后再试";
        echo json_encode($responseData);
        exit;
    }
    mysqli_set_charset($link, "utf8");

    // 使用预处理语句防止SQL注入
    $stmt = mysqli_prepare($link, "SELECT * FROM users WHERE username=?");
    mysqli_stmt_bind_param($stmt, "s", $username);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($res);

    if(!$row){
        // 使用更安全的密码哈希方法
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // 使用预处理语句插入数据
        $stmt2 = mysqli_prepare($link, "INSERT INTO users(username, password, createTime) VALUES(?, ?, ?)");
        mysqli_stmt_bind_param($stmt2, "ssi", $username, $passwordHash, $createTime);
        $res = mysqli_stmt_execute($stmt2);
        
        if($res){
            $responseData['message'] = "注册成功";
            echo json_encode($responseData);
        }else{
            $responseData['code'] = 5;
            $responseData['message'] = "注册失败，请稍后再试";
            echo json_encode($responseData);
        }
    }else{
        $responseData['code'] = 6;
        $responseData['message'] = "用户名已存在";
        echo json_encode($responseData);
        exit;
    }

    mysqli_close($link);
?>