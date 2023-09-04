jQuery(function(){
	 if(jQuery.datepicker){
		 jQuery.datepicker.regional['zh-CN'] = {
			 closeText: '關閉',
			 prevText: '&#x3c;上月',
			 nextText: '下月&#x3e;',
			 currentText: '今天',
			 monthNames: ['一月','二月','三月','四月','五月','六月',
				 '七月','八月','九月','十月','十一月','十二月'],
			 monthNamesShort: ['一月','二月','三月','四月','五月','六月',
				 '七月','八月','九月','十月','十一月','十二月'],
			 dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
			 dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
			 dayNamesMin: ['日','一','二','三','四','五','六'],
			 weekHeader: '周',
			 dateFormat: 'yy-mm-dd',
			 firstDay: 1,
			 isRTL: false,
			 showMonthAfterYear: true,
			 yearSuffix: '年'};

		 jQuery.datepicker.regional['zh-TW'] = {
		        clearText: '清除',
		        clearStatus: '清除已選日期',
		        closeText: '關閉',
		        closeStatus: '不改變當前選擇',
		        prevText: '<上月',
		        prevStatus: '顯示上月',
		        prevBigText: '<<',
		        prevBigStatus: '顯示上壹年',
		        nextText: '下月>',
		        nextStatus: '顯示下月',
		        nextBigText: '>>',
		        nextBigStatus: '顯示下壹年',
		        currentText: '今天',
		        currentStatus: '顯示本月',
		        monthNames: ['壹月','二月','三月','四月','五月','六月', '七月','八月','九月','十月','十壹月','十二月'],
		        monthNamesShort: ['壹','二','三','四','五','六', '七','八','九','十','十壹','十二'],
		        monthStatus: '選擇月份',
		        yearStatus: '選擇年份',
		        weekHeader: '周',
		        weekStatus: '年內周次',
		        dayNames: ['星期日','星期壹','星期二','星期三','星期四','星期五','星期六'],
		        dayNamesShort: ['周日','周壹','周二','周三','周四','周五','周六'],
		        dayNamesMin: ['日','壹','二','三','四','五','六'],
		        dayStatus: '設置 DD 為壹周起始',
		        dateStatus: '選擇 m月 d日, DD',
		        dateFormat: 'yy-mm-dd',
		        firstDay: 1,
		        initStatus: '請選擇日期',
		        isRTL: false};

		if(dtGlobals.language==""){
			jQuery.datepicker.setDefaults(jQuery.datepicker.regional['zh-TW']);
		}else if(dtGlobals.language=="2"){
			jQuery.datepicker.setDefaults(jQuery.datepicker.regional['zh-CN']); 
		}
	 }
	 if(jQuery.timepicker){
		jQuery.timepicker.regional['zh-CN'] = {
				currentText: '当前时间',
				closeText: '确认',
				timeOnlyTitle: '选择时间',
				timeText: '时间',
				hourText: '小时',
				minuteText: '分钟',
				secondText: '秒',
				millisecText: '毫秒',
				timezoneText: '时区',
		        isRTL: false}; 
		 jQuery.timepicker.regional['zh-TW'] = {
				currentText: '當前時間',
				closeText: '確認',
				timeOnlyTitle: '選擇時間',
				timeText: '時間',
				hourText: '小時',
				minuteText: '分鐘',
				secondText: '秒',
				millisecText: '毫秒',
				timezoneText: '時區',
		        isRTL: false}; 
		if(dtGlobals.language==""){
			jQuery.timepicker.setDefaults(jQuery.timepicker.regional['zh-TW']); 
		}else if(dtGlobals.language=="2"){
			jQuery.timepicker.setDefaults(jQuery.timepicker.regional['zh-CN']); 
		}
	 }
	
})
