define(['jquery', "jquery-cookie"], function ($) {
    function download() {
        var product_id = valueByName(location.search, "product_id");
        $.ajax({
            method: "get",
            url: "../data/goodsList.json",
            success: function (arr) {
                //找到当前页面要加载的详情页面数据
                var goodsMsg = arr.find(item => item.product_id == product_id);
                console.log(goodsMsg);
                var node = $(` <!-- 导航 -->
                <div id = 'J_proHeader' data-name="${goodsMsg.name}">
                    <div class = 'xm-product-box'>
                        <div id = 'J_headNav' class = 'nav-bar'>
                            <div class = 'container J_navSwitch'>
                                <h2 class = 'J_proName'>${goodsMsg.name}</h2>
                                <div class = 'con'>
                                    <div class = 'left'>
                                        <span class = 'separator'>|</span>
                                        <a href="#">${goodsMsg.title}</a>
                                    </div>
                                    <div class = 'right'>
                                        <a href="javascript:void(0);" data-target="product-intro">概述</a>
                                        <span class = 'separator'>|</span>
                                        <a href="javascript:void(0);" data-target="product-params">参数</a>
                                        <span class = 'separator'>|</span>
                                        <a href="javascript:void(0);" data-target="product-comments">用户评价</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 商品详情数据展示 -->
                <div class = 'xm-buyBox' id = 'J_buyBox'>
                    <div class = 'box clearfix'>
                        <!-- 商品数据 -->
                        <div class = 'pro-choose-main container clearfix'>
                            <div class = 'pro-view span10'>
                                <!-- img-con fix 设置图片浮动 -->
                                <div id = 'J_img' class = 'img-con' style = 'left: 338px; margin: 0px;'>
                                    <div class = 'ui-wrapper' style="max-width: 100%;">
                                        <!-- 图片 -->
                                        <div class = 'ui-viewport' style="width: 100%; overflow: hidden; position: relative; height: 560px;">
                                            <div id = 'J_sliderView' class = 'sliderWrap' style = 'width: auto; position: relative;'>
   
                                            </div>
                                        </div>
                                        <!-- 显示第几张图片的下标 -->
                                        <div class = 'ui-controls ui-has-pager ui-has-controls-direction'>
                                            <div class = 'ui-pager ui-default-pager'>
                                                
                                            </div>
                                            <div class = 'ui-controls-direction'>
                                                <a class="ui-prev" href="">上一张</a>
                                                <a class="ui-next" href="">下一张</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class = 'pro-info span10'>
                                <!-- 标题 -->
                                <h1 class = 'pro-title J_proName'>
                                    <span class = 'img'></span>
                                    <span class = 'name'>${goodsMsg.name}</span>
                                </h1>
                                <!-- 提示 -->
								<p class = 'sale-desc' id = 'J_desc'>
                                    ${goodsMsg.product_desc_ext}
                                </p>
                                <div class = 'loading J_load hide'>
                                    <div class = 'loader'></div>
                                </div>
                                <!-- 主体 -->
                                <div class = 'J_main'>
                                    <!-- 经营主题 -->
                                    <p class = 'aftersale-company' id = 'J_aftersaleCompany' type = '1' desc = 'null'>小米自营</p>
                                    <!-- 价格 -->
                                    <div class = 'pro-price J_proPrice'>
                                        <span class = 'price'>
											${goodsMsg.price_max}元
                                            <del>${goodsMsg.market_price_max}元</del>
                                        </span>
                                        <span class="seckill-notic hide"><em></em><i></i><span><span></span></span></span>
                                    </div>
                                    <!-- 常态秒杀倒计时 -->
                                    <div class = 'pro-time J_proSeckill'>
                                        <div class="pro-time-head">
                                            <em class="seckill-icon"></em> 
                                            <i>秒杀</i>
                                            <span class="time J_seckillTime">距结束 03 时 24 分 46 秒</span>
                                       </div>
                                        <div class = 'pro-time-con'>
                                            <span class = 'pro-time-price'>
                                                ￥
                                                <em class = 'J_seckillPrice'>${goodsMsg.price_min}</em>
                                                <del>
                                                    ￥
                                                    <em class = 'J_seckillPriceDel'>${goodsMsg.market_price_min}</em>
                                                </del>
                                            </span>
                                        </div>
                                    </div>
                                        <!-- 已经选择产品 -->
                                        <div class = 'pro-list' id = 'J_proList'>
                                            <ul>
                                                <li>${goodsMsg.name} ${goodsMsg.value}  
                                                    <del>${goodsMsg.market_price_min}元</del>  
                                                    <span>  ${goodsMsg.price_min} 元 </span> 
                                                </li>
                                                <li class="totlePrice" data-name="seckill">   
                                                    秒杀价   ：${goodsMsg.price_min}元  
                                                </li>
                                            </ul>
                                        </div>
                                        <!-- 购买按钮 -->
                                        <ul class="btn-wrap clearfix" id="J_buyBtnBox">     
                                            <li>  
                                                <a href="javascript:void(0);" class="btn btn-primary btn-biglarge J_login" id = "${goodsMsg.product_id}">加入购物车</a>  
                                            </li>   
                                            <li>  
                                                <a href="goodsCar.html" class="btn-gray btn-like btn-biglarge"> 
                                                    <i class="iconfont default"></i>查看购物车 
                                                </a>  
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`)
                node.insertAfter("#app div .header");

                //找到详情页加载的图片
                var aImages = goodsMsg.images;
                if (aImages.length == 1) {
                    $(`<img class = 'slider done' 
                        src="${aImages[0]}" 
                        style="float: none; list-style: none; position: absolute; width: 560px; z-index: 0; display: block;" 
                        alt=""/>`).appendTo(node.find("#J_sliderView"));

                    //隐藏上一张、下一张操作
                    node.find(".ui-controls").hide();
                } else {
                    for (var i = 0; i < aImages.length; i++) {
                        $(`<div class = 'ui-pager-item'>
                                <a href="#" data-slide-index = "0" class = 'ui-pager-link ${i == 0 ? "active" : ""}'>1</a>
                           </div>`).appendTo(node.find(".ui-pager"));

                        $(`<img class = 'slider done' 
                        src="${aImages[i]}" 
                        style="float: none; list-style: none; position: absolute; width: 560px; z-index: 0; display: ${i == 0 ? "block" : "none"};" 
                        alt=""/>`).appendTo(node.find("#J_sliderView"));
                    }
                }

                // 加载商品详细介绍内容
                loadProductIntro(goodsMsg);

                // 加载规格参数
                loadProductParams(goodsMsg);

                // 加载用户评价
                loadProductComments(goodsMsg.product_id);

                // 加载相关推荐
                loadProductRecommend(goodsMsg.product_id);
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }

    //name1=value1&name2=value2&name3=value3 
    function valueByName(search, name) {
        var start = search.indexOf(name + "=");
        if (start == -1) {
            return null;
        } else {
            var end = search.indexOf("&", start);
            if (end == -1) {
                end = search.length;
            }
            //提取出想要键值对 name=value
            var str = search.substring(start, end);
            var arr = str.split("=");
            return arr[1];
        }
    }

    // 加载商品详细介绍内容
    function loadProductIntro(goodsMsg) {
        // 模拟异步加载内容
        setTimeout(function () {
            // 清除加载提示
            $("#J_introContent").empty();

            // 添加详情介绍内容
            var introHtml = `
                <div class="intro-detail">
                    <div class="intro-item">
                        <h3 class="intro-subtitle">${goodsMsg.name} 产品亮点</h3>
                        <div class="intro-text">
                            <p>${goodsMsg.product_desc_ext}</p>
                            <p>全系标配前置水滴屏，轻薄机身，4000mAh大电量，持久续航，游戏不断电。</p>
                            <p>后置 ${goodsMsg.value || "4800"}万 AI四摄，轻松拍出大片，随时随地记录美好生活。</p>
                        </div>
                        <div class="intro-image">
                            <img src="${goodsMsg.images[0]}" alt="${goodsMsg.name}" />
                        </div>
                    </div>
                    <div class="intro-item">
                        <h3 class="intro-subtitle">优质屏幕，视觉享受</h3>
                        <div class="intro-text">
                            <p>采用${goodsMsg.value || "6.3"}英寸水滴全面屏，${goodsMsg.value || "FHD+"}高清分辨率，为您带来震撼视觉体验。</p>
                            <p>护眼模式，减少蓝光伤害，呵护您的眼睛健康。</p>
                        </div>
                        <div class="intro-image">
                            <img src="${goodsMsg.images[1] || goodsMsg.images[0]}" alt="优质屏幕" />
                        </div>
                    </div>
                    <div class="intro-item">
                        <h3 class="intro-subtitle">强劲性能，畅快体验</h3>
                        <div class="intro-text">
                            <p>搭载${goodsMsg.value || "高通骁龙处理器"}，提供更快、更稳定的性能体验。</p>
                            <p>采用先进的散热系统，长时间使用也不发烫。</p>
                        </div>
                        <div class="intro-image">
                            <img src="${goodsMsg.images[2] || goodsMsg.images[0]}" alt="强劲性能" />
                        </div>
                    </div>
                </div>
            `;

            $(introHtml).appendTo("#J_introContent");
        }, 800);
    }

    // 加载规格参数
    function loadProductParams(goodsMsg) {
        // 模拟异步加载内容
        setTimeout(function () {
            // 清除加载提示
            $("#J_paramsList").empty();

            // 生成参数列表
            var paramsData = [
                { name: "产品名称", value: goodsMsg.name },
                { name: "产品型号", value: goodsMsg.value || goodsMsg.name + " 标准版" },
                { name: "屏幕尺寸", value: goodsMsg.value || "6.3英寸" },
                { name: "屏幕类型", value: "LCD水滴全面屏" },
                { name: "屏幕分辨率", value: goodsMsg.value || "FHD+ 2340×1080" },
                { name: "处理器", value: goodsMsg.value || "高通骁龙处理器" },
                { name: "存储组合", value: goodsMsg.value || "6GB+64GB/6GB+128GB" },
                { name: "电池容量", value: "4000mAh(typ)" },
                { name: "充电器", value: "支持快充" },
                { name: "后置摄像头", value: goodsMsg.value || "4800万AI四摄" },
                { name: "前置摄像头", value: goodsMsg.value || "1300万像素" },
                { name: "操作系统", value: "MIUI 11，基于Android 10" },
                { name: "网络支持", value: "双卡双待，支持5G/4G全网通" },
                { name: "蓝牙", value: "蓝牙5.0" },
                { name: "NFC", value: "支持" },
                { name: "包装清单", value: "手机主机×1，电源适配器×1，USB数据线×1，保护壳×1，取卡针×1，说明书×1" }
            ];

            // 将参数数据添加到表格中
            $.each(paramsData, function (index, param) {
                $(`<tr>
                    <td>${param.name}</td>
                    <td>${param.value}</td>
                </tr>`).appendTo("#J_paramsList");
            });
        }, 1000);
    }

    // 加载用户评价
    function loadProductComments(productId) {
        // 模拟异步加载内容
        setTimeout(function () {
            // 清除加载提示
            $("#J_commentsList").empty();

            // 模拟评论数据
            var commentsData = [
                {
                    username: "米粉12345678",
                    avatar: "//s01.mifile.cn/i/user/avatar-default.png",
                    content: "收到手机非常惊喜，外观设计很漂亮，性能也很流畅，特别是拍照效果太赞了！电池续航也很给力，一天重度使用都没问题。性价比超高，值得购买！",
                    images: ["//i1.mifile.cn/a4/goods/circle/6917.jpg", "//i1.mifile.cn/a4/goods/circle/6918.jpg"],
                    time: "2023-06-15",
                    score: 5
                },
                {
                    username: "小米用户8562",
                    avatar: "//s01.mifile.cn/i/user/avatar-default.png",
                    content: "系统流畅，外观好看，拍照效果不错，就是偶尔会有一点点卡顿，但总体来说还是很满意的。",
                    images: [],
                    time: "2023-06-10",
                    score: 4
                },
                {
                    username: "快乐的米粉",
                    avatar: "//s01.mifile.cn/i/user/avatar-default.png",
                    content: "这是我用过最好的小米手机，外观、性能、拍照、续航都很满意。尤其是MIUI系统越来越好用了。",
                    images: ["//i1.mifile.cn/a4/goods/circle/6919.jpg"],
                    time: "2023-06-05",
                    score: 5
                }
            ];

            // 生成评论列表
            $.each(commentsData, function (index, comment) {
                var commentHtml = `
                    <div class="comment-item">
                        <div class="comment-user">
                            <img src="${comment.avatar}" alt="${comment.username}" class="user-avatar">
                            <span class="user-name">${comment.username}</span>
                        </div>
                        <div class="comment-content">${comment.content}</div>
                `;

                // 如果有图片，添加图片展示
                if (comment.images && comment.images.length > 0) {
                    commentHtml += '<div class="comment-images">';
                    $.each(comment.images, function (i, img) {
                        commentHtml += `<img src="${img}" alt="评价图片">`;
                    });
                    commentHtml += '</div>';
                }

                commentHtml += `
                        <div class="comment-info">
                            ${Array(comment.score).fill('★').join('')} · ${comment.time}
                        </div>
                    </div>
                `;

                $(commentHtml).appendTo("#J_commentsList");
            });

            // 添加加载更多按钮
            $(`<div class="load-more">
                <a href="javascript:void(0);" class="load-more-btn">查看更多评价</a>
            </div>`).appendTo("#J_commentsList");
        }, 1200);
    }

    // 加载相关推荐
    function loadProductRecommend(productId) {
        // 模拟异步加载内容
        setTimeout(function () {
            // 清除加载提示
            $("#J_recommendList").empty();

            // 模拟推荐商品数据
            var recommendData = [
                {
                    id: "1001",
                    name: "Redmi Note 9 Pro",
                    image: "//cdn.cnbj1.fds.api.mi-img.com/mi-mall/c1aafa589258a4d9fdf49831b457418d.png",
                    price: "1599"
                },
                {
                    id: "1002",
                    name: "Redmi K30 5G",
                    image: "//cdn.cnbj1.fds.api.mi-img.com/mi-mall/7a98170e97ca5df8f5ad2470a8a2d01e.jpg",
                    price: "1999"
                },
                {
                    id: "1003",
                    name: "Redmi K30 Pro",
                    image: "//cdn.cnbj1.fds.api.mi-img.com/mi-mall/7e24c1f285c0e4fb2fa0e5e30bf58f60.jpg",
                    price: "2699"
                },
                {
                    id: "1004",
                    name: "小米10",
                    image: "//cdn.cnbj1.fds.api.mi-img.com/mi-mall/c7c1380907e3284d0f2fe32e3edf7f4a.jpg",
                    price: "3999"
                },
                {
                    id: "1005",
                    name: "小米10 Pro",
                    image: "//cdn.cnbj1.fds.api.mi-img.com/mi-mall/4a2e3265df432c716c9aab82a18b4738.jpg",
                    price: "4999"
                }
            ];

            // 生成推荐商品列表
            $.each(recommendData, function (index, product) {
                $(`<div class="recommend-item">
                    <a href="goodsDesc.html?product_id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="recommend-img">
                        <div class="recommend-info">
                            <div class="recommend-name">${product.name}</div>
                            <div class="recommend-price">${product.price}元</div>
                        </div>
                    </a>
                </div>`).appendTo("#J_recommendList");
            });
        }, 1500);
    }

    //添加轮播效果
    function banner() {
        //点击下方的小块，切换图片
        var iNow = 0; //默认让第一张图片显示
        var aBtns = null; //获取所有的小块
        var aImgs = null; //获取所有的图片
        var timer = null;

        //点击按钮完成切换 事件委托完成
        $("#app div").on("click", ".ui-controls .ui-pager .ui-pager-item a", function () {
            //注意这里获取的是当前点击的a标签父节点的下标
            iNow = $(this).parent().index();
            tab();

            //阻止冒泡和默认行为
            return false;
        })

        //自动进行切换
        timer = setInterval(function () {
            iNow++;
            tab();
        }, 3000);

        //添加鼠标移入移出
        $("#app div").on("mouseenter", "#J_img", function () {
            clearInterval(timer);
        })

        $("#app div").on("mouseleave", "#J_img", function () {
            timer = setInterval(function () {
                iNow++;
                tab();
            }, 3000);
        })

        //添加上一张和下一张画面切换
        $("#app div").on("click", ".ui-prev,.ui-next", function () {
            if (this.className == 'ui-prev') {
                iNow--;
                if (iNow == -1) {
                    iNow = 4;
                }
            } else {
                iNow++;
            }
            tab();
            return false;
        })

        //切换方法
        function tab() {
            if (!aImgs) {
                aImgs = $("#J_img").find("img");
            }
            if (!aBtns) {
                aBtns = $("#J_img").find(".ui-controls .ui-pager .ui-pager-item a");
            }

            if (aImgs.size() == 1) {
                clearInterval(timer);
            } else {
                if (iNow == 5) {
                    iNow = 0;
                }

                aBtns.removeClass("active").eq(iNow).addClass('active');
                aImgs.hide().eq(iNow).show();
            }

        }
    }

    // 详情页面标签页切换
    function tabSwitch() {
        // 点击详情导航切换标签页
        $("#J_detailTab").on("click", ".tab-item", function () {
            var target = $(this).data("target");

            // 更新选中状态
            $(this).addClass("active").siblings().removeClass("active");

            // 显示对应内容
            $(".detail-block").removeClass("active");
            $("#J_" + target).addClass("active");

            // 滚动到内容区域
            $('html, body').animate({
                scrollTop: $("#J_goodsDetailContainer").offset().top - 60
            }, 300);
        });

        // 顶部导航栏点击事件
        $("#J_headNav").on("click", ".right a", function () {
            var target = $(this).data("target");
            if (target) {
                // 切换到对应标签页
                $("#J_detailTab .tab-item[data-target='" + target + "']").click();
            }
            return false;
        });
    }

    //添加点击加入购物车操作
    $("#app div").on("click", ".J_login", function () {
        //获取当前的商品列表
        var id = this.id;
        //进行购物车操作   goods键，json格式字符串为值
        //1、先去判断cookie中是否存在商品信息
        var first = $.cookie("goods") == null ? true : false;

        //2、如果是第一次添加
        if (first) {
            //直接创建cookie
            var cookieStr = `[{"id":${id},"num":1}]`;
            $.cookie("goods", cookieStr, {
                expires: 7
            })
        } else {
            var same = false; //假设没有添加过
            //3、如果不是第一次添加，判断之前是否添加过
            var cookieStr = $.cookie("goods");
            var cookieArr = JSON.parse(cookieStr);
            for (var i = 0; i < cookieArr.length; i++) {
                if (cookieArr[i].id == id) {
                    //如果之前添加过，数量+1
                    cookieArr[i].num++;
                    same = true;
                    break;
                }
            }

            if (!same) {
                //如果没有添加过，新增商品数据
                var obj = { id: id, num: 1 };
                cookieArr.push(obj);
            }

            //最后，存回cookie中
            $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7
            })
        }

        alert("已添加到购物车！");
    });


    return {
        download: download,
        banner: banner,
        tabSwitch: tabSwitch
    }
})