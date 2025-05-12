console.log("加载完成");
/* 
    配置当前项目引入的模块
*/
require.config({
    paths: {
        "jquery": "jquery-1.11.3",
        "jquery-cookie": "jquery.cookie",
        "parabola": "parabola",
        //引入banner图效果
        "nav": "nav",
        "goodsList": "goodsList"
    },
    shim: {
        //设置依赖关系  先引入jquery.js  然后在隐去jquery-cookie
        "jquery-cookie": ["jquery"],
        //声明当前模块不遵从AMD
        "parabola": {
            exports: "_"
        }
    }
})

require(["nav", "goodsList"], function (nav, goodsList) {
    nav.topNavDownload();
    nav.topNavTab();
    nav.searchTab();
    nav.allGoodsTab();
    // //侧边栏加载
    nav.leftNavDownload();
    // //给侧边栏添加移入移出效果
    nav.leftNavTab();

    //加载列表商品
    goodsList.download();
    goodsList.banner();

})

define(["jquery", "jquery-cookie", "./goodsList"], function ($, jcookie, goodsList) {
    // 从URL中获取参数
    function getQueryParam(name) {
        const search = window.location.search.substring(1);
        const pairs = search.split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            if (decodeURIComponent(pair[0]) === name) {
                return decodeURIComponent(pair[1] || '');
            }
        }
        return null;
    }

    // 搜索功能实现
    function searchInit() {
        // 获取URL中的搜索关键词
        const urlKeyword = getQueryParam('keyword');
        if (urlKeyword) {
            $("#search").val(urlKeyword);
            // 根据关键词过滤商品列表
            filterProductsByKeyword(urlKeyword);
        }

        // 搜索框获得焦点时展示搜索结果列表
        $("#search").on("focus", function () {
            $("#J_keywordList").removeClass("hide");
        });

        // 搜索框失去焦点时隐藏搜索结果列表
        $("#search").on("blur", function () {
            setTimeout(function () {
                $("#J_keywordList").addClass("hide");
            }, 200);
        });

        // 提交搜索表单时处理
        $(".search-form").on("submit", function (e) {
            e.preventDefault();
            const keyword = $("#search").val().trim();
            if (keyword === "") {
                return false;
            }

            // 根据关键词过滤商品列表
            filterProductsByKeyword(keyword);

            // 更新URL，但不刷新页面
            const newUrl = window.location.pathname + '?keyword=' + encodeURIComponent(keyword);
            window.history.pushState({ path: newUrl }, '', newUrl);
        });
    }

    // 根据关键词过滤商品列表
    function filterProductsByKeyword(keyword) {
        keyword = keyword.toLowerCase();
        // 搜索标题显示
        $("#J_searchTitle").text(`"${keyword}" 的搜索结果`).show();

        // 遍历所有商品卡片，隐藏不匹配的
        $(".goods-list li").each(function () {
            const productName = $(this).find('.title').text().toLowerCase();
            const productDesc = $(this).find('.desc').text().toLowerCase();

            if (productName.indexOf(keyword) > -1 || productDesc.indexOf(keyword) > -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        // 如果没有搜索结果，显示提示
        if ($(".goods-list li:visible").length === 0) {
            if ($("#J_emptySearchResult").length === 0) {
                $(".goods-list").after(`
                    <div id="J_emptySearchResult" class="empty-result">
                        <h3>没有找到与 "${keyword}" 相关的商品</h3>
                        <p>建议您：</p>
                        <ul>
                            <li>检查您的拼写</li>
                            <li>使用更简短、更常见的关键词</li>
                            <li>尝试更改搜索词</li>
                        </ul>
                        <a href="index.html" class="btn btn-primary">返回首页</a>
                    </div>
                `);
            } else {
                $("#J_emptySearchResult").show();
            }
        } else {
            $("#J_emptySearchResult").hide();
        }
    }

    function headerInit() {
        // 检查登录状态并更新顶部栏
        const username = $.cookie("username");
        if (username) {
            $(".topbar-info").html(`
                <span class="user">
                    <a class="user-name" href="javascript:;" id="J_user">
                        <span class="name">${username}</span>
                        <i class="iconfont"></i>
                    </a>
                    <ul class="user-menu" style="display:none;">
                        <li><a href="#">个人中心</a></li>
                        <li><a href="#">评价晒单</a></li>
                        <li><a href="javascript:;" id="J_logout">退出登录</a></li>
                    </ul>
                </span>
                <span class="sep">|</span>
                <a href="goodsCar.html" class="link">我的订单</a>
            `);

            // 用户菜单显示/隐藏
            $("#J_user").hover(
                function () { $(this).next(".user-menu").show(); },
                function () { $(this).next(".user-menu").hide(); }
            );

            // 退出登录
            $("#J_logout").on("click", function () {
                $.removeCookie("username", { path: "/" });
                sessionStorage.removeItem("isLogin");
                window.location.reload();
            });
        }

        // 更新购物车数量
        try {
            const goodsStr = $.cookie("goods");
            if (goodsStr) {
                const goodsArr = JSON.parse(goodsStr);
                let totalCount = 0;
                for (const item of goodsArr) {
                    totalCount += parseInt(item.num);
                }
                $(".J_cartNum").text("(" + totalCount + ")");
            }
        } catch (e) {
            console.error("购物车数据解析错误:", e);
        }
    }

    $(function () {
        // 初始化页面顶部信息
        headerInit();

        // 初始化搜索功能
        searchInit();

        // 商品列表加载
        goodsList.download();

        // 商品列表交互
        goodsList.banner();
        goodsList.leftNavTab();
        goodsList.topNavTab();
    })
})