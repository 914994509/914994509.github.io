define(["jquery"], function ($) {
    function download() {
        console.log("开始加载小米闪购数据...");

        // 确保DOM完全加载
        $(function () {
            $.ajax({
                url: "data/slide.json",
                dataType: "json",
                cache: false,
                success: function (data) {
                    console.log("小米闪购数据加载成功");

                    // 获取商品数据
                    var slideArr = data.data.list.list;
                    console.log("商品数量：" + slideArr.length);

                    // 获取容器并清空
                    var $container = $("#J_flashSaleList");
                    var $ul = $container.find("ul.swiper-wrapper");

                    // 如果ul不存在，则创建
                    if ($ul.length === 0) {
                        $ul = $("<ul></ul>").addClass("swiper-wrapper");
                        $container.append($ul);
                    }

                    // 清空当前内容
                    $ul.empty();

                    // 重置ul的样式
                    $ul.attr("style", "transform: translate3d(0px, 0px, 0px); transition-duration: 0ms;");

                    // 手动构建HTML字符串
                    var html = '';

                    // 遍历添加商品
                    for (var i = 0; i < slideArr.length; i++) {
                        var item = slideArr[i];

                        html += '<li class="swiper-slide rainbow-item-3" style="width: 234px; margin-right: 14px;">';
                        html += '<a href="#" target="_blank">';
                        html += '<div class="content">';
                        html += '<div class="thumb">';
                        html += '<img width="160" height="160" src="' + item.pc_img + '" alt="' + item.goods_name + '" onerror="this.src=\'images/000.jpg\'">';
                        html += '</div>';
                        html += '<h3 class="title">' + item.goods_name + '</h3>';
                        html += '<p class="desc">' + item.desc + '</p>';
                        html += '<p class="price">';
                        html += '<span>' + item.seckill_Price + '</span>元';
                        html += '<del>' + item.goods_price + '元</del>';
                        html += '</p>';
                        html += '</div>';
                        html += '</a>';
                        html += '</li>';
                    }

                    // 一次性添加所有HTML，减少DOM操作
                    $ul.html(html);

                    console.log("商品渲染完成，初始化滑动效果");

                    // 初始化滑动效果
                    slideTab();
                },
                error: function (xhr, status, error) {
                    console.error("小米闪购数据加载失败：" + error);
                    // 显示一个友好的错误信息
                    var $container = $("#J_flashSaleList");
                    $container.html(
                        '<ul class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);">' +
                        '<li class="swiper-slide" style="width: 100%; text-align: center; padding: 40px 0;">' +
                        '<div style="color: #ff6709; font-size: 16px;">数据加载失败，请刷新页面重试</div>' +
                        '</li>' +
                        '</ul>'
                    );
                }
            });
        });
    }

    function slideTab() {
        var aSpans = $(".swiper-controls").find("span");
        var iNow = 0;

        // 获取实际商品数量
        var itemCount = $("#J_flashSaleList .swiper-slide").length;
        console.log("滑动初始化：检测到" + itemCount + "个商品项");

        // 计算一页显示多少个商品
        var visibleItems = 4; // 一页显示4个
        var count = Math.ceil(itemCount / visibleItems) - 1;

        console.log("总共需要" + (count + 1) + "页来显示所有商品");

        // 根据商品数量设置按钮状态
        if (count <= 0) {
            // 如果只有一页或没有商品，禁用两个按钮
            aSpans.addClass("swiper-button-disabled");
            return; // 不需要滑动
        } else {
            // 初始状态，前一个按钮禁用
            aSpans.eq(0).addClass("swiper-button-disabled");
            aSpans.eq(1).removeClass("swiper-button-disabled");
        }

        // 启动定时器，让其一开始自己滚动
        var timer = setInterval(function () {
            iNow++;
            if (iNow > count) {
                clearInterval(timer);
                return;
            }
            tab();
        }, 4000);

        // 点击事件
        aSpans.click(function () {
            if ($(this).hasClass("swiper-button-disabled")) {
                return; // 按钮禁用时不响应点击
            }

            if ($(this).index() == 0) {
                // 点击上一页
                iNow--;
                iNow = Math.max(0, iNow); // 确保不小于0
            } else {
                // 点击下一页
                iNow++;
                iNow = Math.min(count, iNow); // 确保不超过最大页数
            }

            tab();
        });

        // 更新滑块位置和按钮状态
        function tab() {
            // 更新按钮状态
            iNow == 0 ? aSpans.eq(0).addClass("swiper-button-disabled") : aSpans.eq(0).removeClass("swiper-button-disabled");
            iNow == count ? aSpans.eq(1).addClass("swiper-button-disabled") : aSpans.eq(1).removeClass("swiper-button-disabled");

            // 计算滑动距离：每个商品宽度234px + 右边距14px = 248px，每页4个，共992px
            var pageWidth = visibleItems * 248;
            var iTarget = -iNow * pageWidth;

            // 最后一页可能不需要滑动那么多
            if (iNow == count) {
                var remainItems = itemCount % visibleItems;
                if (remainItems > 0) {
                    // 调整最后一页的滑动距离
                    iTarget = -((count - 1) * pageWidth + remainItems * 248);
                }
            }

            console.log("滑动到第" + (iNow + 1) + "页，位移：" + iTarget + "px");

            // 应用滑动效果
            $("#J_flashSaleList .swiper-wrapper").css({
                transform: "translate3d(" + iTarget + "px, 0px, 0px)",
                transitionDuration: "1000ms"
            });
        }
    }

    //定时器倒计时，每天14:00开枪，每天22:00开枪
    function countDown() {
        var nowDate = new Date();
        var hour = nowDate.getHours();
        var date = nowDate.getDate();
        var afterDate = new Date();

        //计算倒计时时间间隔
        if (hour < 14) {
            afterDate.setHours(14);
            $(".flashsale-countdown .round").html("14:00 场");
        } else if (hour >= 14 && hour < 22) {
            afterDate.setHours(22);
            $(".flashsale-countdown .round").html("22:00 场");
        } else {
            $(".flashsale-countdown .round").html("明日14:00 场");
            afterDate.setHours(14);
            afterDate.setDate(date + 1);
        }
        afterDate.setMilliseconds(0);
        afterDate.setSeconds(0);
        afterDate.setUTCMilliseconds(0);

        //计算倒计时总秒数
        var count = parseInt((afterDate.getTime() - nowDate.getTime()) / 1000);

        var aSpans = $(".flashsale-countdown .countdown").find("span");

        var timer = setInterval(function () {
            count--;
            aSpans.eq(2).html(doubleNum(count % 60));
            aSpans.eq(1).html(doubleNum(parseInt(count / 60) % 60));
            aSpans.eq(0).html(doubleNum(parseInt(count / 3600) % 24));
            if (count == 0) {
                clearInterval(timer);
                $(".flashsale-countdown .desc").html("本次活动结束,敬请期待~");
            }
        }, 1000);
    }

    function doubleNum(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return num;
        }
    }

    return {
        download: download,
        slideTab: slideTab,
        countDown: countDown
    }
})