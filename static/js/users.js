function _init_usermange_detail(){
    if(jQuery("#usermanage_container").length <= 0) return;

    var body_width = jQuery("body").width();
    if(body_width<768 && jQuery(".usermanage_leftslider.new").length==0){
        //return;
    }

    jQuery("#usermanage_container").each(function(){

        var hash = location.hash;
        var curr_action = "";
        if(hash.indexOf("#usermange")>-1){
            hash = hash.replace("#usermange-","");
            var tmp = hash.split("-");
            var obj = jQuery(this);
            if(jQuery(this).find(".usermenu."+tmp[0]).length>0){
                obj = jQuery(this).find(".usermenu."+tmp[0]);
            }
            open_user_detail(tmp[1],obj,tmp[0],tmp[2],tmp[4],tmp[3]);
        }else{

//			if(jQuery(".usermanage_container .usermenu.detail").length>0){
//				open_user_detail("detail",jQuery(this).find(".usermenu.detail"),"user");
//			}else{
//				open_user_detail("detail",jQuery(this),"user");
//			}
            if(jQuery(this).find(".usermanage_leftslider.new").length==0 && body_width>768){
                jQuery(this).find(".usermanage_page>div:eq(1) a").click();
            }

        }
    })

}
function open_user_detail_confirm(status,obj,curr_action,sider,$id,$paged,msg){
    if(confirm(msg)){
        open_user_detail(status,obj,curr_action,sider,$id,$paged)
    }
}
function open_user_detail(status,obj,curr_action,sider,$id,$paged){
    var p = jQuery(".usermanage_container");
    if(p.hasClass("doing")){
        return;
    }
    if( jQuery(obj).hasClass("usermenu")){
        p.find(".active.usermenu").removeClass("active");
        jQuery(obj).addClass("active");
    }
    p.addClass("doing");
    var width = jQuery("body").width();
    var isleft = false;
    var action = "bit_get_user_order_details";
    if(curr_action=="user") {
        action = "bit_get_user_details";
    }else if(curr_action=="qfdiscuz"){
        action = "wpdGetInfo";
    }

    if(sider=="order" && sider=="left"){
        isleft = true;
        jQuery(obj).find("i").attr("data-tmpclass",jQuery(obj).find("i").attr("class") ).attr("class","fa fa-spinner fa-spin fa-3x fa-fw");
    }else if(sider=="right"){
        if(obj && jQuery(obj).length>0){
            jQuery(obj).siblings().removeClass("active");
            jQuery(obj).addClass("active");
        }
        p.find(".bit-order-list:visible").prepend('<div class="user_loading" style="z-index:11;position:absolute;height:100%;width:100%;padding-top:200px; background: rgba(255,255,255,0.2);text-align: center;max-width: 100%;"><img src="https://f.goodq.top/qfy-content/plugins/qfy_form/admin/images/loading.gif" /></div>');
    }else{
        if(width<992){
            isleft = true;
        }
        if(obj && jQuery(obj).length>0){
            jQuery(obj).siblings().removeClass("active");
            jQuery(obj).addClass("active");
        }

        p.find(".bit-order-list").prepend('<div class="user_loading" style="z-index:11;position:absolute;height:100%;width:100%;padding-top:200px;background: rgba(255,255,255,0.2);text-align: center;max-width: 100%;"><img src="https://f.goodq.top/qfy-content/plugins/qfy_form/admin/images/loading.gif" /></div>');
    }

    if(!is_edit_model){
        if(!sider) sider="";
        if(!$paged) $paged="0";
        if(!$id) $id="0";
        location.hash = "#usermange-"+curr_action+"-"+status+"-"+sider+"-"+$paged+"-"+$id;
    }

    var shortcode = p.attr("data-shortcode");

    jQuery.post(
        "/admin/admin-ajax.php",
        {"action":action,"curr_action":curr_action,"status":status,"id":$id,"paged":$paged,"shortcode":shortcode},
        function(data){
            p.removeClass("doing");
            jQuery(".bit-order-loading").hide();
            jQuery("body").addClass("openUser");
            p.closest("section").addClass("openUser");
            if(data==0){
                data="<div class='empty' style='text-align:center;'><i class='fa-dropbox fa' style='font-size:150px;color:#EDEDED;padding:20px;</i></div>";
            }
            var currobj = false;
            if(p.find(".usermanage_leftslider .bit-order-list").length>0 ){
                currobj =  p.find(".usermanage_leftslider .bit-order-list");
                currobj.html(data);
                if(p.find(".usermanage_leftslider").hasClass("new")){
                    p.find(".usermanage_leftslider .bit-order-list").show();
                    p.find(".usermanage_leftslider .usermanage_page").hide();
                }
            }else{
                currobj =  p.find(".usermanage_rightslider .bit-order-list");
                currobj.html('');
                currobj.html(data);
                if(width<992){
                    var hash = location.hash;
                    if(hash.indexOf("#usermange-address")>-1) {
                        isleft = true;
                    }
                }
            }


            if(isleft){
                if(jQuery(".usermanage_leftslider.new").length==0) {
                    jQuery(obj).find("i").attr("class", jQuery(obj).find("i").attr("data-tmpclass"));
                    var content = currobj.prop("outerHTML");
                    p.find(".usermanage_leftslider .usermanage_page").addClass("page-from-center-to-left");
                    p.find(".usermanage_leftslider .page-from-right-to-center").remove();
                    p.find(".usermanage_leftslider").append('<div class="usermanage_page page-from-right-to-center" style="position:absolute;top:0;width:100%;">' + content + '</div>');
                    setTimeout(function () {
                        p.find(".usermanage_leftslider .usermanage_page.page-from-center-to-left").hide();
                        p.find(".usermanage_leftslider .usermanage_page.page-from-right-to-center").attr("style", "");
                    }, 500);
                }
            }
            p.find(".mypages.pagenav a,.usermanage_content .bitcommerce-pagination .page-numbers").removeAttr("href").click(function(){
                var $paged = jQuery(this).attr("paged");
                if($paged) open_user_detail(status,obj,curr_action,sider,$id,$paged);
                return;
            })


            jQuery('.qfy_datatable_event:not(.loaded)').each(function(){
                $this = jQuery(this);
                if(typeof jQuery.fn.DataTable=="undefined"){
                    jQuery.getScript("/FeiEditor/bitSite/js/dataTables/jquery.dataTables.js").done(function() {
                        qfy_dataTable_event($this);
                    })
                }else{
                    qfy_dataTable_event($this);
                }
            })
            if( jQuery('[data-toggle="distpicker"]').length>0 ){
                jQuery('[data-toggle="distpicker"]').distpicker();
            }
            if(jQuery('#wfb-field-529934205').length>0){
                jQuery('#wfb-field-529934205').change(function(){
                    var v = jQuery(this).val();

                    jQuery("#wfb-field-285802024-div").hide();
                    jQuery("#wfb-field-285802024").removeAttr("required");
                    jQuery("#wfb-field-621199176-div").hide();
                    jQuery("#wfb-field-621199176").removeAttr("required");
                    jQuery("#wfb-field-2048904415-div").hide();
                    jQuery("#wfb-field-2048904415").removeAttr("required");
                    jQuery("#wfb-field-40319956-div").hide();
                    jQuery("#wfb-field-40319956").removeAttr("required");
                    jQuery("#wfb-field-1580078475-div").hide();
                    jQuery("#wfb-field-1580078475").removeAttr("required");
                    jQuery("#wfb-field-994560765-div").hide();
                    jQuery("#wfb-field-994560765").removeAttr("required");
                    jQuery("#wfb-field-1033579469-div").hide();
                    jQuery("#wfb-field-1033579469").removeAttr("required");
                    jQuery("#wfb-field-20601757-div").hide();
                    jQuery("#wfb-field-20601757").removeAttr("required");

                    if(v=="普通发票"||v=="普通增值税发票"){
                        jQuery("#wfb-field-285802024-div").show();
                        jQuery("#wfb-field-285802024").attr("required","true");
                        jQuery("#wfb-field-621199176-div").show();
                        jQuery("#wfb-field-621199176").attr("required","true");
                    }else{
                        jQuery("#wfb-field-2048904415-div").show();
                        jQuery("#wfb-field-40319956-div").show();
                        jQuery("#wfb-field-1580078475-div").show();
                        jQuery("#wfb-field-994560765-div").show();
                        jQuery("#wfb-field-1033579469-div").show();
                        jQuery("#wfb-field-20601757-div").show();

                        jQuery("#wfb-field-2048904415").attr("required","true");
                        jQuery("#wfb-field-40319956").attr("required","true");
                        jQuery("#wfb-field-1580078475").attr("required","true");
                        jQuery("#wfb-field-994560765").attr("required","true");
                        jQuery("#wfb-field-1033579469").attr("required","true");
                        jQuery("#wfb-field-20601757").attr("required","true");
                    }
                });
                jQuery('#wfb-field-529934205').change();
            }

            if(jQuery(".web_address_objs").length>0){
                var web_address_objs = jQuery.parseJSON(jQuery(".web_address_objs").html());

                var paddress = jQuery(".bitcommerce-address #customer_details");
                jQuery.each(web_address_objs,function(key,value){

                    if(paddress.find("[name='"+key+"']").length>0){
                        if(key=="shipping_state_new"){
                            paddress.find("[name='"+key+"']").val(value).change();
                        }else if(key=="shipping_city_new"){
                            setTimeout(function(){
                                paddress.find("[name='"+key+"']").val(value).change();
                            },50);
                        }else if(key=="shipping_district_new"){
                            setTimeout(function(){
                                paddress.find("[name='"+key+"']").val(value);
                            },100);
                        }else {
                            paddress.find("[name='"+key+"']").val(value);
                        }
                    }
                });
                web_address_objs = "";
            }


            if(curr_action=="user"){
                /* reinitialise */
                qfyuser_responsive();
                qfyuser_chosen();
                qfyuser_fluid_videos();
                qfyuser_ajax_picupload();
                if(typeof(qfyuser_media_manager)=='function')
                {
                    qfyuser_media_manager();
                }
                jQuery('.qfyuser form').each(function(){
                    qfyuser_collapse( jQuery(this) );
                });
                qfyuser_overlay_center('.qfyuser-overlay-inner');
            }else if(curr_action=="billing_address"  || curr_action=="address"){
                chang_city_init();
                p.find(".qfyuser-submit .qfyuser-button").click(function(){
                    p.find('input[type=submit],input[type=button]').attr('disabled','disabled');
                    p.find('img.qfyuser-loading').show().addClass('inline');
                    jQuery(this).closest("form").ajaxSubmit({
                        success: function (result)
                        {
                            p.find('input[type=submit],input[type=button]').removeAttr('disabled');
                            p.find('img.qfyuser-loading').hide().removeClass('inline');
                            var pp = p.closest(".usermanage_container");
                            var msg = pp.attr("data-t-2")?pp.attr("data-t-2"):"信息保存成功！";
                            qfyuser_overlay_confirmation(msg);
                            if(p.find("input[name='fromPage']").length>0){
                                setTimeout(function(){
                                    location.href = p.find("input[name='fromPage']").val();
                                },2000);

                            }
                        }
                    });
                })

            }else if(curr_action=="qfdiscuz"){
                jQuery(".discuz_name").html(jQuery(".usermanage_qfdiscuz .title").html());
                jQuery(".wpd-content-item").addClass("wpd-active");

            }

        });


}
function open_user_back(){
    if( jQuery(".usermanage_leftslider").hasClass("new")){
        jQuery(".usermanage_leftslider .bit-order-list").hide();
        jQuery(".usermanage_leftslider .usermanage_page").show();
        location.href="";
    }else{
        jQuery(".usermanage_leftslider .page-from-right-to-center").removeClass("page-from-right-to-center").addClass("page-from-center-to-right");
        jQuery(".usermanage_leftslider .page-from-center-to-left").removeClass("page-from-center-to-left").css({"position":"absolute","top":"0","display":"block","width":"100%","z-index":"1"}).addClass("page-from-left-to-center");
        setTimeout(function(){
            jQuery(".usermanage_leftslider .usermanage_page.page-from-left-to-center").removeClass("page-from-left-to-center").attr("style","");
            jQuery(".usermanage_leftslider .usermanage_page.page-from-center-to-right").remove();
        },500);

    }
    jQuery(".openUser").removeClass("openUser");

}