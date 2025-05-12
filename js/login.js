define(['jquery', "jquery-cookie"], function ($) {
    function validateForm() {
        let isValid = true;
        // 用户名验证
        const username = $(".item_account").eq(0).val().trim();
        if (!username) {
            showError("用户名不能为空");
            isValid = false;
        }

        // 密码验证
        const password = $(".item_account").eq(1).val();
        if (!password) {
            showError("密码不能为空");
            isValid = false;
        }

        return isValid;
    }

    function showError(message) {
        $(".err_tip").show().find("span").html(message);
        $(".err_tip").find("em").attr("class", "icon_error");
    }

    function showSuccess(message) {
        $(".err_tip").show().find("span").html(message);
        $(".err_tip").find("em").attr("class", "icon_select icon_true");
    }

    function loginSend() {
        // 输入框获得焦点时清除错误提示
        $(".item_account").focus(function () {
            $(".err_tip").hide();
        });

        // 添加回车键提交表单的功能
        $(".item_account").keypress(function (e) {
            if (e.which === 13) {
                $("#login-button").click();
            }
        });

        $("#login-button").click(function () {
            // 显示加载状态
            const $btn = $(this);
            const originalText = $btn.text();
            $btn.text("登录中...").prop("disabled", true);

            // 表单验证
            if (!validateForm()) {
                $btn.text(originalText).prop("disabled", false);
                return;
            }

            $.ajax({
                type: "post",
                url: "./php/login.php",
                data: {
                    username: $(".item_account").eq(0).val().trim(),
                    password: $(".item_account").eq(1).val()
                },
                success: function (result) {
                    try {
                        var obj = typeof result === 'string' ? JSON.parse(result) : result;
                        if (obj.code) {
                            showError(obj.message);
                        } else {
                            showSuccess(obj.message);

                            // 将用户信息存储在cookie和sessionStorage中
                            $.cookie("username", obj.username, {
                                expires: 7,
                                path: '/'
                            });

                            sessionStorage.setItem("isLogin", "true");

                            // 登录成功后跳转到首页
                            setTimeout(function () {
                                window.location.href = "index.html";
                            }, 1000);
                        }
                    } catch (e) {
                        showError("登录失败，请稍后再试");
                        console.error(e);
                    }

                    // 恢复按钮状态
                    $btn.text(originalText).prop("disabled", false);
                },
                error: function (xhr, status, error) {
                    showError("网络错误，请稍后再试");
                    console.error(xhr, status, error);

                    // 恢复按钮状态
                    $btn.text(originalText).prop("disabled", false);
                }
            });
        });
    }

    return {
        loginSend: loginSend
    }
})