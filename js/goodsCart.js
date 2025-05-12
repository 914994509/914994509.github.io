define(["jquery", "jquery-cookie"], function ($) {
    // 购物车数据处理类
    class CartManager {
        constructor() {
            this.cookieName = "goods";
            this.cartData = [];
            this.loadFromCookie();
        }

        // 从Cookie加载购物车数据
        loadFromCookie() {
            const cookieStr = $.cookie(this.cookieName);
            this.cartData = cookieStr ? JSON.parse(cookieStr) : [];
            return this.cartData;
        }

        // 保存数据到Cookie
        saveToStorage() {
            $.cookie(this.cookieName, JSON.stringify(this.cartData), { expires: 7, path: '/' });
        }

        // 添加商品到购物车
        addItem(id, num = 1) {
            let found = false;
            for (let i = 0; i < this.cartData.length; i++) {
                if (this.cartData[i].id == id) {
                    this.cartData[i].num += num;
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.cartData.push({ id: id, num: num });
            }
            this.saveToStorage();
        }

        // 更新购物车中商品的数量
        updateItemQuantity(id, num) {
            for (let i = 0; i < this.cartData.length; i++) {
                if (this.cartData[i].id == id) {
                    this.cartData[i].num = parseInt(num);
                    if (this.cartData[i].num <= 0) {
                        this.removeItem(id);
                        return;
                    }
                    break;
                }
            }
            this.saveToStorage();
        }

        // 从购物车移除商品
        removeItem(id) {
            this.cartData = this.cartData.filter(item => item.id != id);
            this.saveToStorage();
        }

        // 清空购物车
        clearCart() {
            this.cartData = [];
            this.saveToStorage();
        }

        // 获取购物车中的商品总数
        getTotalCount() {
            return this.cartData.reduce((total, item) => total + parseInt(item.num), 0);
        }
    }

    // 初始化购物车管理器
    const cartManager = new CartManager();

    //加载已经加入购物车的商品
    function loadCarData() {
        //清除上一次加载的结果
        $("#J_cartListBody .J_cartGoods").html("");

        // 检查购物车是否为空
        if (cartManager.cartData.length === 0) {
            showEmptyCart();
            return;
        }

        //通过promise取得，goodsList2.json和goodsCarList.json中的数据
        new Promise(function (resolve, reject) {
            $.ajax({
                url: "../data/goodsCarList.json",
                success: function (obj) {
                    //如果下载成功，把下载到数据中的商品列表传输过去
                    resolve(obj.data);
                },
                error: function (msg) {
                    //如果下载错误，调用reject方法
                    reject(msg);
                }
            })
        }).then(function (arr1) {
            // console.log(arr1);
            //下载第二份代码
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "../data/goodsList2.json",
                    success: function (arr2) {
                        //将两份数据合并
                        var newArr = arr1.concat(arr2);
                        resolve(newArr);
                    },
                    error: function (msg) {
                        reject(msg);
                    }
                })
            })
        }).then(function (arr) {
            // 拿到服务器上所有的商品数据，找出购物车中存在的商品
            const cookieArr = cartManager.cartData;
            const newArr = [];

            for (let i = 0; i < cookieArr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (cookieArr[i].id == arr[j].product_id || cookieArr[i].id == arr[j].goodsid) {
                        arr[j].num = cookieArr[i].num;
                        // 设置商品id一致
                        arr[j].id = arr[j].product_id ? arr[j].product_id : arr[j].goodsid;
                        newArr.push(arr[j]);
                    }
                }
            }

            if (newArr.length === 0) {
                showEmptyCart();
                return;
            }

            // 拿到加入购物车的所有数据，加载到页面上
            for (let i = 0; i < newArr.length; i++) {
                const node = $(` <div class="item-row clearfix" id="${newArr[i].id}"> 
                    <div class="col col-check">  
                        <i class="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox" data-itemid="${newArr[i].id}" data-status="1">√</i>  
                    </div> 
                    <div class="col col-img">  
                        <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                            <img alt="${newArr[i].name}" src="${newArr[i].image}" width="80" height="80"> 
                        </a>  
                    </div> 
                    <div class="col col-name">  
                        <div class="tags">   
                        </div>     
                        <div class="tags">  
                        </div>   
                        <h3 class="name">  
                            <a href="//item.mi.com/${newArr[i].id}.html" target="_blank"> 
                                ${newArr[i].name}
                            </a>  
                        </h3>        
                    </div> 
                    <div class="col col-price"> 
                        ${newArr[i].price}元 
                        <p class="pre-info">  </p> 
                    </div> 
                    <div class="col col-num">  
                        <div class="change-goods-num clearfix J_changeGoodsNum"> 
                            <a href="javascript:void(0)" class="J_minus" data-id="${newArr[i].id}">
                                <i class="iconfont">-</i>
                            </a> 
                            <input type="text" name="num_${newArr[i].id}" value="${newArr[i].num}" data-id="${newArr[i].id}" data-buylimit="20" autocomplete="off" class="goods-num J_goodsNum"> 
                            <a href="javascript:void(0)" class="J_plus" data-id="${newArr[i].id}"><i class="iconfont">+</i></a>   
                        </div>  
                    </div> 
                    <div class="col col-total"> 
                        ${(newArr[i].price * newArr[i].num).toFixed(1)}元 
                        <p class="pre-info">  </p> 
                    </div> 
                    <div class="col col-action"> 
                        <a data-id="${newArr[i].id}" data-msg="确定删除吗？" href="javascript:void(0);" title="删除" class="del J_delGoods"><i class="iconfont">×</i></a> 
                    </div> 
                </div> `);
                node.appendTo($("#J_cartListBody .J_cartGoods"));
            }

            // 购物车数据加载成功后计算总数
            isCheckAll();

            // 更新右上角的购物车数量
            updateTopCartNum();
        }).catch(function (error) {
            console.error("购物车数据加载失败:", error);
            showEmptyCart();
        });
    }

    // 显示空购物车状态
    function showEmptyCart() {
        $("#J_cartListBody .J_cartGoods").html(`
            <div class="cart-empty-container">
                <div class="cart-empty">
                    <h2>您的购物车还是空的！</h2>
                    <p>快去购物吧！</p>
                    <a href="index.html" class="btn btn-primary">马上去购物</a>
                </div>
            </div>
        `);

        // 隐藏结算区域和相关推荐
        $(".cart-bar").hide();
        $("#J_cartTotalPrice").html("0");
        $("#J_selTotalNum").html("0");
        $("#J_cartTotalNum").html("0");
    }

    // 更新顶部导航栏的购物车数量
    function updateTopCartNum() {
        const totalCount = cartManager.getTotalCount();
        $(".cart-mini-num").text(`(${totalCount})`);
    }

    function download() {
        $.ajax({
            url: "../data/goodsCarList.json",
            success: function (obj) {
                var arr = obj.data;
                for (var i = 0; i < arr.length; i++) {
                    $(`<li class="J_xm-recommend-list span4">    
                    <dl> 
                        <dt> 
                            <a href="#"> 
                                <img src="${arr[i].image}" srcset="//i1.mifile.cn/a1/pms_1551867177.2478190!280x280.jpg  2x" alt="${arr[i].name}"> 
                            </a> 
                        </dt> 
                        <dd class="xm-recommend-name"> 
                            <a href="#"> 
                                ${arr[i].name}
                            </a> 
                        </dd> 
                        <dd class="xm-recommend-price">${arr[i].price}元</dd> 
                        <dd class="xm-recommend-tips">   ${arr[i].comments}人好评    
                            <a class="btn btn-small btn-line-primary J_xm-recommend-btn" href="javascript:void(0);" data-id="${arr[i].goodsid}">加入购物车</a>  
                        </dd> 
                        <dd class="xm-recommend-notice"></dd> 
                    </dl>  
                </li>`).appendTo($("#J_miRecommendBox .xm-recommend ul.row"))
                }

                // 绑定推荐商品的添加购物车事件
                $("#J_miRecommendBox").on("click", ".J_xm-recommend-btn", function () {
                    const id = $(this).data("id");
                    cartManager.addItem(id, 1);
                    updateTopCartNum();

                    // 显示添加成功的动画效果
                    const $btn = $(this);
                    const originalText = $btn.text();
                    $btn.text("添加成功").addClass("btn-success");
                    setTimeout(() => {
                        $btn.text(originalText).removeClass("btn-success");
                    }, 1500);

                    // 重新加载购物车数据
                    loadCarData();
                });
            },
            error: function (msg) {
                console.log(msg);
            }
        })
    }

    //全选按钮 和 单选按钮的点击实现
    function checkFunc() {
        // 全选/全不选
        $(".list-head .col-check").find("i").click(function () {
            var allChecks = $(".list-body").find(".item-row").find(".col-check i");
            if ($(this).hasClass("icon-checkbox-selected")) {
                $(this).add(allChecks).removeClass("icon-checkbox-selected");
            } else {
                $(this).add(allChecks).addClass("icon-checkbox-selected");
            }
            isCheckAll();
            return false;
        });

        // 单个商品的复选框点击
        $("#J_cartListBody .J_cartGoods").on("click", ".col-check i", function () {
            if ($(this).hasClass("icon-checkbox-selected")) {
                $(this).removeClass("icon-checkbox-selected");
            } else {
                $(this).addClass("icon-checkbox-selected");
            }
            isCheckAll();
            return false;
        });
    }

    //判断是否都被选中
    function isCheckAll() {
        var allChecks = $(".list-body").find(".item-row");

        var isAll = true;
        var total = 0;
        var count = 0; // 记录被选中的数量
        var totalCount = 0; // 记录总数

        allChecks.each(function (index, item) {
            if (!$(item).find(".col-check i").hasClass("icon-checkbox-selected")) {
                isAll = false;
            } else {
                total += parseFloat($(item).find(".col-price").html()) * parseFloat($(item).find(".col-num input").val());
                count += parseInt($(item).find(".col-num input").val());
            }
            totalCount += parseInt($(item).find(".col-num input").val());
        });

        // 设置总价和数量
        $("#J_cartTotalPrice").html(total.toFixed(1));
        $("#J_selTotalNum").html(count);
        $("#J_cartTotalNum").html(totalCount);

        // 判断是否全选
        if (isAll && allChecks.length > 0) {
            $(".list-head .col-check").find("i").addClass("icon-checkbox-selected");
        } else {
            $(".list-head .col-check").find("i").removeClass("icon-checkbox-selected");
        }
    }

    // 修改购物车数量
    function changeCars() {
        // 购物车数量加减和输入事件
        $("#J_cartListBody .J_cartGoods").on("click", ".J_minus,.J_plus", function () {
            const $input = $(this).parent().find(".J_goodsNum");
            let num = parseInt($input.val());
            const id = $(this).data("id");

            if ($(this).hasClass("J_minus")) {
                num = num > 1 ? num - 1 : 1;
            } else {
                const buyLimit = parseInt($input.data("buylimit")) || 20;
                num = num < buyLimit ? num + 1 : buyLimit;
            }

            $input.val(num);
            cartManager.updateItemQuantity(id, num);

            // 更新小计金额
            const price = parseFloat($(this).parents(".item-row").find(".col-price").text());
            $(this).parents(".item-row").find(".col-total").html(`${(price * num).toFixed(1)}元`);

            // 更新总计
            isCheckAll();
            updateTopCartNum();
        });

        // 输入框直接修改数量
        $("#J_cartListBody .J_cartGoods").on("blur", ".J_goodsNum", function () {
            let num = parseInt($(this).val()) || 1;
            const buyLimit = parseInt($(this).data("buylimit")) || 20;

            if (num < 1) num = 1;
            if (num > buyLimit) num = buyLimit;

            $(this).val(num);
            const id = $(this).data("id");
            cartManager.updateItemQuantity(id, num);

            // 更新小计金额
            const price = parseFloat($(this).parents(".item-row").find(".col-price").text());
            $(this).parents(".item-row").find(".col-total").html(`${(price * num).toFixed(1)}元`);

            // 更新总计
            isCheckAll();
            updateTopCartNum();
        });

        // 删除商品
        $("#J_cartListBody .J_cartGoods").on("click", ".J_delGoods", function () {
            const $item = $(this).parents(".item-row");
            const id = $(this).data("id");

            if (confirm("确定要删除该商品吗？")) {
                $item.fadeOut(300, function () {
                    $(this).remove();
                    cartManager.removeItem(id);
                    // 更新总计
                    isCheckAll();
                    updateTopCartNum();

                    // 检查购物车是否为空
                    if (cartManager.cartData.length === 0) {
                        showEmptyCart();
                    }
                });
            }
        });
    }

    function cartHover() {
        $(".J_xm-recommend-list").hover(function () {
            $(this).find(".J_xm-recommend-btn").stop().animate({
                opacity: 1
            }, 200)
        }, function () {
            $(this).find(".J_xm-recommend-btn").stop().animate({
                opacity: 0
            }, 200)
        });
    }

    return {
        download: download,
        loadCarData: loadCarData,
        checkFunc: checkFunc,
        changeCars: changeCars,
        cartHover: cartHover,
        cartManager: cartManager
    }
})