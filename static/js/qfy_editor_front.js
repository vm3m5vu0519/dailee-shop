document.documentElement.className += ' js_active ';
document.documentElement.className += 'ontouchstart' in document.documentElement ? ' vc_mobile ' : ' vc_desktop ';
(function(){
    var prefix = ['-webkit-','-o-','-moz-','-ms-',""];
    for (var i in prefix) { if(prefix[i]+'transform' in document.documentElement.style) document.documentElement.className += " vc_transform "; }
})();


function image_lazy_event(){
	if(jQuery("[data-delay-image='1']").length>0){
		 jQuery("[data-delay-image='1']").lazy(
			        {
			        	effect:'fadeIn',
			            effectTime:400,
			            threshold: 800,
			        }
			);
	}
}
function hexToRgb(hex) {
	if(hex=="transparent") return "transparent";
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function vc_js_init(){
	//bind slidercontent
	if(!is_edit_model) {
		if (jQuery(".qfy-element.qfy-slidercontent").length > 0 && jQuery("a[href^='qfylinked_']").length > 0) {
			jQuery("a[href^='qfylinked_']:not(.loaded)").each(function () {
				jQuery(this).addClass("loaded");
				var url = jQuery(this).attr("href");
				url = url.replace("%5E", "^").replace("%5E", "^");

				if (url.indexOf("^") > -1) {
					url = url.substr(10);
					var url_tmp = url.split("^");
					var uuid = url_tmp[0];
					var type = url_tmp[1];
					var to = url_tmp[2];

					if (uuid) {
						var obj = jQuery("[qfyuuid='" + uuid + "']>.royalSlider_gallery_new");
						if (obj.length > 0) {
							if (type == "1") {
								jQuery(this).click(function (e) {
									e.preventDefault();
									e.stopPropagation();
								}).mouseenter(function (e) {
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								});
							} else {
								jQuery(this).click(function (e) {
									e.preventDefault();
									e.stopPropagation();
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								});
							}
						}
					}
				}
			});

		}
		//
		if (jQuery(".qfy-element.qfe_gallery").length > 0 && jQuery("a[href^='qfyrelaed_']").length > 0) {
			jQuery("a[href^='qfyrelaed_']:not(.loaded)").each(function () {
				jQuery(this).addClass("loaded");
				var url = jQuery(this).attr("href");
				url = url.replace("%5E", "^").replace("%5E", "^");
				if (url.indexOf("^") > -1) {
					url = url.substr(10);
					var url_tmp = url.split("^");
					var uuid = url_tmp[0];
					var type = url_tmp[1];
					var to = url_tmp[2];

					if (uuid) {

						if (type == "1") {

							jQuery(this).click(function (e) {
								e.preventDefault();
								e.stopPropagation();
							}).mouseenter(function (e) {
								var obj = jQuery("[qfyuuid='" + uuid + "'] .royalSlider_gallery");
								if (obj.length > 0) {
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").length > 0) {
									jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").flexslider(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .swiper-container").length > 0) {
									jQuery("[qfyuuid='" + uuid + "'] .swiper-container").data('swiper').slideTo(to);
								}
							});
						} else {
							jQuery(this).click(function (e) {
								e.preventDefault();
								e.stopPropagation();
								var obj = jQuery("[qfyuuid='" + uuid + "'] .royalSlider_gallery");
								if (obj.length > 0) {
									var slider = obj.data('royalSlider');
									slider.goTo(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").length > 0) {
									jQuery("[qfyuuid='" + uuid + "'] .qfe_flexslider").flexslider(to - 1);
								} else if (jQuery("[qfyuuid='" + uuid + "'] .swiper-container").length > 0) {

									jQuery("[qfyuuid='" + uuid + "'] .swiper-container").data('swiper').slideTo(to);
								}
							});
						}
					}
				}
			});

		}
	}

	// BEGIN
	if(jQuery(".swiper-container:not(.loaded)").length>0){
		 if(typeof jQuery.fn.Swiper=="undefined"){
			 jQuery.onDemandScript("/FeiEditor/bitSite/js/swiper/swiper-4.1.0.min.js",function() {
				 jQuery('head').append('<link href="/FeiEditor/bitSite/js/swiper/swiper-4.1.0.min.css" rel="stylesheet" type="text/css" />');
				 swiper_event();
			 })
		 }else{
			 swiper_event();
		 }
	}
	image_lazy_event();

	vc_3d_photo();
	lottieReady(jQuery);
	shape_ready();

	jQuery("#shopping-cart-bitcommerce .carsize:not(.pulse1)").addClass("pulse1");

	jQuery(".srollupdown:not(.load)").each(function(){
		jQuery(this).addClass("load");
		var all = jQuery(this).attr("data-scroll-all");
		var num = jQuery(this).attr("data-scroll-num");
		var speed = jQuery(this).attr("data-scroll-speed");
		var delay = jQuery(this).attr("data-scroll-delay");
		var slideBox = jQuery(this).find("ul:first");

		var allheight = slideBox.css("height").replace("px","")*1;

		var delay = delay||1000,speed = speed||20;
		var tid = null,pause = false;
		var s = function(){		slideBox.attr("style","overflow:hidden !important;height:"+allheight+"px;");slideBox.find("li").removeClass("displaynone");tid=setInterval(slide_scroll, speed); }
		var slide_scroll = function(){
			if(pause) return;
			slideBox.scrollTop(slideBox.scrollTop()+ 2);
			var scrolltop = slideBox.scrollTop();
			if(num>1){
				var first_height = 0;
				var marginbottom =  0;
				slideBox.find("li").each(function(i){
					if(i<num){
						first_height = first_height*1 +jQuery(this).css("height").replace("px","")*1;
						marginbottom =  marginbottom*1 +jQuery(this).css("margin-bottom").replace("px","")*1;
					}
				})
			}else{
				var first_height = slideBox.find("li:eq(0)").css("height").replace("px","");
				var marginbottom =  slideBox.find("li:eq(0)").css("margin-bottom").replace("px","");
			}
			if(scrolltop>=first_height*1+marginbottom*1){
				clearInterval(tid);
				if(num>1){
					slideBox.find("li").each(function(i){
						if(i<num){
							slideBox.append(slideBox.find("li")[0]);
						}
					})
				}else{
					slideBox.append(slideBox.find("li")[0]);
				}
				slideBox.scrollTop(0);
				setTimeout(s, delay);
				}
		}
		slideBox[0].onmouseover=function(){pause=true;}
		slideBox[0].onmouseout=function(){pause=false;}
		setTimeout(s, delay);
	});
	jQuery('.qfy_datatable_event:not(.loaded)').each(function(){
		$this = jQuery(this);
		if(typeof jQuery.fn.DataTable=="undefined"){
			jQuery.onDemandScript("/FeiEditor/bitSite/js/dataTables/jquery.dataTables.js",function() {
				 qfy_dataTable_event($this);
			 })
		}else{
			qfy_dataTable_event($this);
		}
	})
	jQuery(".opentip:not(.played)").each(function(){
		var $this = jQuery(this);
		var imageurl = jQuery(this).attr("op-image");
		if(imageurl&& imageurl.indexOf("http://")>-1){
			imageurl = imageurl.replace("http://","//");
		}
		var title = jQuery(this).attr("op-title");
		var data_pop = jQuery(this).attr("op-style");
		var titlealign = jQuery(this).attr("op-titlealign");
		var stylealign = jQuery(this).attr("op-stylealign");
		var tiptitle= "";
		var download = false;
		if(imageurl){

			tiptitle +="<img style='max-width:100%;' src='"+imageurl+"'  />";
		}
		if(title){
			tiptitle +="<div style='margin-top:5px;text-align:"+titlealign+"'>"+title+"</div>";
		}
		if(stylealign){
			var data = { tipJoint:stylealign, fixed:true,style: data_pop };
		}else{
			var data = { style: data_pop };
		}
		if(imageurl){
			jQuery("<img />").attr("src", imageurl).load(function(){
				setTimeout(function(){new Opentip( $this, tiptitle, data);},1500);
			})
			$this.addClass("played");

		}else{
			new Opentip( $this, tiptitle, data);
			$this.addClass("played");
		}
	})


	if(	jQuery('.qfy-jiathis').length>0){
		if(typeof jQuery.fn.share !="function"){
			 jQuery.onDemandScript("/FeiEditor/bitSite/js/share/jquery.share.min.js",function() {
				 jQuery('head').append('<link href="/FeiEditor/bitSite/js/share/css/share.min.css" rel="stylesheet" type="text/css" />');
				 jQuery('.qfy-jiathis .share').share();
			 })
		}else{
			 jQuery('.qfy-jiathis .share').share();
		}
	}

	var video_len = jQuery('.video.preload:not(.played)').length;
	if(video_len>0){
		jQuery('.video.preload:not(.played)').each(function(){
			if(jQuery("body").width()<760 && video_len==1 ){
				jQuery(this).addClass("played").attr("src",jQuery(this).attr("data-src"));
			}else{
				jQuery(this).waypoint({
					handler: function(direction) {
						jQuery(this).addClass("played").attr("src",jQuery(this).attr("data-src"));
					},
					triggerOnce: true,
					offset: "95%",
				})
			}
		})
	}



	vc_royalSlider_gallery_init();

	if(!is_edit_model){
		accordioncontent();
	}
	if( jQuery('.qfy-accordioncontent').length>0){
		if(typeof accordioncontent_init !="function"){
			jQuery.onDemandScript("/qfy-content/themes/qfy-01/js/a-accord.js",function() {
				accordioncontent_init();
			});
		}else{
			accordioncontent_init();
		}
	}


	jQuery( ".dl-qfymobile-menu:not(.loaded)" ).each(function(){
		var backCap = jQuery(this).find(".menu-back").html();
		jQuery(this).find(".children.dl-submenu").prepend("<li class='menu-item dl-back'><a href='#'><span>"+backCap+"</a></li>");
		jQuery(this).addClass("loaded").dlmenu();
	})

   if(!is_edit_model){
		jQuery( ".background-media.mediagallery:not(.loaded)" ).each(function(){
			var $this = jQuery(this);
			jQuery(this).addClass("loaded On");
			var imagebgs = jQuery(this).attr("data-imagebgs");

			var imagebgs_arr = imagebgs.split("|^|");
			var imagebgs_count = imagebgs_arr.length;
			var imagebgs_current = 0;
			var time =  jQuery(this).attr("data-time")?jQuery(this).attr("data-time"):3;
			var thishtml = $this.prop("outerHTML");
			var tmp = "";
			for(var i=0;i<imagebgs_count-1;i++){
				$this.before(thishtml);
				$this.prev().css({'opacity':'0','background-image': 'url('+imagebgs_arr[i]+')'}).removeAttr("data-imagebgs").removeClass("On");
			}
			var p =  jQuery(this).parent();
			setInterval(function(){
				if(p.attr("id")){
					imagebgs_current = p.find(".background-media.On").index('#'+p.attr("id")+'>.background-media');
				}else{
					var p_class= p.attr("class");
					var tmpclass = p_class.split(" ");
					var currclass = "";
					for(var i =0;i<tmpclass.length;i++){
						if(tmpclass[i].indexOf("qfy-row")>-1){
							currclass = tmpclass[i];
						}
					}
					if(currclass){
						imagebgs_current = p.find(".background-media.On").index('.'+currclass+' .background-media');
					}else{
						imagebgs_current = p.find(".background-media.On").index('.background-media');
					}
				}
				p.find(".background-media.On").removeClass("On").css({'opacity':'0'})
				if(imagebgs_current==imagebgs_count-1){
					p.find(".background-media:eq(0)").addClass("On").css({'opacity':'1'});
				}else{
					p.find(".background-media:eq("+(imagebgs_current+1)+")").addClass("On").css({'opacity':'1'});
				}
			},time*1000);

		})

	     if(jQuery(".qfy-comments .commentlist:hidden").length>0){
			jQuery(".qfy-comments").each(function(){

				var p = jQuery(this);
				if(p.find(".commentlist:visible").length>0) return;
				var loadhtml = "<div class='commentlist_loading' style='text-align:center;height:30px;margin:15px auto;' ><img src='/qfy-content/plugins/qfbook/templates/default/images/loader.gif' /></div>";
				p.find(".commentlist").after(loadhtml);

				var form =p.find("form#commentform");
				var comment_post_ID = form.find("#comment_post_ID").val();
				var url  = form.attr("action");

				jQuery.post(url,{action:"search",comment_post_ID:comment_post_ID,short_atts:p.attr("data-atts")},function(data){
					if(data.indexOf("success")>-1){

						var tmp = data.split('|<result>|');
						var commentlist = $(tmp).find(".commentlist");
						p.find(".commentlist").html(commentlist.html());
					}
					p.find(".commentlist").show();
					p.find(".commentlist_loading").remove();
				})

			})
		}
	}
	if(typeof qfy_canvas_animale_run=="function"){
		qfy_canvas_animale_run();
	}
	var objs = jQuery(".qfy-icons_list .qfy-icon");
	objs.each(function(){
		var obj = jQuery(this);
		var name = obj.attr("data-desc");
		var bg = obj.attr("data-bg");
		var bgstyle= "";
		if(bg ){
			bgstyle = "background:"+bg+";margin:-20px;padding:20px;";
		}
		var image = obj.attr("data-image");
		var tj = obj.attr("data-tj")=="0"?"top":"bottom";
		var ta = obj.attr("data-ta");
		var width = obj.attr("data-width");
		var align="left";
		if(ta=="1") align="right";
		else if(ta=="2") align="center";
		obj.attr("title", '');
		var text = "";
		if(name){
			text ="<div style='text-align:"+align+";'>"+base64_decode(name)+"</div>";
		}
		if(image){
			if(width){
				var title ="<div style='width:"+width+"px;text-align:center;"+bgstyle+"'><img src='"+image+"' style='max-width:100%;' /><div style='word-break: break-all;'>"+text+"</div></div>";
			}else{
				var title ="<div style='text-align:center; "+bgstyle+" '><img src='"+image+"' width='160' style='max-width:100%;' /><div style='word-break: break-all;'>"+text+"</div></div>";
			}
			var img = new Image();
	        img.onload = img.onerror =function() {
	        	var data = { tipJoint: tj,style: "dark" };
				setTimeout(function(){
						new Opentip(obj, title, data);

					},300);


	        };
	        img.src = image;

		}else if(text){
			if(width){
				var last = "<div style='width:"+width+"px;word-break: break-all;"+bgstyle+"'>"+text+"</div>";
			}else{
				var last = "<div style='word-break: break-all;"+bgstyle+"'>"+text+"</div>";
			}

			var data = { tipJoint: tj,style: "dark" };
			new Opentip(obj, last, data);

		}


	})
	jQuery(".qfyvideo").unbind().mouseenter(function(){
		 if(! jQuery(this).parent().hasClass("list_popup")){
			 jQuery(this).get(0).play();
		 }
     }).mouseleave(function(){
    	 if(! jQuery(this).parent().hasClass("list_popup")){
	    	 if(jQuery(this).get(0).currentTime>0){
	    		 jQuery(this).get(0).load();
	    	 }
    	 }
     })


	 jQuery('[data-ride="vc-carousel"]').each(function(){
				qfy_carousel_fun(jQuery(this))
		})
	jQuery(".qfy_scroll_box:not(.load)").each(function(){
		jQuery(this).addClass("load");
		var box = jQuery(this).attr("id");
		var delay = jQuery(this).attr("data-delay");
		var speed = jQuery(this).attr("data-speed");
		var h = jQuery(this).attr("data-h");
		slideLine(box,"div",delay,speed,h);
	});
	if(!is_edit_model){
		jQuery("a[href^='qfy_notice']").each(function(){
			var id = jQuery(this).attr("href");
			jQuery(this).attr("data-href",id);
			jQuery(this).removeAttr("href");
			jQuery(this).unbind().click(function(e){
				e.preventDefault();
				e.stopPropagation();

				if(jQuery("#"+id).length>0){
					notice_pre_event("#"+id+" .notice_warp","preview");
				}
			})
		});
	}else{
		jQuery("a[href^='qfy_notice']").unbind().click(function(e){
			 e.preventDefault();
			 e.stopPropagation();
			 var id = jQuery(this).attr("href");
			 if(jQuery("#"+id).length>0){
				 notice_pre_event("#"+id+" .notice_warp","preview");
			 }
		})
	}

	jQuery(".qfyanimate:not(.qfyanimated)").each(function(){
		var animaleinbegin =  jQuery(this).attr("data-animaleinbegin");
		if(!animaleinbegin) animaleinbegin = "bottom-in-view";
 		jQuery(this).waypoint({
			handler: function(direction) {
				var delay = jQuery(this).attr("data-delay");
				var duration = jQuery(this).attr("data-duration");
				if(delay===""){
					// 列使用
					if(jQuery(this).hasClass("qfy-column-inner")){
						delay = jQuery(this).index()*0.1/2;
					}
				}
				var animalename = jQuery(this).attr("data-animalename");
				if(duration){
					jQuery(this).css("animation-duration",duration+"s");
				}
				jQuery(this).css("animation-delay",delay+"s").css("animation-name",animalename).css("visibility","visible");
				jQuery(this).addClass("qfyanimated");
			},
			triggerOnce: true,
			offset: animaleinbegin,
		})
	})
	jQuery(".clippathanimate:not(.clippathanimated)").each(function(){

		jQuery(this).waypoint({
			handler: function(direction) {
				jQuery(this).addClass("clippathanimated");
			},
			offset: "bottom-in-view",
		})
	});

	if( jQuery(".auto_tab_menu").length>0){
		jQuery(".auto_tab_menu").each(function(){
			auto_tab_menu(jQuery(this));
		});
	}

	typed_event();

	prenext_event();
	// END
}
function vc_js_init2(){
	 // console.trace();
	 init_usermange_detail();
	  vc_slidersBehaviour();
	  vc_waypoints();
	  vc_teaserGrid();
	  vc_carouselBehaviour();
	  vc_plugin_flexslider();
	  resizefullpageheader();
	  bitLibLayout();
	  bit_circliful();
	  bit_counter();
	  bit_counterdown();
	  bit_newgallery();
	  qfy_jplayer_init();
	  bit_myaccountLayout();
	  bit_qfbook();
	  bit_qfbookform();
	  setTimeout(function(){  bit_reloadiframevideo();},1000);
}
var is_edit_model = false;
try{
	if( parent.jQuery("#vc-inline-frame").length==1 ){
		is_edit_model = true;
	}
}catch(e){
}
jQuery(document).ready(function($) {

  if(!is_edit_model){
	  vc_js_init();
	  vc_js_init2();
  }
  jQuery(document).click(function(e) {
	 if(jQuery("body.clicktoaddmodel").length>0){
		 var target = jQuery(e.target);
		 if(target.closest(".vc-element.vc-vc_row").length==0){
			jAlert("亲，您点在了不能插入区块的地方。请选择内容区域的一个区块。");
			return false;
		 }
	 }
  });

}); // END jQuery(document).ready
jQuery(window).resize(function() {
	 // 手机上滚动会触发这个resize
	 var body_width = jQuery("body").width();
	 if(body_width>768){
		 bitLibLayout();
	 }
	 var maxwidth = 0;
	 jQuery(".qfe_gallery .qfe_gallery_slides").find('img').each(function(){
		if(jQuery(this).width()>maxwidth){
			maxwidth = jQuery(this).width();
		}
	 })
	 if(maxwidth>body_width) {
		 vc_plugin_flexslider();
	 }
});
jQuery(window).on("debouncedresize", function() {
		jQuery(".ts-circliful-counter").each(function() {
			if ("true" == jQuery(this).attr("data-responsive")) {
				var t = jQuery(this),
					e = parseInt(jQuery(this).parent().width()),
					a = parseInt(jQuery(this).attr("data-size"));
				e != a && (t.empty(), t.circliful())
			}
		})
});
function resizefullpageheader(){
	if(jQuery(".bit-html .fullscreenpage.fullpage_layout2").length>0||jQuery(".bit-html .fullscreenpage.fullpage_layout3").length>0||jQuery(".bit-html .fullscreenpage.fullpage_layout4").length>0){
		jQuery(".bit-html .fullscreenpage #fullscreenheader").css("margin-top","-"+(jQuery(".bit-html .fullscreenpage #fullscreenheader").height()/2)+"px");
	}
}
function typed_event(){
	if(jQuery(".qfy-simple_header:not(.loaded)").length==0) return;
	if(typeof Typed!="function"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/typed.min.js",function() {
			 _typed_event();
		 })
	 }else{
		 _typed_event();
	 }
}
function prenext_event(){
	var lrmiddlelayout = jQuery("#page .lrmiddlelayout:first:not(.loaded)");
	 var body_width = jQuery("body").width();

	if(lrmiddlelayout.length>0 ){

		lrmiddlelayout.addClass("loaded");
		 jQuery(".lrmiddlelayout.wrap").remove();
		var pre_html = '<div class="lrmiddlelayout wrap" style="position: fixed;top:35%;left:0px;z-index:4;display:table;"><div class="prenext_inner" style="width:auto;">';
		pre_html += lrmiddlelayout.find(".pre_inner").prop("outerHTML");
		pre_html += '</div></div>';
		var next_html = '<div class="lrmiddlelayout wrap" style="position: fixed;top:35%;right:0px;z-index:4;display:table;"><div class="prenext_inner" style="width:auto;">';
		next_html += lrmiddlelayout.find(".next_inner.first").prop("outerHTML");
		next_html += '</div></div>';
		if(lrmiddlelayout.hasClass("mobileHidden") && body_width<768){

		}else if(lrmiddlelayout.hasClass("desktopHidden") && body_width>768){

		}else{
			jQuery("body").append(pre_html+next_html);
		}
	}
	if( jQuery("#page .lrmiddlelayout").length==0){
		jQuery(".lrmiddlelayout.wrap").remove();
	}
}
function bit_circliful(obj){

	if( "undefined" != typeof obj ){
		obj = obj.find(".ts-circliful-counter:not(.loaded)");
	}else{
		obj	= jQuery(".ts-circliful-counter:not(.loaded)");
	}
	if(obj.length==0) return;
	if(typeof jQuery.fn.circliful=="undefined"){
		jQuery.onDemandScript("/qfy-content/plugins/qfy_editor/js/jquery.circliful.min.js",function() {
			_bit_circliful(obj);
		 })
	}else{
		_bit_circliful(obj);
	}

}
function _bit_circliful(obj){
	"undefined" != typeof jQuery.fn.waypoint && "undefined" != typeof jQuery.fn.circliful && obj.each(function() {
		jQuery(this).bind("inview", function(t, e, a, i) {
			if (e) {
				var r = jQuery(this);
				"top" == i || "bottom" == i || r.addClass("ts-circliful-visible")
			} else {
				var r = jQuery(this);
				r.removeClass("ts-circliful-visible")
			}
		})

		jQuery(this).addClass("loaded").circliful();

	});
}
function formatNumber(s,o){
	 s = s+"";
	 if(/[^0-9\.]/.test(s)) return false;
        s=s.replace(/^(\d*)$/,"$1.");
        s=s.replace(".",o);
        var re=/(\d)(\d{3},)/;
        while(re.test(s))
                s=s.replace(re,"$1,$2");
        s=s.replace(/,(\d\d)$/,".$1");
		s=s.substring(0,s.length-1);
        return s;
}
function bit_counter(obj){
	if( "undefined" != typeof obj ){
		obj = obj.find(".ts-icon-counter");
		if(obj.length==0) return false;
	}else{
		obj	= jQuery(".ts-icon-counter");
	}
	if(obj.length==0) return;
	 if(typeof jQuery.fn.countTo=="undefined"){
		 jQuery.onDemandScript("/qfy-content/plugins/qfy_editor/js/jquery.countto.min.js",function() {
			 _bit_counter(obj);
		 })
	 }else{
		 _bit_counter(obj);
	 }
}
function bit_newgallery(obj){
	if( "undefined" != typeof obj ){
		obj = obj.find(".royalSlider_gallery");
		if(obj.length==0) return false;
	}else{
		obj	= jQuery(".royalSlider_gallery");
	}
	 if(obj.length==0) return;
	 if(typeof jQuery.fn.royalSlider=="undefined"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/jquery.royalslider.min.js",function() {
			 _bit_newgallery(obj);
		 })
	 }else{
		 _bit_newgallery(obj);
	 }
}
function fullscreenclick(obj){
	jQuery(obj).closest(".royalSlider_gallery").find(".rsFullscreenIcn").click();
}
function bit_myaccountLayout(){
	var defaultindex=getCookie("qfy_order_index");

	if(jQuery(".qfy_account.tablayout").length>0 && jQuery(".qfy_account.tablayout.ontab").length==0){
		jQuery(".qfy_account > .bitcommerce").append('<div class="bitcommerce-tabs tabbed-content bitcommerce-tabs-info" style="min-height:500px;"><ul class="tabs"></ul></div>	');

		jQuery(".qfy_account .my_account_orders_h2").each(function(i){
			var name = jQuery(this);
			var content = jQuery(this).next();
			if(content.hasClass("my_account_orders_h2")||content.hasClass("bitcommerce-tabs-info")||content.length==0){
				content_html = '<div style="min-height:400px;"></div>';
			}else{
				content_html = content.prop('outerHTML');
				content.remove();
			}
			jQuery( '.bitcommerce-tabs-info ul.tabs' ).append('<li class="description_tab active"><a href="#tab-info-'+i+'" class="no-opennew">'+name.text()+'</a></li>');
			jQuery( '.bitcommerce-tabs-info ul.tabs' ).after('<div style="word-break: break-all; display: block;" id="tab-info-'+i+'" class="panel entry-content">'+content_html+'</div>');
			name.remove();

		});
		jQuery(".qfy_account.tablayout").addClass("ontab");
		var titlesize = jQuery(".qfy_account.tablayout").attr("data-size");
		if(titlesize){
			jQuery( '.bitcommerce-tabs-info ul.tabs li a' ).css("font-size",titlesize+"px");
		}
		jQuery( '.bitcommerce_account_subscriptions').hide();
		jQuery( '.bitcommerce-tabs-info .panel' ).hide();
		jQuery( '.bitcommerce-tabs-info ul.tabs li a' ).click( function() {

			var $tab = jQuery( this ),
				$tabs_wrapper = $tab.closest( '.bitcommerce-tabs-info' );

			jQuery( 'ul.tabs li', $tabs_wrapper ).removeClass( 'active' );
			jQuery( 'div.panel', $tabs_wrapper ).hide();
			jQuery( 'div' + $tab.attr( 'href' ), $tabs_wrapper).show();
			$tab.parent().addClass( 'active' );
			var index = $tab.parent().index();
			qfy_setCookie("qfy_order_index",index);
			return false;
		});
		if(defaultindex>0){
			jQuery( '.bitcommerce-tabs-info ul.tabs li:eq('+defaultindex+') a' ).click();
		}else{
			jQuery( '.bitcommerce-tabs-info ul.tabs li:first a').click();
		}
	}

}
function bit_qfbook(){
	setTimeout(function(){
		jQuery(".QFBOOKCalendar-text-message").each(function(){
			var $this = jQuery(this);
			var id = $this.attr("id");
			var val = $this.val();
			jQuery("#QFBOOKCalendar"+id).QFBOOKCalendar(jQuery.parseJSON(val));

		})
		jQuery(".QFBOOKCalendar-search-message").each(function(){
			var $this = jQuery(this);
			var id = $this.attr("id");
			var val = $this.val();
			jQuery(".QFBOOKSearch-wrapper"+id).QFBOOKSearch(jQuery.parseJSON(val));

		})
	},500)
}
function bit_qfbookform(){
	if(jQuery('#QFBOOKSearch-check-in-input').length>0){
		jQuery('#QFBOOKSearch-check-in-input').datepicker({minDate: new Date(), onSelect:function(dateText,inst){
	       jQuery("#QFBOOKSearch-check-out-input").datepicker("option","minDate",dateText);
	    }});
	}
	if(jQuery('#QFBOOKSearch-check-out-input').length>0){
	    jQuery('#QFBOOKSearch-check-out-input').datepicker({minDate: new Date(), onSelect:function(dateText,inst){
	       jQuery("#QFBOOKSearch-check-in-input").datepicker("option","maxDate",dateText);
	    }});
	}
}
function bit_reloadiframevideo(time){
	if(jQuery("div.ts_html5_video_frame_insert").length>0){
		jQuery("div.ts_html5_video_frame_insert").each(function(){
			var $this = jQuery(this);
			var auto_play = $this.attr("data-auto-play");
			if(auto_play=="true") {
				$this = $this.changeTag("iframe");
			}else if(auto_play=="2"){
				$this.parent().mouseenter(function(){
					$this.changeTag("iframe").attr("data-auto-play","true");
				});
			}else if(auto_play=="3"){
				$this.waypoint(function () {
					$this.changeTag("iframe").attr("data-auto-play","true");
				}, {offset: '85%'});
			}else{
				$this.unbind().click(function(){
					$this.changeTag("iframe").attr("data-auto-play","true");
				})
			}
		})
	}
	if(jQuery(".ts_html5_video_frame .video-box video.visible_play").length>0){
		jQuery(".ts_html5_video_frame .video-box video.visible_play").each(function(){
			var video = jQuery(this).get(0);
			jQuery(this).waypoint(function () {
				if (video.paused === false) {
					video.pause();
				} else {
					video.play();
				}
			}, {offset: '85%'});
		});
	}
}
function qfy_jplayer_init(){
	 if( jQuery(".vc_jplayer_container:not(.played)").length==0) return;
	 if(typeof jQuery.fn.videoPlayer=="undefined"){
			 jQuery.when(
				 jQuery.getScript( "/FeiEditor/bitSite/js/jsplayer/jplayer/jquery.jplayer.min.js" ),
				 jQuery.getScript( "/FeiEditor/bitSite/js/jsplayer/jplayer/jplayer.cleanskin.js" ),
				 jQuery.Deferred(function( deferred ){
					 jQuery( deferred.resolve );
			    })
			).done(function(){
				 _qfy_jplayer_init();
			});

	 }else{
		 _qfy_jplayer_init();
	 }

}
function _qfy_jplayer_init(){
	// 音频
	jQuery(".vc_jplayer_container:not(.played)").each(function(){
		var title = jQuery.trim(jQuery(this).find(">.audio-info").html());
		var mp3 = jQuery(this).find(">.audio-info").attr("data-mp3");
		var autoplay =  jQuery(this).find(">.audio-info").attr("data-auto");
		if(autoplay!=1) autoplay=null;
		var loop =  jQuery(this).find(">.audio-info").attr("data-loop");
		if(loop==1){loop=true;}else{loop=false;};
		jQuery(this).find('>.webPlayer').videoPlayer({
				"name": title,
				"autoplay":autoplay,
				"keyEnabled":false,
				"loop":loop,
				"swfPath":"/FeiEditor/bitSite/js/jsplayer/jplayer",
				"size": {"width": "100%",},
				"media": {"mp3": mp3}
				});
		jQuery(this).addClass("played");
	})
}
function bit_counterdown(){
	 if(jQuery(".ts-countdown-parent").length==0) return;
	 if(typeof jQuery.fn.countEverest=="undefined"){
		 jQuery.onDemandScript("/FeiEditor/bitSite/js/jquery.vcsc.counteverest.min.js",function() {
			 jQuery('head').append('<link href="/FeiEditor/bitSite/css/jquery.vcsc.counteverest.min.css" rel="stylesheet" type="text/css" />');
			 _bit_counterdown();
		 })
	 }else{
		 _bit_counterdown();
	 }
}

function bitLibLayout(obj){
   jQuery(".old-ie [backgroundSize='true']").css({backgroundSize: "cover"});

   if (typeof obj === 'undefined') {
		obj = jQuery(".qfe_images_lib_isotope")
   }

   obj.each(function () {
	   var current_obj = jQuery(this);
	   var curr_action = current_obj.attr("data-liblayout");
	   var filter = jQuery(this).parent().find(".isotope_image");
	   filter.each(function(){
			jQuery(this).unbind("click").bind("click",function(){
				 var f = jQuery(this).attr("data-filter");
				 var c = jQuery(this).closest(".vcgroup").attr("data-color");
				 var hc = jQuery(this).closest(".vcgroup").attr("data-hovercolor");
				 filter.removeClass("on");
				 filter.css("color",c);
				 jQuery(this).addClass("on");
				 jQuery(this).css("color",hc);
				if(curr_action=="" || curr_action=="undefined"){
					current_obj.find(">.vc-item").hide();
					current_obj.find(f).show();
				}else{

				   current_obj.isotope({
					filter: f
				   });
				}
		   }).bind("mouseover",function(){
				 var hc = jQuery(this).closest(".vcgroup").attr("data-hovercolor");
				 if( !jQuery(this).hasClass("on")){
					jQuery(this).css("color",hc);
				 }

		   }).bind("mouseout",function(){
				 var c = jQuery(this).closest(".vcgroup").attr("data-color");
				 if( !jQuery(this).hasClass("on")){
					jQuery(this).css("color",c);
				 }

		   })
	   });
   });

	if(typeof jQuery.fn.isotope!="undefined") {
		var action = obj.attr("data-liblayout");
		var columnWidth = obj.attr("data-width");

		if (obj.length == 0 || action == "" || action == "undefined") {
			return false;
		}
		obj.isotope({
			itemSelector: '.vc-item',
			layoutMode: action,
			filter: ".images,.templates"

		});

		var all_load = true;

		obj.find('img').each(function () {
			if (!jQuery(this).prop('complete')) {
				all_load = false;
			}
		});

		if (!all_load) {
			window.setTimeout(function () {
				bitLibLayout(obj);
			}, 500);
			return;
		}
		obj.isotope("reLayout");
	}
}


if ( typeof window['vc_plugin_flexslider'] !== 'function' ) {
	function vc_plugin_flexslider() {
		if (jQuery('.qfe_flexslider').length == 0) return;
		if (typeof jQuery.fn.flexslider == "undefined") {
			jQuery.onDemandScript("/qfy-content/plugins/qfy_editor/assets/lib/flexslider/jquery.flexslider-min.js",function () {
				jQuery('head').append('<link href="/qfy-content/plugins/qfy_editor/assets/lib/flexslider/flexslider.css" rel="stylesheet" type="text/css" />');
				_vc_plugin_flexslider();
			})
		} else {
			_vc_plugin_flexslider();
		}
	}
}
function qfy_carousel_fun($carousel) {

	var is_carousel_ok = true;
	$carousel.find('img').each(function () {
		if (!jQuery(this).prop('complete')) {
			is_carousel_ok = false;
		}

	})
	if (!is_carousel_ok) {
		window.setTimeout(function () {
			qfy_carousel_fun($carousel);
		}, 500);
		return;
	}

	$carousel.carousel($carousel.data());
}


/*
 * Waypoints magic ----------------------------------------------------------
 */
if (typeof window['vc_waypoints'] !== 'function') {
	function qfe_animate_fun($this) {

		var p = jQuery($this).closest(".qfy-element");
		var delay = p.attr("css_animation_delay");
		var anitime = p.attr("data-anitime");
		var anilength = p.attr("data-anilength");
		var iteration_count = p.attr("data-ani_iteration_count");
		if (anitime && anitime > 0) {
			jQuery($this).css("animation-duration", anitime + "s");
			jQuery($this).css("-webkit-animation-duration", anitime + "s");
		}
		jQuery($this).removeClass("anlength1 anlength2");
		if (anilength && anilength != 0) {
			jQuery($this).addClass(anilength);
		}
		if (iteration_count == "-1") {
			jQuery($this).css("animation-iteration-count", "infinite");
		} else if (iteration_count > 0) {
			jQuery($this).css("animation-iteration-count", iteration_count);
		}
		if (delay) {
			//出现这里需要
			setTimeout(function () {
				jQuery($this).addClass('qsa');
			}, delay * 1000);
		} else {
			if (jQuery($this).hasClass("delay1")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 1000);
			} else if (jQuery($this).hasClass("delay0.5")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 500);
			} else if (jQuery($this).hasClass("delay1.5")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 1500);
			} else if (jQuery($this).hasClass("delay2")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 2000);
			} else if (jQuery($this).hasClass("delay3")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 3000);
			} else if (jQuery($this).hasClass("delay4")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 4000);
			} else if (jQuery($this).hasClass("delay5")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 5000);
			} else if (jQuery($this).hasClass("delay6")) {
				setTimeout(function () {
					jQuery($this).addClass('qsa');
				}, 6000);
			} else {
				jQuery($this).addClass('qsa');
			}
		}

	}

	function qfe_animate_fun_new($this, type) {

		var p = jQuery($this).closest(".qfy-element");
		var delay = p.attr("data-anidelay_" + type);
		var anitime = p.attr("data-anitime_" + type);
		var anilength = p.attr("data-anilength_" + type);
		var iteration_count = p.attr("data-ani_iteration_count_" + type);

		if (anitime && anitime > 0) {
			jQuery($this).css("animation-duration", anitime + "s");
			jQuery($this).css("-webkit-animation-duration", anitime + "s");
		}
		jQuery($this).removeClass("anlength1 anlength2");
		if (anilength && anilength != 0) {
			jQuery($this).addClass(anilength);
		}

		if (delay) {
			jQuery($this).css("animation-delay", delay + "s");
			jQuery($this).css("-webkit-animation-delay", delay + "s");
		}
		if (iteration_count == "-1") {
			jQuery($this).css("animation-iteration-count", "infinite");
		} else if (iteration_count > 0) {
			jQuery($this).css("animation-iteration-count", iteration_count);
		}

	}

	var qfy_animateEvent_start = function () {
		var el = document.createElement('div');
		var map = {
			animation: 'animationstart',
			MozAnimation: 'animationstart',
			WebkitAnimation: 'webkitAnimationStart'
		};

		for (var name in map) {
			if (el.style[name] !== undefined) {
				return map[name];
			}
		}
	}();
	var qfy_animateEvent_end = function () {
		var el = document.createElement('div');
		var map = {
			animation: 'animationend',
			MozAnimation: 'animationend',
			WebkitAnimation: 'webkitAnimationEnd'
		};

		for (var name in map) {
			if (el.style[name] !== undefined) {
				return map[name];
			}
		}
	}();

	function qfy_animate_out($this) {
		var outs = new Array("qfe_ttbout", "qfe_ttbout-1", "qfe_ttbout-2", "qfe_bttout", "qfe_bttout-1", "qfe_bttout-2", "qfe_ltrout", "qfe_ltrout-1", "qfe_ltrout-2", "qfe_rtlout", "qfe_rtlout-1", "qfe_rtlout-2", "SlideOutDown", "SlideOutLeft", "SlideOutRight", "popOut", "popOutUp", "popOutDown", "popOutLeft", "popOutRight", "fadeOut", "fadeOutUp", "fadeOutDown", "fadeOutLeft", "fadeOutRight", "zoomOut", "zoomOutUp", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "flipOutX", "flipOutY", "hinge", "rotateOut");
		jQuery($this)[0].addEventListener(qfy_animateEvent_end, function (e) {
			if (jQuery.inArray(e.animationName, outs) > -1) {
				jQuery($this).addClass("anihide");
			}
		}, false);
	}

	function vc_waypoints() {

		if (typeof resetSectionHeight !== 'undefined') resetSectionHeight();
		if (typeof jQuery.fn.waypoint !== 'undefined') {
			jQuery('.qfe_animate_when_almost_visible:not(.qsa)').waypoint(function () {
				if (jQuery(this).hasClass("qfe_tohide")) {
					if (!is_edit_model) {
						jQuery(this).closest(".qfy-element").addClass("anihide");
					}
					jQuery(this).addClass('qsa');

				} else {
					qfe_animate_fun(this);
					if (!is_edit_model) {
						qfy_animate_out(this);
					}
				}
			}, {offset: '85%'});

		}
		jQuery("[data-ani_c]").each(function () {

			var to = jQuery(this).attr("data-ani_c_element");
			var c_fun = function ($this) {
				if (jQuery($this).attr("data-ani_c") == "tohide") {
					if (!is_edit_model) {
						jQuery($this).addClass("anihide");
					}
					return;
				}
				jQuery($this).addClass("qfe_" + jQuery($this).attr("data-ani_c") + "_c");
				qfe_animate_fun_new($this, "c");
				jQuery($this).removeClass('qsa qsa_c qsa_h qsa_l');
				setTimeout(function () {
					jQuery($this).addClass("qsa_c").removeClass("anihide");
				}, 30);
			};
			var $this = this;
			if (to) {
				if (jQuery($this).parent().hasClass("bitWidgetFrame")) {
					jQuery('#' + to).click(function () {
						c_fun($this);

					});
				} else {
					jQuery('[qfyuuid="' + to + '"]').click(function () {
						c_fun($this);

					});
				}

			} else {
				jQuery(this).click(function () {
					c_fun($this);

				});
			}
			if (!is_edit_model) {
				qfy_animate_out($this);
			}
		});
		jQuery("[data-ani_h]").each(function () {
			var to = jQuery(this).attr("data-ani_h_element");
			var h_fun = function ($this) {
				if (jQuery($this).attr("data-ani_h") == "tohide") {
					if (!is_edit_model) {
						jQuery($this).addClass("anihide");
					}
					return;
				}
				jQuery($this).addClass("qfe_" + jQuery($this).attr("data-ani_h") + "_h");
				qfe_animate_fun_new($this, "h");
				jQuery($this).removeClass('qsa qsa_c qsa_h qsa_l');
				setTimeout(function () {
					jQuery($this).addClass("qsa_h").removeClass("anihide");
				}, 30);
			};
			var $this = this;
			if (to) {
				if (jQuery($this).parent().hasClass("bitWidgetFrame")) {
					jQuery('#' + to).mouseenter(function () {
						h_fun($this);

					});
				} else {
					jQuery('[qfyuuid="' + to + '"]').mouseenter(function () {
						h_fun($this);

					});
				}
			} else {
				jQuery(this).mouseenter(function () {
					h_fun($this);

				});
			}
			if (!is_edit_model) {
				qfy_animate_out($this);
			}
		});

		jQuery("[data-ani_l]").each(function () {
			var to = jQuery(this).attr("data-ani_l_element");
			var h_fun = function ($this) {
				if (jQuery($this).attr("data-ani_l") == "tohide") {
					if (!is_edit_model) {
						jQuery($this).addClass("anihide");
					}
					return;
				}
				jQuery($this).addClass("qfe_" + jQuery($this).attr("data-ani_l") + "_l");
				qfe_animate_fun_new($this, "l");
				jQuery($this).removeClass('qsa qsa_c qsa_h qsa_l');
				setTimeout(function () {
					jQuery($this).addClass("qsa_l").removeClass("anihide");
				}, 30);
			};
			var $this = this;
			if (to) {
				if (jQuery($this).parent().hasClass("bitWidgetFrame")) {
					jQuery('#' + to).mouseleave(function () {
						h_fun($this);

					});
				} else {
					jQuery('[qfyuuid="' + to + '"]').mouseleave(function (e) {
						h_fun($this);
					});
				}
			} else {
				jQuery(this).mouseleave(function (e) {
					h_fun($this);
				});
			}
			if (!is_edit_model) {
				qfy_animate_out($this);
			}
		});


	}
}

/*
 * Teaser grid: isotope
 * ----------------------------------------------------------
 */
if (typeof window['vc_teaserGrid'] !== 'function') {

	function vc_teaserGrid() {

		var layout_modes = {
			fitrows: 'fitRows',
			masonry: 'masonry'
		}
		if (jQuery(".list-style9").length > 0) {
			jQuery(".list-style9").each(function () {
				vc_isotope_init_load(jQuery(this).find(".vc-carousel-slideline-inner"));
			})

		}
		if (jQuery("body.compose-mode").length == 1) {
			jQuery(".vc-element .vc_ca_post_id a:not(.cate)").each(function () {
				if (!jQuery(this).hasClass("thickbox")) {
					var href = jQuery(this).attr("href");
					jQuery(this).removeAttr("href");
					var p = jQuery(this).closest(".vc_ca_post_id");
					jQuery(this).unbind("click").bind("click", function () {
						top.menuRedirect(href, p);
						return false;
					})
				}
			})

			if (top.jQuery && !top.jQuery("body").hasClass("caterole")) {
				jQuery(".content-wrapper .vc-element .vc_ca_post_id").mouseenter(function () {

					jQuery(this).css("outline", "2px dotted #5E87B0");
					if (jQuery(this).find(".vc_list_edit_button").length == 0) {
						if (jQuery(this).find(".blog-media .toEditor,#item_block .toEditor").length == 0) {
							jQuery(this).find(".blog-media,#item_block").append("<span class='toEditor' ><span class='edit e_copy' style='display:inline' onclick='toCopy(this)'>复制</span><span class='edit e_edit' style='display:inline' onclick='toVisit(this)'>打开</span><!--<span class='edit e_delete' style='display:inline' onclick='toDelete(this)'>删除</span>--></span>");
						}
						if (jQuery(this).closest(".vc-element").attr("data-model-id")) {
							var editname = "更换图片";
							if (jQuery(this).closest(".qfy-element").attr("data-post") == "attachment") {
								editname = "编辑";
							}
							jQuery(this).find(".blog-media").append("<span class='vc_list_edit_button vc_list_edit_action' style='display:inline;'><span style='display:inline;' onclick='toEditor(this,event)'>" + editname + "</span><span style='display:inline;' onclick='parent.toeditlistmore(this,event,\"vc_scrolllist_image_element\")' title='修改样式，格式'>设置</span>");
							jQuery(this).find(".item_img").append("<span class='vc_list_edit_button vc_list_edit_action' style='display:inline;'><span style='display:inline;' onclick='toEditor(this,event)'>" + editname + "</span><span style='display:inline;' onclick='parent.toeditlistmore(this,event,\"vc_advanced_image_element\")' title='修改样式，格式'>设置</span>");
							var p = jQuery(this);
							if (p.find(".post-title").length > 0 && p.find(".post-title .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_title_element\')" title="修改样式，格式"></span>';
								var title = p.find(".post-title");

								if (p.find(".post-title >a").length > 0) {
									var title = jQuery(this).find(".post-title >a");
									if (title.html() && title.html().length > 15) {
										var newtitle = title.html().substr(0, title.html().length - 6);
										title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
									}
									p.find(".post-title >a:first").append(actionstr);
								} else {
									var title = jQuery(this).find(".post-title >span:first");
									if (title.html() && title.html().length > 15) {
										var newtitle = title.html().substr(0, title.html().length - 6);
										title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
									}
									p.find(".post-title >span:first").append(actionstr);
								}
							}
							if (p.find(".post_excerpt").length > 0 && p.find(".post_excerpt .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_text_element\')" title="修改样式，格式"></span>';
								if (p.find(".post_excerpt >p").length > 0) {
									p.find(".post_excerpt >p").append(actionstr);
								} else {
									p.find(".post_excerpt").append(actionstr);
								}

							}

							if (jQuery(this).find(".title").length > 0 && jQuery(this).find(".title .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_title_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".title").append(actionstr);

							}
							if (jQuery(this).find(".details").length > 0 && jQuery(this).find(".details .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_details_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".details").append(actionstr);

							}
							if (jQuery(this).find(".subtitle").length > 0 && jQuery(this).find(".subtitle .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_subtitle_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".subtitle").append(actionstr);

							}

							if (jQuery(this).find(".post_date").length > 0 && jQuery(this).find(".post_date .vc_list_edit_action").length == 0) {
								var actionstr = '<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_postdate_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".post_date").append(actionstr);

							}

							if (jQuery(this).find(".price_warp").length > 0 && jQuery(this).find(".price_warp .vc_list_edit_action").length == 0) {
								var current_pid = jQuery(this).attr("data-postid");
								var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.bitSettingsEdit(' + current_pid + ',\'设置商品\', \'product\');" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_advanced_list_price_element\')" title="修改样式，格式"></span>';
								jQuery(this).find(".price_warp").append(actionstr);

							}
						}
					}
				}).mouseleave(function () {
					jQuery(this).css("outline", "0").find(".vc_list_edit_action").remove();
					jQuery(this).find(".blog-media,#item_block").find(".toEditor").remove();
					jQuery(this).find(".edittitle").remove();
					jQuery(this).find(".hidetitle").each(function () {
						var t = jQuery(this).html();
						jQuery(this).parent().html(t);
					})
				});

				if (jQuery(".product-content.single-product").length == 0) {
					jQuery(".bitcommerce-main-image,.wd_product_wrapper .product_a").mouseenter(function () {
						jQuery(this).removeAttr("href").append("<span class='toEditor' style='right:0;width:100px;'><span class='edit' style='display:inline' onclick='toEditProduct(this)'><i class='glyphicon glyphicon-edit'></i>数据</span><span style='display:inline' class='delete' onclick='toRedirectProduct(this)'><i class='glyphicon glyphicon-forward'></i>页面</span></span>");
					}).mouseleave(function () {
						jQuery(this).find(".toEditor").remove();
					});
				}
			}
			jQuery('.content-wrapper .qfy-listcatecontrols li').each(function () {
				var $li = jQuery(this);
				$li.mouseenter(function () {
					jQuery(this).css("outline", "1px dotted #5E87B0");
					if (jQuery(this).find(".toEditor").length == 0) {
						jQuery(this).append("<span class='toEditor' style='border:0;padding:0;'><span  style='display:inline;border:0;padding:0;background:transparent;' onclick='toDeleteCate(this)'><img src='//f.goodq.top/FeiEditor/bitSite/images/close_hover.png' /></span>");
					}
				}).mouseleave(function () {
					jQuery(this).css("outline", "0");
					jQuery(this).find(".toEditor").remove();
				});

			});
		}


		jQuery('.qfe_grid .teaser_grid_container:not(.qfe_carousel), .qfe_filtered_grid .teaser_grid_container:not(.qfe_carousel)').each(function () {
			var $container = jQuery(this);

			var $thumbs = $container.find('.qfe_thumbnails');
			var layout_mode = $thumbs.attr('data-layout-mode');

			// ..
			if (jQuery("body.compose-mode").length == 1) {
				var p = $container.closest(".qfy-element");
				var iscontent = $container.closest(".content-wrapper");
				// && $thumbs.closest(".vc-element").length>0
				if (self!=top && typeof top.jQuery=="function" && !top.jQuery("body").hasClass("caterole")) {
					$thumbs.find(".isotope-item").mouseenter(function () {
						if (iscontent.length == 0) return;
						jQuery(this).css("outline", "2px dotted #5E87B0");
						if (jQuery(this).find(".vc_list_edit_button").length == 0) {
							var editor_html = "<span class='toEditor' ><span class='edit e_set' style='display:inline' onclick='parent.toeditlistmore(this,event,\"vc_list_element_ui\");'>设置</span><span class='edit e_copy' style='display:inline' onclick='toCopy(this)'>复制</span><span class='edit e_edit' style='display:inline' onclick='toVisit(this)'>打开</span><!--<span class='edit e_delete' style='display:inline' onclick='toDelete(this)'>删除</span>--></span>"

							jQuery(this).append(editor_html);
							// <span class='edit' style='display:inline'
							// onclick='toEditor(this)'><i class='glyphicon
							// glyphicon-edit'></i>编辑</span>
							if ($container.closest(".vc-element").attr("data-model-id")) {
								jQuery(this).find(".post-thumb").css("position", "relative");
								var editname = "更换图片";
								if (jQuery(this).closest(".qfy-element").attr("data-post") == "attachment") {
									editname = "编辑";
								}
								jQuery(this).find(".post-thumb").append("<span class='vc_list_edit_button vc_list_edit_action' style='display:inline;'><span style='display:inline;' onclick='toEditor(this,event)'>" + editname + "</span><span style='display:inline;' onclick='parent.toeditlistmore(this,event,\"vc_list_image_element\")' title='修改样式，格式'>设置</span>");
								if (jQuery(this).find(".post-title").length > 0 && jQuery(this).find(".post-title .vc_list_edit_action").length == 0) {
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;" onclick="parent.toeditlistmore(this,event,\'vc_list_title_element\')" title="修改样式，格式"></span>';
									if (jQuery(this).find(".post-title >a").length > 0) {
										var title = jQuery(this).find(".post-title >a");
										if (title.html() && title.html().length > 15) {
											var newtitle = title.html().substr(0, title.html().length - 6);
											title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
										}
										jQuery(this).find(".post-title >a:first").append(actionstr);
									} else {
										var title = jQuery(this).find(".post-title >span:first");
										if (title.html() && title.html().length > 15) {
											var newtitle = title.html().substr(0, title.html().length - 6);
											title.html("<span class='hidetitle' style='display:none'>" + title.html() + "</span><span class='edittitle' >" + newtitle + "</span>")
										}
										jQuery(this).find(".post-title >span:first").append(actionstr);

									}
									if (jQuery(this).find(".post-title i.glyphicon").length > 0) {
										jQuery(this).find(".post-title i.glyphicon").append('<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_icon_element\')" title="修改样式，格式"></span>');
									}
								}


								if (jQuery(this).find(".post_excerpt").length > 0) {
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;" onclick="toEditor(this,event)" title="编辑内容"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_text_element\')" title="修改内容样式，格式"></span>';
									if (jQuery(this).find(".post_excerpt >p").length > 0 && jQuery(this).find(".post_excerpt .vc_list_edit_action").length == 0) {
										jQuery(this).find(".post_excerpt >p").append(actionstr);
									} else {
										jQuery(this).find(".post_excerpt").append(actionstr);
									}
								}
								if (jQuery(this).find(".subtitle").length > 0 && jQuery(this).find(".subtitle .vc_list_edit_action").length == 0) {
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;" onclick="toEditor(this,event)" title="编辑内容"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_list_subtitle_element\')" title="修改样式，格式"></span>';
									jQuery(this).find(".subtitle").append(actionstr);

								}
								if (jQuery(this).find(".price_warp").length > 0 && jQuery(this).find(".price_warp .vc_list_edit_action").length == 0) {
									var current_pid = jQuery(this).attr("data-postid");
									var actionstr = '<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.bitSettingsEdit(' + current_pid + ',\'设置商品\', \'product\');" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;display:inline;z-index:2;position:relative;" onclick="parent.toeditlistmore(this,event,\'vc_list_price_element\')" title="修改样式，格式"></span>';
									jQuery(this).find(".price_warp").append(actionstr);

								}
								if (jQuery(this).find(".post-comment").length > 0 && jQuery(this).find(".post-comment .vc_list_edit_action").length == 0) {
									jQuery(this).find(".post-comment").append('<span class="fa fa-pencil vc_list_edit_action"  style="margin-left:10px;display:inline;" onclick="toEditor(this,event)" title="编辑"></span><span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_comment_element\')" title="修改样式，格式"></span>');
								}
								if (jQuery(this).find(".vc_read_more").length > 0 && jQuery(this).find(".vc_read_more .vc_list_edit_action").length == 0) {
									jQuery(this).find(".vc_read_more").append('<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_readmore_element\')" title="修改样式，格式"></span>');
								}
							}

						}
					}).mouseleave(function () {
						jQuery(this).css("outline", "0");
						jQuery(this).find(".toEditor,.vc_list_edit_action").remove();
						jQuery(this).find(".edittitle").remove();
						jQuery(this).find(".hidetitle").each(function () {
							var t = jQuery(this).html();
							jQuery(this).parent().html(t);
						})

					});


					if (p.find(".mypages").length > 0) {
						p.find(".mypages").mouseenter(function () {
							if (p.find(".mypages .vc_list_edit_action").length == 0) {
								p.find(".mypages").append('<span class="fa fa-cog vc_list_edit_action" style="margin-left:10px;" onclick="parent.toeditlistmore(this,event,\'vc_list_pagenav_element\')" title="修改样式，格式"></span>');
							}
						}).mouseleave(function () {
							p.find(".vc_list_edit_action").remove();
						});

					}

				}
				$thumbs.find("a:not(.cate)").each(function () {
					if (!jQuery(this).hasClass("thickbox")) {
						var href = jQuery(this).attr("href");
						jQuery(this).removeAttr("href");
						var p = jQuery(this).closest(".isotope-item");
						jQuery(this).unbind("click").bind("click", function () {
							top.menuRedirect(href, p);
							return false;
						})
					}
				})
			}

			$container.find('.categories_filter a:not(.link)').data('isotope', $thumbs).click(function (e) {
				e.preventDefault();
				var $thumbs = jQuery(this).data('isotope');
				jQuery(this).parent().parent().find('.active').removeClass('active');
				jQuery(this).parent().addClass('active');
				if (!$container.hasClass("noanimale")) {
					$thumbs.isotope({
						filter: jQuery(this).attr('data-filter'),
						itemSelector: '.isotope-item',
						layoutMode: 'fitRows'
					});
				} else {
					var filter = jQuery(this).data('filter');
					if (filter == "*") {
						$thumbs.find(">li").show();
					} else {
						$thumbs.find(">li").hide();
						$thumbs.find(filter).show();
					}
				}

			});
			if (!jQuery(this).hasClass("noanimale")) {
				vc_isotope_init_load($thumbs);
			}

		});
	}


}

function vc_isotope_init_load(obj) {

	if (obj.find('.post-thumb img,.item_img img').length == 0) {
		obj.isotope({
			filter: '*',
			itemSelector: '.isotope-item',
			layoutMode: obj.attr("data-layout-mode") ? obj.attr("data-layout-mode") : 'fitRows'
		});
		obj.parent().find(".isotope_loading").remove();
		return;
	}
	var all_load = true;

	obj.find('.post-thumb img,.post-thumb video,.item_img img').each(function () {
		if (!jQuery(this).prop('complete')) {
			all_load = false;
		}
	});

	if (!all_load) {
		window.setTimeout(function () {
			vc_isotope_init_load(obj);
		}, 500);
		return;
	}
	obj.isotope({
		filter: '*',
		itemSelector: '.isotope-item',
		layoutMode: obj.attr("data-layout-mode") ? obj.attr("data-layout-mode") : 'fitRows'
	},function(){
		obj.parent().find(".isotope_loading").remove();
	});

}

if (typeof window['vc_carouselBehaviour'] !== 'function') {
	function vc_carouselBehaviour() {
		jQuery(".qfe_carousel").each(function () {
			var $this = jQuery(this);
			if ($this.data('carousel_enabled') !== true && $this.is(':visible')) {
				$this.data('carousel_enabled', true);
				var carousel_width = jQuery(this).width(),
					visible_count = getColumnsCount(jQuery(this)),
					carousel_speed = 500;
				if (jQuery(this).hasClass('columns_count_1')) {
					carousel_speed = 900;
				}
				var carousele_li = jQuery(this).find('.qfe_thumbnails-fluid li');
				carousele_li.css({"margin-right": carousele_li.css("margin-left"), "margin-left": 0});

				jQuery(this).find('.qfe_wrapper:eq(0)').jCarouselLite({
					btnNext: jQuery(this).find('.next'),
					btnPrev: jQuery(this).find('.prev'),
					visible: visible_count,
					speed: carousel_speed
				})
					.width('100%');// carousel_width

				var fluid_ul = jQuery(this).find('ul.qfe_thumbnails-fluid');
				fluid_ul.width(fluid_ul.width() + 300);

				jQuery(window).resize(function () {
					var before_resize = screen_size;
					screen_size = getSizeName();
					if (before_resize != screen_size) {
						window.setTimeout('location.reload()', 20);
					}
				});
			}

		});
	}
}

if (typeof window['vc_slidersBehaviour'] !== 'function') {
	function vc_slidersBehaviour() {
		// var sliders_count = 0;
		jQuery('.qfe_gallery_slides').each(function (index) {
			var this_element = jQuery(this);
			var ss_count = 0;
			if (this_element.hasClass('qfe_slider_nivo')) {
				var sliderSpeed = 800,
					sliderTimeout = this_element.attr('data-interval') * 1000;

				if (sliderTimeout == 0) sliderTimeout = 9999999999;
				this_element.find('.nivoSlider').nivoSlider({
					effect: 'boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse', // Specify
					// sets
					// like:
					// 'fold,fade,sliceDown'
					slices: 15, // For slice animations
					boxCols: 8, // For box animations
					boxRows: 4, // For box animations
					animSpeed: sliderSpeed, // Slide transition speed
					pauseTime: sliderTimeout, // How long each slide will show
					startSlide: 0, // Set starting Slide (0 index)
					directionNav: true, // Next & Prev navigation
					directionNavHide: true, // Only show on hover
					controlNav: true, // 1,2,3... navigation
					keyboardNav: false, // Use left & right arrows
					pauseOnHover: true, // Stop animation while hovering
					manualAdvance: false, // Force manual transitions
					prevText: 'Prev', // Prev directionNav text
					nextText: 'Next' // Next directionNav text
				});
			} else if (this_element.hasClass('qfe_image_grid')) {
				var isotope = this_element.find('.qfe_image_grid_ul');
				isotope.isotope({
					// options
					itemSelector: '.isotope-item',
					layoutMode: 'fitRows'
				});
				jQuery(window).load(function () {
					isotope.isotope("reLayout");
				});
			}
		});
	}
}

function getColumnsCount(el) {
	var find = false,
		i = 1;

	while (find == false) {
		if (el.hasClass('columns_count_' + i)) {
			find = true;
			return i;
		}
		i++;
	}
}

var screen_size = getSizeName();

function getSizeName() {
	var screen_size = '',
		screen_w = jQuery(window).width();

	if (screen_w > 1170) {
		screen_size = "desktop_wide";
	} else if (screen_w > 960 && screen_w < 1169) {
		screen_size = "desktop";
	} else if (screen_w > 768 && screen_w < 959) {
		screen_size = "tablet";
	} else if (screen_w > 300 && screen_w < 767) {
		screen_size = "mobile";
	} else if (screen_w < 300) {
		screen_size = "mobile_portrait";
	}
	return screen_size;
}

function loadScript(url, $obj, callback) {
	var script = document.createElement("script")
	script.type = "text/javascript";

	if (script.readyState) {  // IE
		script.onreadystatechange = function () {
			if (script.readyState == "loaded" ||
				script.readyState == "complete") {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {
	}

	script.src = url;
	$obj.get(0).appendChild(script);
}
function qfe_prepare_tab_content(event, ui) {
	var panel = ui.panel || ui.newPanel;
	vc_carouselBehaviour();
	var $ui_panel = jQuery(panel).find('.isotope'),
		$google_maps = jQuery(panel).find('.qfe_gmaps_widget');
	if ($ui_panel.length > 0) {
		$ui_panel.isotope("reLayout");
	}

	if ($google_maps.length && !$google_maps.is('.map_ready')) {
		var $frame = $google_maps.find('iframe');
		$frame.attr('src', $frame.attr('src'));
		$google_maps.addClass('map_ready');
	}
}

jQuery(window).resize(function () {
	bitResizeImageTextInit();
});
jQuery(window).ready(function () {
	setTimeout(function () {
		bitResizeImageTextInit();
	}, 300);
});

function bitResizeImageTextInit() {

	jQuery(".bitImageControlDiv .bit-tp-caption.wf-mobile-hidden").each(function () {

		var dataorgipara = jQuery(this).attr("dataorgipara");
		if (dataorgipara) {
			var $this = this;
			var p = jQuery(this).parent().parent();
			var img = p.find(".bitImageParentDiv img");
			if (img.length > 0) {
				var imgW = img.width();
				var imgH = img.height();
			} else {
				var imgW = p.find(".bitImageParentDiv .banner-img").width();
				var imgH = p.find(".bitImageParentDiv .banner-img").height();
			}
			var download = new Image();
			download.src = img.attr("src");
			if (imgW > 760) {
				initTextposition(dataorgipara, imgW, imgH, this);
			} else {
				/*
				 * download.onload = function () {
				 * initTextposition(dataorgipara,imgW,imgH,$this); }
				 * download.onerror = function (err, msg) {
				 * initTextposition(dataorgipara,imgW,imgH,$this); }
				 */
			}
		}
	})
}

function initTextposition(dataorgipara, imgW, imgH, obj) {
	dataorgipara = dataorgipara.split("\|");
	var textOrgLeft = dataorgipara[0];
	var textOrgTop = dataorgipara[1];
	var width = dataorgipara[2];
	var s = dataorgipara[3];
	var textOrgRight = dataorgipara[4];
	var textOrgBottom = dataorgipara[5];
	if (imgW != width && imgW > 0) {

		var n = (width / imgW).toFixed(4);

		// if(s/n<10){n=s/10;}
		jQuery(obj).css("font-size", s / n).css("line-height", "auto").css("min-height", "0").css("min-width", "0");
		jQuery(obj).find("slideText").css("line-height", "auto");
		var textW = jQuery(obj).width();
		var textH = jQuery(obj).height();
		var paddingLeft = jQuery(obj).css("padding-left");
		if (paddingLeft && paddingLeft.indexOf("px")) {
			paddingLeft = paddingLeft.replace("px", "")
		}
		;
		var paddingTop = jQuery(obj).css("padding-top");
		if (paddingTop && paddingTop.indexOf("px")) {
			paddingTop = paddingTop.replace("px", "")
		}
		;
		var s = jQuery(obj).css("left");
		if (textOrgLeft != 0) {
			if (s.indexOf("px") > -1) {
				s = s.replace("px", "");
				jQuery(obj).css("left", textOrgLeft * imgW - textW / 2 - paddingLeft);
			}
		}
		if (textOrgRight == 1) {
			jQuery(obj).css("right", "0").css("left", "auto");
		}
		var s = jQuery(obj).css("top");

		if (textOrgTop != 0) {
			if (s.indexOf("px") > -1) {
				s = s.replace("px", "");
				jQuery(obj).css("top", textOrgTop * imgH - textH / 2 - paddingTop);
			}
		}
		if (textOrgBottom == 1) {
			jQuery(obj).css("bottom", "0").css("top", "auto");
		}

	} else {

		var css = jQuery(obj).attr("style");
		if (css) {
			css = css.replace(/font-size[^p]*px;/, "");
			css = css.replace(/right: 0px/, "");
			css = css.replace(/bottom: 0px/, "");
			css = css.replace(/line-height[^;]*;/, "");
			jQuery(obj).attr("style", css);
			var left = jQuery(obj).attr("dataleft");
			jQuery(obj).css("left", left + "px");
			var top = jQuery(obj).attr("datatop");
			jQuery(obj).css("top", top + "px");
		}
	}
	jQuery(obj).addClass("on").show();

}


