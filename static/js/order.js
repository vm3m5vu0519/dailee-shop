$("#leftsidebar_box dt").css({"background-color":" #997679"});
$(function(){
    $("#leftsidebar_box dd").hide();
    $("#leftsidebar_box .my_order dd").show();
    $("#leftsidebar_box dt").click(function(){
        $("#leftsidebar_box dt").css({"background-color":"#997679"});
        $(this).css({"background-color": "#997679"});
        $(this).parent().find('dd').removeClass("menu_chioce");
        $("#leftsidebar_box dt img").attr("src","../static/images/myOrder/myOrder2.png");
        $(this).parent().find('img').attr("src","../static/images/myOrder/myOrder1.png");
        $(".menu_chioce").slideUp();
        $(this).parent().find('dd').slideToggle();
        $(this).parent().find('dd').addClass("menu_chioce");
        $(this).parent().siblings().children('dd').slideUp();
    });
})
//分页部分
$(".tcdPageCode").createPage({
    pageCount:6,
    current:1,
    backFn:function(p){

          }
});

function getData(order_status=null){
        if (order_status==null){
            var order_status = arguments[0] ? arguments[0] : 0;
        }
        var status = arguments[1] ? arguments[1] : 1;
        var token=localStorage.getItem("token");
        var username =  window.localStorage.getItem('username')
        $.ajax({
            type: "get",
            beforeSend:function(request){
                            request.setRequestHeader("authorization",token)
            },
            url: baseUrl+'/dailee/orders/'+username,
            datatype: JSON,
            data:{'type':order_status},
            success: function (response) {
                var result = JSON.stringify(response)
                var results = JSON.parse(result)
                var base_url = results.base_url
                console.log(results.code)
                if(results.code == 403){
							alert('用戶認證已過期，請重新登入');
							window.localStorage.removeItem('username');
							window.localStorage.removeItem('token');
							window.localStorage.removeItem('count');
							location.href = 'login.html'
						}
                if (results.code == '200'){
                    var html = '';
                    var order_list = results.data.orders_list;
                    console.log(order_list)
                    for (var i=0;i<order_list.length;i++) {
                        html += '<div id="orderItem" >'
                        html += '<p class="orderItem_title">'
                        html += '<span id="order_id">'
                        html += '&nbsp;&nbsp;訂單編號:<a href="#">' + order_list[i].order_id + '</a>'
                        html += '<span>&nbsp;&nbsp;訂單金額(含運費):'
                        html += order_list[i].order_total_amount
                        html += '&nbsp;&nbsp;運費：'+order_list[i].order_freight+'&nbsp;&nbsp;'
                        html += '</span>'
                        html += '&nbsp;&nbsp;成交時間：'+order_list[i].order_time+'&nbsp;&nbsp;'
                        html += '<span style="margin-left:80px;">'
                        html += '<a href="#" class="servie">'
                        html += '交易狀態:'
                        html += '</a>'
                        if (order_list[i].status == 1){
                            html += '<img src="../static/images/myOrder/car.png" alt="" />待付款'
                            html += '&nbsp;&nbsp;&nbsp;<a href="gopay.html?order_id='
                            html += order_list[i].order_id
                            html += '">去付款</a>'

                        }else if(order_list[i].status == 2){
                            html += '<img src="../static/images/myOrder/car.png" alt="" />待發貨'
                        }else if(order_list[i].status == 3){
                            html += '<img src="../static/images/myOrder/car.png" alt="" />已發貨'
                            html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="confirm('
			                html += order_list[i].order_id
			                html += ')">確認收貨</a>'
                        }else if (order_list[i].status == 4){
                            html += '<img src="../static/images/myOrder/car.png" alt="" />已完成'
                        }
                        html += '</span>'
                        html += '</p>'
                        html += '</div>'
                        html += '<table id="order_list_title" cellpadding="0" cellspacing="0">'
                        html += '<tr>'
                        html += '<th width="416">商品</th>'
                        html += '<th width="100">單價（元）</th>'
                        html += '<th width="100">數量</th>'
                        html += '<th width="100">實付款（元）</th>'
                        html += '</tr>'
                        html += '</table>'

                        var order_sku = order_list[i].order_sku
                //var staticURL = '../static/media/'
                        for (var j = 0; j < order_sku.length; j++) {
                            html += '<div id="orderItem_detail">'
                            html += '<ul>';
                            html += '<li class="product">'
                            html += '<b><a href="#"><img style="width:80px" src=' + base_url + order_sku[j].default_image_url + ' /></a></b>'
                            html += '<b class="product_name lf"><a href="">'+order_sku[j].name+'</a><br /></b>'
                            var sku_sale_names = order_sku[j].sku_sale_attr_names
                            var sku_sale_vals = order_sku[j].sku_sale_attr_vals
                            for (var ind = 0; ind < sku_sale_names.length; ind++) {
                                html += '<b class="product_color ">'+sku_sale_names[ind]+'：' + sku_sale_vals[ind] + '</b>'
                            }
                            html += '</li>'
                            html += '<li class="unit_price">專屬價<br/>￥' + order_sku[j].price + '</li>'
                            html += '<li class="count">' + order_sku[j].count + '件</li>'
                            html += '<li class="payments_received">￥' + order_sku[j].total_amount + '</li>'
                            html += '<li class="trading_status"><br /><a href="product_details.html?skuid='+order_sku[j].id+'">商品詳情</a><br/></li>'
                            html += '</ul>'
                            html += '</div>'
                        }
                    }
                }else if (!result.result) {
                    var html = ''
                    html += '<div class="order_empty">'
                    html += '<img src="../images/myOrder/myOrder3.png" alt=""/>'
                    html +='<p>你可能還沒有訂單(⊙o⊙)</p>'
                    html +='<span>趕緊去下單吧 <b>去購物</b></span>'
                    html +='</div>'
                }
                $('.rightsidebar_box').html(html)


            },
            error: function (err) {
                console.log(err);
            }
        });
    }
function confirm(order_id){
        var token=localStorage.getItem("token")
        var username = localStorage.getItem("username");
        $.ajax({
            url:baseUrl+'/dailee/orders/'+username,
            // data:{status:2,order_id:order_id},
            contentType:'application/json',
            datatype:JSON,
            type:'put',
            data : JSON.stringify({'order_id':order_id}) ,
            beforeSend:function(request){
                            request.setRequestHeader("authorization",token)
            },
            success:function (data) {
                if(data.code == 403){
							alert('用戶認證已過期，請重新登入');
							window.localStorage.removeItem('username');
							window.localStorage.removeItem('token');
							window.localStorage.removeItem('count');
							location.href = 'login.html'
						}
                if(data.code==200){
                    alert('確認收貨成功')
                    getData(4)
                }
            },
            error:function (e) {
                alert('system error!')
            }
        })
    }
$('#all_orders').click(function () {
        getData(0)
    });
     $('#obligation').click(function () {
        getData(1)
    });
    $('#undelivered').click(function () {
        getData(2)
    });
    $('#wait_receiving').click(function () {
       getData(3)
    });
    $('#finished').click(function () {
       getData(4)
    });
