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
        "slide": "slide",
        "data": "data"
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

require(["nav", "slide", "data"], function (nav, slide, data) {
    nav.download();
    nav.banner();
    nav.leftNavTab();
    nav.topNavTab();
    nav.searchTab();

    // 改进搜索框和导航菜单交互
    $(function () {
        // 搜索框获得焦点时显示搜索历史
        $("#search").on("focus", function () {
            $("#J_keywordList").removeClass("hide").addClass("is-visible");
            // 当搜索框获得焦点时，隐藏导航菜单以避免遮挡
            $("#J_navMenu").hide();
        });

        // 搜索框失去焦点时隐藏搜索历史
        $("#search").on("blur", function () {
            setTimeout(function () {
                $("#J_keywordList").removeClass("is-visible").addClass("hide");
            }, 200);
        });

        // 点击搜索框之外的区域时隐藏搜索历史
        $(document).on("click", function (e) {
            if (!$(e.target).closest(".search-form").length) {
                $("#J_keywordList").removeClass("is-visible").addClass("hide");
            }
        });

        // 为所有关键词项添加点击事件
        $("#J_keywordList li").on("click", function () {
            var keyword = $(this).data("key");
            $("#search").val(keyword);
            $(".search-form").submit();
        });
    });

    // //加载商品数据 
    slide.download();
    // //添加商品数据滚动效果
    slide.slideTab();
    // //倒计时效果
    slide.countDown();

    // //主页数据加载
    data.download();
    data.tabMenu();

    // 添加CSS修复，解决搜索历史记录和导航菜单的重叠问题
    $("<style>")
        .prop("type", "text/css")
        .html(`
            /* 搜索下拉框层级提升 */
            #J_keywordList {
                position: absolute !important;
                z-index: 999 !important;
                width: 100% !important;
                top: 100% !important;
                background: #fff !important;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16) !important;
            }
            
            /* 导航菜单层级调整 */
            #J_navMenu {
                z-index: 80 !important;
            }
            
            /* 搜索框父容器定位 */
            .site-header .search-form {
                position: relative !important;
                z-index: 100 !important;
            }
            
            /* 避免导航菜单与搜索结果同时显示 */
            .site-header .search-form:focus-within + #J_navMenu {
                display: none !important;
            }
        `)
        .appendTo("head");
})