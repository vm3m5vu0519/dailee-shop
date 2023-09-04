/*
 * iPhorm BitWebcms jQuery plugin
 */
function phone_num_timer(label,label_text){
		var num =label.text();
		if(num*1<2){
			label.html(label_text);
		}
		setTimeout(function(){
			if(label.text()!=label_text){
				num = num*1 -1;
				label.text(num);
				phone_num_timer(label,label_text);
			}
		},1000);
}
function get_iphorm_phone(obj,e){
	var $form = jQuery(obj).closest("form");
	var $element =  jQuery(obj).closest(".iphorm-element-wrap");
	var $pre_element =  jQuery(obj).closest(".iphorm-element-wrap").prev();
	var phone = $pre_element.find("input").val();
	var phoneid = $pre_element.find("input").attr("name");
	$element.find("[name='iphorm_sms_phone_id']").val(phoneid);
	phone = jQuery.trim(phone);
	//if(!phone) return;

	var label = jQuery(obj).closest(".iphorm-input-wrap").find(".iphorm_phone_label");
	var info =  jQuery(obj).losest(".iphorm-input-wrap").find(".iphorm_phone_info").html();
	label.width(label.width());
	var label_text = label.text();
	if(label_text>1) return;
	label.html("30");
	phone_num_timer(label,label_text);
	$('.iphorm-errors-wrap', $element).html("");
	$('.iphorm-errors-wrap', $pre_element).html("");
	jQuery.post("/admin/admin-ajax.php",{"action":"tosendsms","phone":phone},function(response){
		if(response!="success"){
			label.html(label_text);
			if(phone){
				$error = '<div class="iphorm-errors-list iphorm-clearfix"><div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>'+response+'</div></div>';
				$('.iphorm-errors-wrap', $element).html($error).fadeIn(1000).show();
			}else{
				$error = '<div class="iphorm-errors-list iphorm-clearfix"><div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>'+response+'</div></div>';
				$('.iphorm-errors-wrap', $pre_element).html($error).fadeIn(1000).show();
			}
		}else{
			top.qfy_popinfo_fun('<div style="text-align:center;" ><div style="padding:20px;">'+info+'</div></div>',3);
		}
	});

}
;(function($) {
	$.iPhorm = function ($form, options) {
		var _this = this,
		settings = {},
		extraData = {
			iphorm_ajax: 1
		},
		submitted = false,
		uploaders = [],
		uploadQueue = [],
		swfUploadError = false,
		supportsSwfUpload = typeof swfobject === 'object'  && swfobject.hasFlashPlayerVersion('9.0.28'),
		$successMessage = $('.iphorm-success-message', $form),
		$errorMessage = $('.iphorm-error-message', $form),
		$loadingSpinner = $('.iphorm-loading-wrap', $form);

		$pop = $('.popaction', $form);
		// Expose the form to the outside world
		_this.$form = $form;

		// Load in any options
		if (options) {
			$.extend(settings, options);
		}

		/**
		 * Add an SWFUpload element to the form
		 *
		 * @param object element JavaScript object containing the element information
		 */
		_this.addUploader = function (element) {
			if (supportsSwfUpload) {
				// Hide the normal file element
				$('.' + element.name + '-input-wrap', $form).hide();
				$('.' + element.name + '-add-another-upload', $form).hide();

				// Show the SWFUpload element
				$('#' + element.uniqueId + '-swfupload').show();

				var $queue = $('#' + element.uniqueId + '-file-queue'),
                $queueErrors = $('#' + element.uniqueId + '-file-queue-errors'),
                browseButton = getHiddenDimensions($('#' + element.uniqueId + '-browse')), swfu;

				// Define SWFUpload handles
				function fileDialogStart () {
					$queueErrors.hide().empty();
				}

				function fileQueued (file) {
					var $close = $('<div class="iphorm-upload-queue-remove">X</div>').click(function () {
                        swfu.cancelUpload(file.id);
                        for (var i = 0; i < uploadQueue.length; i++) {
                            if (uploadQueue[i].file.id == file.id) {
                                uploadQueue.splice(i, 1);
                            }
                        }
                        $(this).parent().remove();

                        if ($queue.children().length == 0) {
                        	$queue.hide();
                        }
                    });

                    uploadQueue.push({
                        file: file,
                        uploaderId: swfu.movieName
                    });

                    $queue.append($('<div id="' + file.id + '" class="iphorm-upload-queue-file"><div class="iphorm-upload-queue-filename">' + file.name + ' (' + formatFileSize(file.size) + ')</div></div>').append($close)).show();
				}

				function fileQueueError (file, errorCode, message) {
					$queueErrorsList = $('<div class="iphorm-queue-errors-list iphorm-clearfix"></div>');

					switch (errorCode) {
	                    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
	                    	$queueErrorsList.append('<div class="iphorm-queue-error">' + iphormL10n.swfupload_too_many + '</div>');
	                        break;
	                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
	                    	$queueErrorsList.append('<div class="iphorm-queue-error">' + file.name + ' - ' + iphormL10n.swfupload_file_too_big + '</div>');
	                        break;
	                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
	                    	$queueErrorsList.append('<div class="iphorm-queue-error">' + file.name + ' - ' + iphormL10n.swfupload_file_empty + '</div>');
	                        break;
	                    case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
	                    	$queueErrorsList.append('<div class="iphorm-queue-error">' + file.name + ' - ' + iphormL10n.swfupload_file_type_not_allowed + '</div>');
	                        break;
	                    default:
	                    	$queueErrorsList.append('<div class="iphorm-queue-error">' + iphormL10n.swfupload_unknown_queue_error + '</div>');
	                        break;
	                }

					$queueErrors.append($queueErrorsList).show();
				}

				function uploadStart(file) {
					// Show the upload progress bar
					$('.iphom-upload-progress-wrap').show();
				}

				function uploadProgress(file, bytesLoaded, bytesTotal) {
					var progress = Math.min(100, ((bytesLoaded / file.size) * 100)); // Limit to 100% maximum
					$('.iphorm-upload-progress-bar').css('width', progress + '%');
					$('.iphorm-upload-filename').text(file.name);
				}

				function uploadError(file, errorCode, message) {
					switch (errorCode) {
						case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_upload_error).show();
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_upload_failed).show();
							break;
						case SWFUpload.UPLOAD_ERROR.IO_ERROR:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_server_io).show();
							break;
						case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_security_error).show();
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_limit_exceeded).show();
							break;
						case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_validation_failed).show();
							break;
						case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
							break;
						case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_upload_stopped).show();
							break;
						default:
							swfUploadError = true;
							$('.iphorm-upload-error', $form).text(iphormL10n.swfupload_unknown_upload_error).show();
							break;
					}
				}

				function uploadSuccess(file, response) {
					if (response) {
						var response = $.parseJSON(response);

						if (typeof response == 'object' && response.type == 'error') {
						    swfUploadError = true;
						    $('.iphorm-upload-error', $form).text(file.name + ' - ' + response.data[0]).show();
							$('#' + file.id, $form).remove();
						}
					}
				}

				function uploadComplete(file) {
					if (!swfUploadError) {
						// Show the file as uploaded successfully
						$('#' + file.id, $form).find('.iphorm-upload-queue-remove').removeClass('iphorm-upload-queue-remove').addClass('iphorm-upload-queue-success').unbind('click');

						if (uploadQueue.length > 0) {
							var next = uploadQueue.shift();
							getUploader(next.uploaderId).startUpload(next.file.id);
						} else {
							// Nothing left in the queue so this time we submit the form
							$('.iphom-upload-progress-wrap').hide();
							_this.submit();
						}
					} else {
						// Hide the loading spinner
						$loadingSpinner.hide();
						resetSWFUpload();
						submitted = false;
					}
				}

				swfu = new SWFUpload({
					button_height: browseButton.outerHeight,
                    button_width: browseButton.outerWidth,
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    button_placeholder_id: element.uniqueId + '-object',
                    button_cursor: SWFUpload.CURSOR.HAND,

                    flash_url: iphormL10n.swfupload_flash_url,
                    upload_url: iphormL10n.swfupload_upload_url,
                    file_post_name: element.name,

                    file_dialog_start_handler: fileDialogStart,
                    file_queued_handler: fileQueued,
    				file_queue_error_handler: fileQueueError,
    				upload_start_handler: uploadStart,
    				upload_progress_handler: uploadProgress,
    				upload_error_handler: uploadError,
    				upload_success_handler: uploadSuccess,
    				upload_complete_handler: uploadComplete,

                    post_params: {
                        iphorm_id: settings.id,
                        iphorm_form_uniq_id: settings.uniqueId,
                        iphorm_element_id: element.id,
                        iphorm_element_name: element.name,
                        PHPSESSID: settings.PHPSESSID
                    },

                    prevent_swf_caching: true,

                    file_types : element.fileTypes,
                    file_types_description: element.fileTypesDescription,
                    file_size_limit : element.fileSizeLimit,
                    file_upload_limit : element.fileUploadLimit,

                    debug: false
				});

				uploaders.push(swfu);
			}
		}; // End addUploader

		/**
		 * Bind to the submit event of the form
		 */
		if (settings.useAjax) {
			$form.bind('submit', function(event) {

				// Can't submit during preview
				if (settings.preview === true) {
					jAlert(iphormL10n.preview_no_submit);
					return false;
				}
				// Prevent double submit
				if (submitted) {
					return false;
				} else {
					submitted = true;
				}
				if(typeof custom_iphorm_before_fun =="function"){
					var $rlt = custom_iphorm_before_fun($form);
					if(!$rlt){
						submitted = false;
						return false;
					}
				}
				// Show loading image
				$loadingSpinner.fadeIn('slow');

				// Prevent the browser submitting the form normally
				event.preventDefault();

				// Remove any previous upload error
				$('.iphorm-upload-error', $form).hide().text('');
				var isrequired = false;
				$('.iphorm-errors-wrap', $form).hide().text('');
				var iphorm_str = ".iphorm-required:visible";
				if($form.attr("data-check") == "1"){
					iphorm_str = ".iphorm-required";
				}

				$(iphorm_str,$form).each(function(){
					  var p = $(this).closest(".iphorm-element-wrap");
					 if(p.find(".iphorm-element-radio").length>0 && p.find(".iphorm-element-radio:checked").length==0){
						    $error = '<div class="iphorm-errors-list iphorm-clearfix"><div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>'+iphormL10n.iphorm_required+'</div></div>';
							$('.iphorm-errors-wrap', p).html($error).fadeIn(1000).show();
							isrequired = true;
					 }else if(p.find(".iphorm-element-checkbox").length>0 && p.find(".iphorm-element-checkbox:checked").length==0){
						    $error = '<div class="iphorm-errors-list iphorm-clearfix"><div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>'+iphormL10n.iphorm_required+'</div></div>';
							$('.iphorm-errors-wrap', p).html($error).fadeIn(1000).show();
							isrequired = true;
					  }else if(p.find("input,select,textarea").val()==""){
						     $error = '<div class="iphorm-errors-list iphorm-clearfix"><div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>'+iphormL10n.iphorm_required+'</div></div>';
							$('.iphorm-errors-wrap', p).html($error).fadeIn(1000).show();
							isrequired = true;
					  }else  if(p.find("[data-toggle='distpicker']").length>0 &&  p.find("[data-toggle='distpicker'] select:last").val()==""){
						     $error = '<div class="iphorm-errors-list iphorm-clearfix"><div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>'+iphormL10n.iphorm_required+'</div></div>';
								$('.iphorm-errors-wrap', p).html($error).fadeIn(1000).show();
								isrequired = true;
					  }

				})
				//这里检查下required
				if(isrequired){
					$loadingSpinner.hide();
					submitted = false;
					if($form.attr("data-check") == "1"){
							if($form.find(".iphorm-errors-list:visible").length==0){
								var tostr = "";
								if(iPhorm.logic){
									$.each(iPhorm.logic,function(k,iphorm){
										$.each(iphorm.logic,function(kk,obj){
											var name="iphorm_"+k+"_"+kk;
											if( $("."+name+"-group-wrap").find(".iphorm-errors-list").length>0 ){
												if(obj.rules.length>0){
													if(obj.rules[0].operator=="eq"){
														if(tostr==""){
															tostr = "[name='iphorm_"+k+"_"+obj.rules[0].element_id+"'][value='"+obj.rules[0].value+"']";
														}

													}
												}
											}
										})
									})
								}
								if(tostr!=""){
									//two
									$(tostr).click();
									$(tostr).click();
								}
							}


					}
					return false;
				}



				// Detect if there are any SWFUpload files in the queue and upload them first
				if (uploadQueue.length > 0) {
					extraData.iphorm_swfu = 1;
					var next = uploadQueue.shift();
					getUploader(next.uploaderId).startUpload(next.file.id);
				} else {
					// There are no uploads in the queue, submit the form normally
					_this.submit();
				}
			}); // End bind
		} // if settings.useAjax

		/**
		 * Submits the form
		 */
		_this.submit = function () {

			 if(typeof jQuery.fn.ajaxSubmit=="undefined"){
				 jQuery.getScript( "/qfy-content/plugins/qfy_form/js/jquery.form.min.js",function(){
				 	if(_this.$form.find(".g-recaptcha-response").length>0 && grecaptcha){
						 _this.re_submit();
					}else{
						_this._submit();
					}
				 });
			 }else{
				 if(_this.$form.find(".g-recaptcha-response").length>0 && grecaptcha){
					 _this.re_submit();
				 }else if(_this.$form.find("[name='captcha-val-key']").length>0  ){
				 	 if(window.slidercatchar_is_robot=="no"){
						 _this._submit();
					 }else{
						 let captchaObj = [];
						 _this.$form.find('[name="captcha-val-key"]').each(function(i){
							 $loadingSpinner.hide();
							 let $this = $(this);
							 slidercaptcha_init($this,captchaObj,function(){
								 $loadingSpinner.show();
								 _this._submit();
							 },function(){
								 $loadingSpinner.hide();
								 submitted = false;
							 });
						 });
					 }


				 }else{
					 _this._submit();
				 }
			 }
		};
		_this.re_submit = function () {
			grecaptcha.ready(function() {
				let key = _this.$form.find(".g-recaptcha-response").attr("data-key");
				grecaptcha.execute(key, {action: 'submit'}).then(function(token) {
					_this.$form.find(".g-recaptcha-response").val(token);
					_this._submit();
				})
			})
		}
		_this._submit = function () {
			// Bind the form submit to use the ajax form plugin
			$form.ajaxSubmit({
				async: false,
				type: 'post',
				dataType: 'json',
				data: extraData,
				iframe: true,
				url: '',
				success: function(response) {

					// Reload the recaptcha, we can't use it twice
					if (typeof Recaptcha === 'object') {
					    try { // Catching errors due to conflict with another plugin
					        Recaptcha.reload();
					    } catch (e) {}
					}

					// Prepares the form to be submitted again
					var prepareForm = function () {
						// Hide the loading spinner
						$loadingSpinner.hide();

						// Hide any previous errors or success messages
						$('.iphorm-errors-wrap', $form).hide();
						$('.iphorm-errors-list, .iphorm-error', $form).remove();
						$('.iphorm-queue-errors', $form).hide().empty();
						$successMessage.hide();
						$errorMessage.hide();
						$('.iphorm-element-error', $form).removeClass('iphorm-element-error');

						// Allow the form to be submitted again
						submitted = false;
					};

					// Check if the form submission was successful
					if (response === null || response === undefined) {
						// Hide the loading spinner
						$loadingSpinner.hide();

						// Allow resubmitting
						submitted = false;

						jAlert(iphormL10n.error_submitting_form);
					} else if (typeof response === 'object') {

						if (response.type == 'success') {
							prepareForm();
							// Reset the captcha
							$('.iphorm-captcha-image', $form).trigger('click');

							// Reset the form
							$form.resetForm();

							// Call blur on element to reset inline labels
							$('input[type="text"], textarea', $form).blur();

							// Hide dynamically added file inputs
							$('.iphorm-add-another-file-wrap', $form).remove();

							// Reset conditional logic
							_this.applyAllLogic();

							// Sync uniform with underlying elements
							if (typeof $.uniform === 'object' && typeof $.uniform.update === 'function') {
								$.uniform.update();
							}

							// Reset SWF upload stats
							resetSWFUpload();

							// Hide any tooltips
							$('.qtip').hide();

							if (typeof response.redirect === 'string') {
							    if (response.redirect == '') {
							        window.location.reload();
							    } else {
							        window.location = response.redirect;
							    }
							} else {
								if(typeof custom_iphorm_success_fun =="function"){
									custom_iphorm_success_fun($form,response);
									return;
								}
								// Then fade in the success message
								if($pop.length >0 && $pop.val()==""){
									var success_htm = '<div style="text-align:center;" ><img class="qfy_pop_checkedimg" src="/FeiEditor/images/bitcms/check.png" style="margin-top:20px;margin-bottom:20px;" /><div style="padding-bottom:20px;">'+response.data+'</div></div>';
									qfy_popinfo_fun(success_htm,settings.successMessageTimeout*1/3);
								}else{
									$successMessage.html('<i class="fa fa-check-square" aria-hidden="true" style="padding-right:8px;"></i>'+response.data).fadeIn('slow').show(0, function() {
										// Set timeout
										if (settings.successMessageTimeout > 0) {
											setTimeout(function () {
												$successMessage.fadeOut(400);
											}, (settings.successMessageTimeout * 1000));
										}

										// Custom success callback
										if (typeof settings.success === 'function') {
											settings.success();
										}
									});
									if($successMessage.closest(".notice_content").length>0){
										$successMessage.closest(".notice_content").scrollTop(0);
									}
									// Scroll to the success message if it's not in view
									if (!isScrolledIntoView($successMessage) && $.isFunction($.smoothScroll)) {
										$.smoothScroll({
											scrollTarget: $successMessage,
											offset: -50,
											speed: 500
										});
									}
								}
							}
						} else if (response.type == 'error' || response.type == 'adminerror') {
							prepareForm();
							if(response.data && response.type == 'error'){
								var $errors = $();

								// Go through each element containing errors
								$.each(response.data, function(index, info) {
									// If there are errors for this element
									if (info.errors != undefined && info.errors.length > 0) {
										// Save a reference to this element
										var $elementWrap = $("." + index + "-element-wrap", $form),
										$errorsWrap = $elementWrap.find('.iphorm-errors-wrap');

										// If the returned element exists
										if ($elementWrap.length && $errorsWrap.length) {
											// Create a blank error list
											var $errorList = $('<div class="iphorm-errors-list iphorm-clearfix"></div>');

											// Go through each error for this field
											$.each(info.errors, function(i, e) {
												// Append the error to the list as a list item
												$errorList.append('<div class="iphorm-error"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="padding-right:5px;"></i>' + e + '</div>');
												return false; // Just display one error per element
											});

											$errors = $errors.add($elementWrap);

											// Add the error list after the element's wrapper
											$errorsWrap.append($errorList);

											// Add an error class to the element wrapper
											$elementWrap.addClass('iphorm-element-error');
										}
									}
								});

								// Fade all errors in
								$('.iphorm-errors-wrap', $form).fadeIn(1000).show();

								// Scroll to the first error
								if ($errors.size()) {
									var $targetError = $errors.get(0);

									if($form.closest(".notice_content").length>0){
										var first_error_top = $('.iphorm-errors-wrap .iphorm-error:first:visible', $form).closest(".iphorm-element-wrap").position().top;
										if(first_error_top)
											$form.closest(".notice_content").scrollTop(first_error_top);

									}
									if (!isScrolledIntoView($targetError) && $.isFunction($.smoothScroll)) {
										$.smoothScroll({
											scrollTarget: $targetError,
											offset: -50,
											speed: 700
										});
									}
								}
								// Custom error callback
								if (typeof settings.error === 'function') {
									settings.error();
								}
							}else{

								if(top!=self){
									$errorMessage.html("發送失敗，網站郵箱配置有異常，無法接受或者發送信息！").fadeIn('slow').show(0, function() {
										// Set timeout
										if (settings.successMessageTimeout > 0) {
											setTimeout(function () {
												$successMessage.fadeOut(400);
											}, (settings.successMessageTimeout * 1000));
										}

										// Custom success callback
										if (typeof settings.success === 'function') {
											settings.success();
										}
									});
								}else{
									prepareForm();
									// Reset the captcha
									$('.iphorm-captcha-image', $form).trigger('click');

									// Reset the form
									$form.resetForm();

									// Call blur on element to reset inline labels
									$('input[type="text"], textarea', $form).blur();

									// Hide dynamically added file inputs
									$('.iphorm-add-another-file-wrap', $form).remove();

									// Reset conditional logic
									_this.applyAllLogic();

									// Sync uniform with underlying elements
									if (typeof $.uniform === 'object' && typeof $.uniform.update === 'function') {
										$.uniform.update();
									}

									// Reset SWF upload stats
									resetSWFUpload();

									// Hide any tooltips
									$('.qtip').hide();

									if (typeof response.redirect === 'string') {
										if (response.redirect == '') {
											window.location.reload();
										} else {
											window.location = response.redirect;
										}
									} else {
										if($pop.length >0 && $pop.val()==""){
											var success_htm = '<div style="text-align:center;" ><img class="qfy_pop_checkedimg" src="/FeiEditor/images/bitcms/check.png" style="margin-top:20px;margin-bottom:20px;" /><div style="padding-bottom:20px;font-family:微软雅黑;">'+response.data+'</div></div>';
											qfy_popinfo_fun(success_htm,settings.successMessageTimeout*1/3);
										}else{
											// Then fade in the success message

											$successMessage.html('<i class="fa fa-check-square" aria-hidden="true" style="padding-right:8px;"></i>'+response.data).fadeIn('slow').show(0, function() {
												// Set timeout
												if (settings.successMessageTimeout > 0) {
													setTimeout(function () {
														$successMessage.fadeOut(400);
													}, (settings.successMessageTimeout * 1000));
												}

												// Custom success callback
												if (typeof settings.success === 'function') {
													settings.success();
												}
											});
											if($successMessage.closest(".notice_content").length>0){
												$successMessage.closest(".notice_content").scrollTop(0);
											}
											// Scroll to the success message if it's not in view
											if (!isScrolledIntoView($successMessage) && $.isFunction($.smoothScroll)) {

												$.smoothScroll({
													scrollTarget: $successMessage,
													offset: -50,
													speed: 500
												});
											}
										}
									}


								}
							}

						} // End reponse.type == error
					} // End typeof response == object
				}, // End success callback
				error: function () {
					// Hide the loading spinner
					$loadingSpinner.hide();

					// Allow resubmitting
					submitted = false;

					jAlert(iphormL10n.error_submitting_form);
				}
			}); // End ajaxSubmit()
		}; // End submit()

		/**
		 * Adds a datepicker to the element with the given unique ID
		 *
		 * @param string uniqueId
		 */
		_this.addDatepicker = function (uniqueId, options) {
            if ($.isFunction($.fn.datepicker)) {
                var $daySelect = $('#' + uniqueId + '_day'),
                $monthSelect = $('#' + uniqueId + '_month'),
                $yearSelect = $('#' + uniqueId + '_year'),
            	$datePicker = $('.iphorm-datepicker', '#' + uniqueId).datepicker($.extend({}, {
            		onSelect: function (dateText, inst) {
            		   $daySelect.val(inst.selectedDay);
            		   $monthSelect.val(inst.selectedMonth + 1);
            		   $yearSelect.val(inst.selectedYear);
            		   if (typeof $.uniform === 'object' && typeof $.uniform.update === 'function') {
                           $.uniform.update($daySelect.add($monthSelect).add($yearSelect));
                       }
                    },
                    beforeShow: function (input, inst) {
                        var currentTime = new Date(),
                        dayToSet = ($daySelect.val().length > 0) ? $daySelect.val() : currentTime.getDate(),
                        monthToSet = ($monthSelect.val().length > 0) ? $monthSelect.val()-1 : currentTime.getMonth(),
                        yearToSet = ($yearSelect.val().length > 0) ? $yearSelect.val() : currentTime.getFullYear();

                    	$datePicker.datepicker('setDate', new Date(yearToSet, monthToSet, dayToSet));
                    }}, options)
                );

                $('.iphorm-datepicker-icon', '#' + uniqueId).click(function () {
                    $datePicker.datepicker('show');
                }).show();
            }
		};

		/**
		 * Applies the the logic to all elements
		 *
		 * If loading is true, bind the logic triggers and do not animate the logic
		 *
		 * @param boolean loading
		 */
		_this.applyAllLogic = function (loading) {
			_this.applyLogic(settings.clElementIds, loading);

			if (loading) {
				_this.applyDependentLogic(settings.clDependentElementIds);
			}
		};

		/**
		 * Applies logic to show or hide the elements with the given IDs
		 *
		 * @param array elementIds The element IDs to apply the logic to
		 * @param boolean loading True if we are applying initial logic (to skip animating)
		 */
		_this.applyLogic = function (elementIds, loading) {
			for (var i = 0; i < elementIds.length; i++) {
				_this.applyElementLogic(elementIds[i], loading);
			}
		};

		/**
		 * Apply logic to the given element ID
		 *
		 * @param int elementId
		 * @param boolean loading True if we are applying initial logic (to skip animating)
		 */
		_this.applyElementLogic = function (elementId, loading) {
			if (iPhorm.logic[settings.id] && iPhorm.logic[settings.id].logic) {
				var logic = iPhorm.logic[settings.id].logic[elementId];

				if (logic && logic.rules && logic.rules.length) {
					var matchedValues = 0;
					for (var i = 0; i < logic.rules.length; i++) {
						var rule = logic.rules[i];
						if ((rule.operator == 'eq' && _this.elementHasValue(rule.element_id, rule.value)) || (rule.operator == 'neq' && !_this.elementHasValue(rule.element_id, rule.value))) {
							matchedValues++;
						}
					}

					if ((logic.match == 'any' && matchedValues > 0) || (logic.match == 'all' && matchedValues == logic.rules.length)) {
						var action = logic.action;
					} else {
						var action = logic.action == 'show' ? 'hide' : 'show';
					}

					var $element = $('.iphorm_'+settings.id+'_'+elementId+'-element-wrap, .iphorm_'+settings.id+'_'+elementId+'-group-wrap', $form);

					if (!loading && iPhorm.logic[settings.id].animate) {
						if (action == 'show') {
							$element.slideDown(400, function () {
								centerFancybox();
							});
						} else {
							$element.slideUp(400, function () {
								centerFancybox();
							});
						}
					} else {
						if (action == 'show') {
							$element.show();
						} else {
							$element.hide();
						}

						if (!loading) {
							centerFancybox();
						}
					}
				}
			}
		};

		/**
		 * Binds the conditional logic events to the elements
		 *
		 * @param array elementIds
		 */
		_this.applyDependentLogic = function (elementIds) {
			if (iPhorm.logic[settings.id] && iPhorm.logic[settings.id].dependents) {
				for (var i = 0; i < elementIds.length; i++) {
					var dependentElementIds = iPhorm.logic[settings.id].dependents[elementIds[i]],
					$input = $('.iphorm_' + settings.id + '_' + elementIds[i], $form);

					if ($input.length) {
						var bind;
						if ($input.is('select')) {
							bind = 'change.iphorm';
						} else if ($input.is('input[type=checkbox]') || $input.is('input[type=radio]')) {
							bind = 'click.iphorm';
						}

						if (bind) {
							(function (deps) {
								$input.bind(bind, function () {
									_this.applyLogic(deps);
								});
							})(dependentElementIds);
						}
					}
				}
			}
		};

		/**
		 * Does the element of the given ID has the given value?
		 *
		 * @param int elementId
		 * @param string value
		 * @return boolean
		 */
		_this.elementHasValue = function (elementId, value) {
			var $input = $('.iphorm_' + settings.id + '_' + elementId, $form);

			if ($input.length) {
				if ($input.is('select')) {
					if ($input.val() == value) {
						return true;
					}
				} else if ($input.is('input[type=checkbox]') || $input.is('input[type=radio]')) {
					var hasValue = false;
					$.each($input, function () {
						if ($(this).is(':checked') && $(this).val() == value) {
							hasValue = true;
							return false;
						}
					});
					return hasValue;
				}
			}

			return false;
		};

		/**
		 * Clears the default value and saves it and unbind the focus event,
		 * if reset is true a blur event is bound to show the default value
		 * again on blur if left empty.
		 *
		 * @param boolean reset
		 */
		_this.clearDefaultValue = function (reset) {
        	$(this).data('iphorm-default-value', $(this).val()).val('').unbind('focus');

        	if (reset) {
            	$(this).bind('blur', function () {
            		_this.resetDefaultValue.call(this);
                });
        	}
        };

        /**
         * Resets the default value of the element
         */
        _this.resetDefaultValue = function () {
			if ($(this).val() == '') {
				$(this).val($(this).data('iphorm-default-value')).unbind('blur').bind('focus', function () {
					_this.clearDefaultValue.call(this, true);
				});
			}
        };

        /**
         * Center the fancybox inside the viewport
         */
        function centerFancybox()
        {
        	if (settings.centerFancybox && typeof $.fancybox === 'function' && typeof $.fancybox.center === 'function' && $('#fancybox-wrap').length && $('#fancybox-wrap').is(':visible')) {
                $.fancybox.center(settings.centerFancyboxSpeed);
        	}
        }

		/**
		 * Format a file size given in bytes to a human readable value
		 *
		 * @param int File size in bytes
		 * @return string
		 */
		function formatFileSize(size) {
			if (size >= 1073741824) {
				size = (Math.round((size / 1073741824) * 10) / 10) + ' GB';
			} else if (size >= 1048576) {
				size = (Math.round((size / 1048576) * 10) / 10) + ' MB';
			} else if (size >= 1024) {
				size = (Math.round((size / 1024) * 10) / 10) + ' KB';
			} else {
				size = size + ' bytes';
			}

			return size;
		}

		/**
		 * Get the SWFUploader with the given ID
		 *
		 * @param string The uploader movie ID
		 * @return object|null
		 */
		function getUploader(uploaderId)
		{
			for (var i = 0; i < uploaders.length; i++) {
				if (uploaders[i].movieName == uploaderId) {
					return uploaders[i];
				}
			}

			return null;
		}

		/**
		 * Is the element in or scrolled out of the current viewport
		 *
		 * @param DOMElement element
		 * @return boolean
		 */
		function isScrolledIntoView(elem) {
	        var docViewTop = $(window).scrollTop();
	        var docViewBottom = docViewTop + $(window).height();

	        var elemTop = $(elem).offset().top;
	        var elemBottom = elemTop + $(elem).height();

	        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
	          && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
	    }

		/**
		 * Reset all the SWFUpload fields and stats
		 */
		function resetSWFUpload()
		{
			// Reset the SWFUpload stats and queues
			$('.iphorm-file-queue').hide().empty();
			for (var i = 0; i < uploaders.length; i++) {
				try {
					uploaders[i].setStats({
						in_progress: 0,
						files_queued : 0,
						successful_uploads : 0,
						upload_errors : 0,
						upload_cancelled : 0,
						queue_errors : 0
					});
				} catch (e) {}
			}
		}

		/**
		 * Get the dimensions of the given element even if it is hidden
		 *
		 * @param DOMElement element
		 * @param boolean includeMargin Include margin in outerWidth?
		 * @return object Object with all dimensions
		 */
		function getHiddenDimensions(element, includeMargin) {
		    var $item = $(element),
		        props = { position: 'absolute', visibility: 'hidden', display: 'block' },
		        dim = { width:0, height:0, innerWidth: 0, innerHeight: 0,outerWidth: 0,outerHeight: 0 },
		        $hiddenParents = $item.parents()[!!$.fn.addBack ? 'addBack' : 'andSelf']().not(':visible'),
		        includeMargin = (includeMargin == null)? false : includeMargin;

		    var oldProps = [];
		    $hiddenParents.each(function() {
		        var old = {};

		        for ( var name in props ) {
		            old[ name ] = this.style[ name ];
		            this.style[ name ] = props[ name ];
		        }

		        oldProps.push(old);
		    });

		    dim.width = $item.width();
		    dim.outerWidth = $item.outerWidth(includeMargin);
		    dim.innerWidth = $item.innerWidth();
		    dim.height = $item.height();
		    dim.innerHeight = $item.innerHeight();
		    dim.outerHeight = $item.outerHeight(includeMargin);

		    $hiddenParents.each(function(i) {
		        var old = oldProps[i];
		        for ( var name in props ) {
		            this.style[ name ] = old[ name ];
		        }
		    });

		    return dim;
		};
	}; // End $.iPhorm()

	$.fn.iPhorm = function(options) {
		return this.each(function () {
			iPhorm.instance = new $.iPhorm($(this), options);
		});
	}; // End $.fn.iPhorm

	// Preload the images in the base theme
//	$(window).load(function () {
//        window.iPhorm.preload([
//            'file-upload-tick.png',
//            'captcha-refresh-icon.png',
//            'default-loading.gif',
//            'error.png',
//            'success.png'
//        ], iphormL10n.plugin_url + '/images/');
//    });
})(jQuery); // End jQuery wrapper








(function (d, w) {
    var c = d.className;
    d.className = c + (c && ' ') + 'iphorm-js';
    w.iPhorm = {
        preloadedImages: [],
        preload: function (images, prefix) {
            for (var i = 0; i < images.length; i++) {
                var elem = document.createElement('img');
                elem.src = prefix ? prefix + images[i] : images[i];
                w.iPhorm.preloadedImages.push(elem);
            }
        },
        instance: null,
        logic: {}
    };
})(document.documentElement, window);
