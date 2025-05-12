define(["jquery"], function ($) {
    function validateForm() {
        let isValid = true;

        // 用户名验证
        const username = $(".item_account").eq(0).val().trim();
        if (!username) {
            showError("用户名不能为空");
            return false;
        } else if (username.length < 3 || username.length > 20) {
            showError("用户名长度应为3-20个字符");
            return false;
        }

        // 密码验证
        const password = $(".item_account").eq(1).val();
        if (!password) {
            showError("密码不能为空");
            return false;
        } else if (password.length < 6) {
            showError("密码长度至少为6个字符");
            return false;
        }

        // 确认密码验证
        const repassword = $(".item_account").eq(2).val();
        if (password !== repassword) {
            showError("两次输入的密码不一致");
            return false;
        }

        return true;
    }

    function showError(message) {
        $(".err_tip").show().find("span").html(message);
        $(".err_tip").find("em").attr("class", "icon_error");
    }

    function showSuccess(message) {
        $(".err_tip").show().find("span").html(message);
        $(".err_tip").find("em").attr("class", "icon_select icon_true");
    }

    function registerSend() {
        // 输入框获得焦点时清除错误提示
        $(".item_account").focus(function () {
            $(".err_tip").hide();
        });

        // 添加回车键提交表单的功能
        $(".item_account").keypress(function (e) {
            if (e.which === 13) {
                $("#register-button").click();
            }
        });

        $("#register-button").click(function () {
            // 显示加载状态
            const $btn = $(this);
            const originalText = $btn.text();
            $btn.text("注册中...").prop("disabled", true);

            // 表单验证
            if (!validateForm()) {
                $btn.text(originalText).prop("disabled", false);
                return;
            }

            $.ajax({
                type: "post",
                url: "./php/register.php",
                data: {
                    username: $(".item_account").eq(0).val().trim(),
                    password: $(".item_account").eq(1).val(),
                    repassword: $(".item_account").eq(2).val(),
                    createTime: (new Date()).getTime()
                },
                success: function (result) {
                    try {
                        var obj = typeof result === 'string' ? JSON.parse(result) : result;
                        if (obj.code) {
                            showError(obj.message);
                        } else {
                            showSuccess(obj.message);

                            // 注册成功后延迟跳转到登录页
                            setTimeout(function () {
                                window.location.href = "login.html";
                            }, 1500);
                        }
                    } catch (e) {
                        showError("注册失败，请稍后再试");
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
        registerSend: registerSend
    }
})