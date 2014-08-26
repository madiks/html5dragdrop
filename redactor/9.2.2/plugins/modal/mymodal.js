if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

//加入hr标签
RedactorPlugins.modal_hr = {

	init: function()
	{	
		var callback = $.proxy(function()
		{
			$('#redactor_modal #redactor_insert_hr_background_color_select').colorPicker({
				callback: function(color) {
					if (color) {
						$('#redactor_modal #redactor_insert_hr_background_color').attr('rel', color)
						$('#redactor_modal #redactor_insert_hr_background_color_preview').attr('rel', color).css('background-color', color);
					}
				},
				zIndex: 50001
			});
				
			this.selectionSave();
			var excludedTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']; //排除的标签
			var parent = this.getParent();
			var current = this.getCurrent();
			var html = '';			
			$('#redactor_modal #redactor_insert_hr_btn').click($.proxy(function()
			{			
				if ( $.inArray($(parent).get(0).tagName, excludedTags) < 0 && $.inArray($(current).get(0).tagName, excludedTags) < 0 ) {	
					var width = $('#redactor_modal #redactor_insert_hr_width').val();
					var height = $('#redactor_modal #redactor_insert_hr_height').val();
					var background_color = $('#redactor_modal #redactor_insert_hr_background_color').attr('rel');		
					html = '<hr style="width:' + width + '%; height:' + height + 'px; background:' + background_color + ';" />';
				}
				this.insertHrFromMyModal(html);
				return false;
					
			}, this));
		}, this);
	
		this.buttonAddAfter('horizontalrule','modal_hr', '分割色块', function()
		{
			this.modalInit('分割色块', '#modal_hr', 500, callback);	
			return false;
		});	

		// this.buttonAddSeparatorBefore('modal_hr');
			
	},
	insertHrFromMyModal: function(html)
	{
		this.selectionRestore();
		this.execCommand('inserthtml', html);
		this.modalClose();
	}

}


//发送到邮箱  display none
RedactorPlugins.modal_set = {

	init: function()
	{
		var dropdown = {
			send_email_to:
			{
				title: '发送邮件到…',
				func: 'showEmailInput'
			},
			send_email_to_tongyan:
			{
				title: '发送邮件给佟岩',
				func: 'sendEmailToTongYan'			
			}
		};
		
		this.buttonAdd('modal_set', '发送邮件到', false, dropdown);	
		
		//this.buttonAddSeparatorBefore('modal_set');
			
	},

	/**
	 * 发送邮件到...
	 */
	sendEmailTo: function(email)
	{
		var file_content = this.get();
		var file_name = 'test';	
		var url = _BASEURL + '/editor/manages/?method=send.email.to';
		if (!email) {
			return false;
		}
		//记录email cookie
		globalfunction.setCookies('ck_email', email);
		$.ajax({ 
			type: "POST", 
			url: url, 
			data: {'email':email, 'sid':_SUBJECT_ID} , 
			dataType: "html", 
			beforeSend: function(){
				$('.message-area-container').removeClass('hidden');
				$('#loading-area').html('发送中...');			
			},
			success: function(msg) { 
				if (msg == 'success') {
					$('#loading-area').html('发送成功');
				} else {
					$('#loading-area').html('抱歉...发生错误。请几秒钟后重试。');
				}
				setTimeout(function(){
					$('.message-area-container').addClass('hidden');
				}, 3000);			
			}, 
			error: function( msg) { $('#msg').html('未知错误，请稍后再试'); } 
		});
		this.modalClose();
	},
	
	sendEmailToTongYan: function()
	{
		var email = 'tongyan@readingjoy.com';
		this.sendEmailTo(email);
	},
	
	/**
	 * 显示邮箱输入框
	 */
	showEmailInput: function() {
	
	
		var callback = $.proxy(function()
		{
			//读取email cookie
			var ck_email = globalfunction.getCookies('ck_email');
			if (ck_email) {
				$('#redactor_modal #redactor_set_email').attr('value', ck_email);
			}		
			
 			$('#redactor_modal #redactor_set_btn').click($.proxy(function()
			{
				var email = $('#redactor_modal #redactor_set_email').val();
				this.sendEmailTo(email);					
				return false;
				
			}, this)); 
		}, this);	
		this.modalInit('发送邮件到', '#modal_set', 500, callback);
	}
}

/**
 * 页眉  隐藏
 *
 */
RedactorPlugins.modal_header = {

	init: function()
	{
		var dropdown = {
			insert_header1:
			{
				title: '页眉1',
				func: 'insert_header1'
			}
		};
		
		this.buttonAdd('modal_header', 'Add Header', function(){}, dropdown);	
		
		//this.buttonAddSeparatorBefore('modal_header');
			
	},
	
	insert_header1: function(){
		var callback = $.proxy(function()
		{	
			this.selectionSave();		
			var code = this.getSelection();
 			$('#redactor_modal #redactor_header1_btn').click($.proxy(function()
			{
				var foreground_color = $('#redactor_header1_foreground_color').val();
				var background_color = $('#redactor_header1_background_color').val();
				var html = '';
				html += '<div style="width:100%; border-bottom:3px solid #'+foreground_color+';">';
					html += '<div style="width:30%; background:#'+foreground_color+';">';
						html += '<span style="color: #'+background_color+';">';
							html += code;
						html += '</span>';
					html += '</div>';
				html += '</div>';
				this.insertHeaderFromMyModal(html);
				return false;
				
			}, this)); 
		}, this);	
		this.modalInit('Insert Header1', '#modal_header1', 500, callback);
	},
	
	insertHeaderFromMyModal: function(html)
	{
		this.selectionRestore();
		this.execCommand('inserthtml', html);
		this.modalClose();
	}

}

/**
 * 段落 隐藏
 *
 */
RedactorPlugins.modal_p = {

	init: function()
	{
		var dropdown = {
			send_to_email:
			{
				title: '缩进',
				func: 'indentParam'
			}
		};
		
		this.buttonAdd('modal_p', 'Formate P', function(){}, dropdown);	
		
		//this.buttonAddSeparatorBefore('modal_p');
			
	},
	
	indentParam: function()
	{
		this.selectionRestore();
		var current = this.getCurrentNode();
		if (!$(current).hasClass('redactor_box') && !$(current).hasClass('redactor_editor')) { //排除编辑器
			$(this.getCurrentNode()).each(function () {
				this.style.setProperty( 'padding-left', '10%' );
				this.style.setProperty( 'padding-right', '10%' );
			});		
		}
	}
	
}

/*字体*/
RedactorPlugins.modal_font_family = {

	init: function()
	{
		var dropdown = {
			formatToSimSun:
			{
				title: '<span style="font-family: \'AYGTSRJQIJ\', \'宋体\' !important;">宋体</span>',
				func: 'formatToSimSun'
			},
			formatToFangSong:
			{
				title: '<span style="font-family: \'JTRSWDSXTN\', \'仿宋_GB2312\', \'仿宋体\' !important;">仿宋</span>',
				func: 'formatToFangSong'
			},
			formatToKaiTi:
			{
				title: '<span style="font-family: \'WBLFLPDGCG\', \'楷体_GB2312\', \'楷体\' !important;">楷体</span>',
				func: 'formatToKaiTi'
			},
			formatToSimHei:
			{
				title: '<span style="font-family: \'MKWEPOWGMO\', \'黑体\', \'微软雅黑\', \'Hiragino Sans GB\', \'Heiti SC\' !important;">黑体</span>',
				func: 'formatToSimHei'
			},
			formatToLiSu:
			{
				title: '<span style="font-family: \'WPJZSLABMM\', \'隶书\' !important;">隶书</span>',
				func: 'formatToLiSu'
			},		
			//少女体
			formatToShaoNv:
			{
				title: '<span style="font-family: \'OLSMLIOLBP\' !important;">少女体</span>',
				func: 'formatToShaoNv'
			},			
			//俪金黑体
			formatToliJinSimHei:
			{
				title: '<span style="font-family: \'GGTFFSORBU\' !important;">俪金黑体</span>',
				func: 'formatToliJinSimHei'
			},

		};
		this.buttonAddBefore('fontcolor','modal_font_family', '字体', false, dropdown);	
		
		// this.buttonAddSeparatorBefore('modal_font_family');
			
	},
	
	//宋体
	formatToSimSun: function(){
		this.formatToFontName('SongTi');
	},
	
	//仿宋
	formatToFangSong: function(){
		this.formatToFontName('FangSong');
	},
	
	//楷体
	formatToKaiTi: function(){
		this.formatToFontName('KaiTi');
	},
	
	//黑体
	formatToSimHei: function(){
		this.formatToFontName('HeiTi');
	},
	
	//隶书
	formatToLiSu: function(){
		this.formatToFontName('LiShu');
	},
	
	//少女体
	formatToShaoNv: function() {
		this.formatToFontName('ShaoNvTi');
	},

	//俪金黑体
	formatToliJinSimHei: function() {
		this.formatToFontName('LiJinHeiTi');
	},

	formatToFontName: function(name)
	{
		var selectedText = $('<div>' + this.getSelectionHtml() + '</div>').text();
		if (!selectedText) {
			return false;
		}
		//请求第三方字体
		var url = _BASEURL + '/editor/manages/?method=create.font.face';
		var that = this;
		$.ajax({ 
			type: "POST", 
			url: url, 
			data: {'text':selectedText, 'name':name, 'sid':_SUBJECT_ID} , 
			dataType: "json", 
			beforeSend: function(){
				$('.message-area-container').removeClass('hidden');
				$('#loading-area').html('处理中...');			
			},
			success: function(msg) { 
				if (msg['status'] == 200) {
					var family = msg['message']['font-family'];
					var src = msg['message']['src'];
					var fallback = msg['message']['fallback'];
					//加入font face
					that.addFontFace(family, src);
					//执行
					that.formatFontFamily(family, fallback, name);
					//ui
					$('#loading-area').html('处理成功...');
					setTimeout(function(){
						$('.message-area-container').addClass('hidden');
					}, 3000);
				} else {
					$('#loading-area').html('抱歉...发生错误。请几秒钟后重试。');
				}
			}, 
			error: function( msg) { $('#loading-area').html('未知错误，请稍后再试'); } 
		});

	},

	addFontFace: function(family, src)
	{
		var style = '@font-face {';
		style += 'font-family: ' + family + ';';
		for (var i in src) {
			style += 'src: ' + src[i] + ';';
		}
		style += '}';
		$('#style-font-face').append(style);
	},

	formatFontFamily: function(family, fallback, name)
	{
		//font family
		var family_str = '\'' + family + '\'';
		if (fallback.length != 0) {
			family_str += ', ' + '\'' + fallback.join('\', \'') + '\'';
		}
		//执行
		this.execCommand('fontName', family_str);
		var font = $("font[face]", this.$editor);
		font.each(function() {
			$(this).replaceWith('<span class="font-' + name + '" data-font="' + name + '" style="font-family: ' + family_str + ' !important;">' + $(this).html() + '</span>');
		});
		// set no editable
		this.setNonEditable();
		this.setSpansVerified();
		
		this.sync();
	}

}

/*大小*/
RedactorPlugins.modal_font_size = {

	init: function()
	{
		var dropdown = {
			formatToSmall:
			{
				title: '<span style="font-size: 0.6em">小</span>',
				func: 'formatToSmall'
			},
			formatToMiddle:
			{
				title: '<span style="font-size: 0.8em">中</span>',
				func: 'formatToMiddle'
			},
			formatToNormal:
			{
				title: '<span style="font-size: 1.0em">正常</span>',
				func: 'formatToNormal'
			},			
			formatToBig:
			{
				title: '<span style="font-size: 1.2em">大</span>',
				func: 'formatToBig'
			},
			formatToBigger:
			{
				title: '<span style="font-size: 1.5em">特大</span>',
				func: 'formatToBigger'
			},
		};
		
		this.buttonAddBefore('fontcolor','modal_font_size', '字体大小', false, dropdown);	
		
		// this.buttonAddSeparatorBefore('modal_font_size');
			
	},
	
	//小
	formatToSmall: function(){
		this.formatFontSize(1);
	},
	
	//中
	formatToMiddle: function(){
		this.formatFontSize(2);
	},
	
	//正常
	formatToNormal: function(){
		this.formatFontSize(3);
	},

	//大
	formatToBig: function(){
		this.formatFontSize(4);
	},
	
	//特大
	formatToBigger: function(){
		this.formatFontSize(5);
	},
	
	formatFontSize: function(size)
	{	
		var em = {
			1: '0.6em',
			2: '0.8em',
			3: '1.0em',
			4: '1.2em',
			5: '1.5em',
			6: '2.0em',
			7: '2.5em',
		};
		this.execCommand('fontSize', size);
		var font = $("font[size]", this.$editor);
		font.each(function() {
			$(this).replaceWith('<span style="font-size: ' + em[size] + '">' + $(this).html() + '</span>');
		});
		// set no editable
		this.setNonEditable();
		this.setSpansVerified();

		this.sync();
	}

}

/**
 * 段落底色
 *
 */
RedactorPlugins.modal_p_backcolor = {

	init: function()
	{
		this.buttonAddAfter('backcolor', 'modal_p_backcolor', '段落底色');	
		var that = this;
		$('.re-modal_p_backcolor').parent().colorPicker({
			clickClassName: "redactor_act dropact",
			callback: function(color) {
				if (color) {
					that.insertParBackColor(color);
				}
			}
		});
	},
	insertParBackColor: function(color)
	{
		var current = this.getCurrent();
		if (current.nodeType === 3) {//Text Node
			current = this.getParent();
		}
		if (!$(current).hasClass('redactor_box') && !$(current).hasClass('redactor_editor')) { //排除编辑器
			$(current).each(function () {
				this.style.setProperty( 'background-color', color, 'important' );
				this.style.setProperty( 'padding', '0.8em' );
			});
		}
	}
}

/**
 * 段落竖排
 *
 */
RedactorPlugins.modal_p_vertical = {

	init: function()
	{
	
		var callback = $.proxy(function()
		{
			this.selectionSave();		
			$('#redactor_modal #redactor_p_vertical_btn').click($.proxy(function()
			{
				var height = $('#redactor_modal #redactor_p_vertical_height').val();
				this.paraVertical(height + 'em');
				return false;
					
			}, this));
		}, this);	

		this.buttonAddAfter('alignment', 'modal_p_vertical', '段落竖排', $.proxy(function() {
			this.modalInit('段落竖排', '#modal_p_vertical', 500, callback);	
			return false;		
		}, this));	
	},
	paraVertical: function(height)
	{
		this.selectionRestore();
		var current = this.getCurrent();
		if (current.nodeType === 3) {//Text Node
			current = this.getParent();
		}
		if (!$(current).hasClass('redactor_box') && !$(current).hasClass('redactor_editor')) { //排除编辑器
			$(current).each(function () {
				this.style.setProperty( '-webkit-writing-mode', 'vertical-rl');
				this.style.setProperty( 'page-break-inside', 'avoid' );
				this.style.setProperty( 'height', height);
			});
		}
		this.modalClose();
	}
}

/**
 * 插入分页符
 *
 */
RedactorPlugins.modal_page_break = {

	init: function()
	{
		this.buttonAdd('modal_page_break', '插入分页符', $.proxy(function(obj) {
			this.selectionSave();
			this.insertPageBreak();
			return false;
		}, this));	
	},
	insertPageBreak: function()
	{
		this.selectionRestore();
		var current = this.getCurrent(), parent;
		if ($(current).hasClass('redactor_editor') || $(current).hasClass('redactor_box')) {
			return false;
		}
		var html = '<p class="page-break-after-always" style="page-break-after: always;"></p>';
		for (var i = 0; i < 5; i ++) {
			parent = $(current).parent()[0];
			if ($(parent).hasClass('redactor_editor')) {
				$(current).after(html);
				break;
			}
			current = parent;
		}
	}
}

/**
 * 清除段落样式
 *
 */
RedactorPlugins.modal_clear_p_style = {

	init: function()
	{
		this.buttonAdd('modal_clear_p_style', '清除段落样式', $.proxy(function(obj) {
			this.selectionSave();
			this.clearParaStyle();
			return false;
		}, this));	
	},
	clearParaStyle: function(html)
	{
		this.selectionRestore();
		var current = this.getCurrent();
		if (current.nodeType === 3) {//Text Node
			current = this.getParent();
		}
		if (!$(current).hasClass('redactor_box') && !$(current).hasClass('redactor_editor')) { //排除编辑器	
			$(current).removeAttr('style');
		}
	}

}

/**
 * 查找替换
 *
 */
RedactorPlugins.modal_replace = {

	init: function()
	{	
		var callback = $.proxy(function()
		{
			this.selectionSave();		
			$('#redactor_modal #redactor_replace_btn').click($.proxy(function()
			{			
				var search = $('#redactor_modal #redactor_find_what').val();
				var replace = $('#redactor_modal #redactor_replace_with').val();
				if (search) {
					this.replaceContent(search, replace);
				}
				return false;
					
			}, this));
		}, this);
	
		this.buttonAdd('modal_replace', '查找替换', function()
		{
			this.modalInit('查找替换', '#modal_replace', 500, callback);	
			return false;
		});	

		 // this.buttonAddSeparatorBefore('modal_replace');
			
	},
	replaceContent: function(search, replace)
	{
		this.selectionRestore();
		var i = 0;
		var reg = new RegExp(search, "ig");
		
		//获取文本节点
		var textNodes = this.$editor.find(":not(iframe)").addBack().contents().filter(function() {
			return this.nodeType == 3;
		});
		
		//替换内容
		$(textNodes).each(function() {
			//console.log( $(this).text());
			var text = $(this).text().replace(reg, function() {
				i ++;
				return replace;
			});
			$(this).replaceWith(text);
		});
		// set no editable
		this.setNonEditable();
		this.setSpansVerified();		

		this.sync();
		this.modalClose();
		
 		setTimeout(function(){
			alert('共替换' + i + '次');
		}, 500); 			
	}
	
}

/**
 * 脚注
 *
 */
RedactorPlugins.modal_subscript = {

	init: function()
	{	
		var callback = $.proxy(function()
		{
			this.selectionSave();		
			$('#redactor_modal #redactor_subscript_btn').click($.proxy(function()
			{			
				var mark = $('#redactor_modal #redactor_subscript_mark').val();
				var content = $('#redactor_modal #redactor_subscript_content').val();
				if (mark && content) {
					this.addSubscript(mark, content);
				}
				return false;
					
			}, this));
		}, this);
	
		this.buttonAdd('modal_subscript', '添加脚注', function()
		{
			this.modalInit('添加脚注', '#modal_subscript', 500, callback);	
			return false;
		});	

		 // this.buttonAddSeparatorBefore('modal_subscript');
			
	},
	addSubscript: function(mark, content)
	{
		var randomNum = Math.floor(Math.random() * 1000);
		var htmlMark = '<a epub:type="noteref"  href="#n' + randomNum + '">' + mark + '</a>';
		var htmlContent = '<aside epub:type="footnote"  id="n' + randomNum + '">' + content + '</aside>';

		this.selectionRestore();
		this.execCommand('inserthtml', htmlMark);
		this.$editor.append(htmlContent);
		this.modalClose();
	}

}
	
/**
 * MathMl
 *
 */
RedactorPlugins.modal_mathml = {

	init: function()
	{	
		var callback = $.proxy(function()
		{
			this.selectionSave();		
			$('#redactor_modal #redactor_mathml_btn').click($.proxy(function()
			{			
				var mathml = $('#redactor_modal #redactor_mathml').val();
				mathml = this.filterMathML(mathml);
				//console.log(mathml);return false;
				if (mathml) {
					this.addMathML(mathml);
				}
				return false;
					
			}, this));
		}, this);
	
		this.buttonAdd('modal_mathml', '添加MathML', function()
		{
			this.modalInit('添加MathML', '#modal_mathml', 500, callback);	
			return false;
		});	

		 // this.buttonAddSeparatorBefore('modal_mathml');
			
	},
	filterMathML: function(mathml)
	{
		mathml = mathml.replace(/\n/ig, '');
		//mathml = mathml.replace(/> +</ig, '');
		return mathml;
	},
	addMathML: function(mathml)
	{
		var html = '<div class="mathml-container">'
					 + '<div class="mathml">'
					 + mathml
					 + '</div>'
					 + '<i class="mathml-icon">&nbsp;&nbsp;</i>'							 
				 + '</div>';		
		this.selectionRestore();
		this.execCommand('inserthtml', html);
		this.modalClose();
	}
	
}

RedactorPlugins.modal_math_preview = {

	init: function()
	{
		var that = this;
		var callback = function(){};

		$('#pensieve-editor').on('click', '.mathml-container', function(e) {
			that.modalInit('公式预览', '#modal_math_preview', 1000, callback);

			//update math input
			var mathml = $(this).find('.mathml').html();
			$('#redactor_modal #MathInput').val(mathml);

			//show math
			var preview = $('#redactor_modal #MathPreview');
			var buffer = $('#redactor_modal #MathBuffer');
			var input = $('#redactor_modal #MathInput');

			Preview.Init(preview[0], buffer[0], input[0]);
			Preview.Update();		
			return false;

		});

	}

}

/**
 * 插入全屏图片 
 * 
 */
RedactorPlugins.modal_full_image = {

	init: function()
	{
		var callback = $.proxy(function()
		{
			this.selectionSave();

			//see redactor `showImage` function

			// tabs
			if ($('#redactor_modal #redactor_plugin_tabs').size() !== 0)
			{
				var that = this;
				$('#redactor_modal #redactor_plugin_tabs a').each(function(i,s)
				{
					i++;
					$(s).click(function()
					{
						$('#redactor_modal #redactor_plugin_tabs a').removeClass('redactor_plugin_tabs_act');
						$(this).addClass('redactor_plugin_tabs_act');
						$('#redactor_modal .redactor_plugin_tab').hide();
						$('#redactor_modal #redactor_plugin_tab' + i).show();
					});
				});
			}

			if (this.opts.imageGetJson !== false)
			{
				// json ...
			}
			else
			{
				$('#redactor_modal #redactor_plugin_tabs a').eq(1).remove();
			}

			if (this.opts.imageUpload !== false)
			{			
				// dragupload
				if (this.opts.uploadCrossDomain === false && this.isMobile() === false)
				{
					if ($('#redactor_modal #redactor_plugin_file').size() !== 0)
					{
						$('#redactor_modal #redactor_plugin_file').dragupload(
						{
							url: this.opts.imageUpload,
							uploadFields: this.opts.uploadFields,
							success: $.proxy(this.fullImageUploadCallback, this),
							error: false
						});
					}
				}

				// ajax upload
				this.uploadInit('redactor_modal #redactor_plugin_file',
				{
					auto: true,
					url: this.opts.imageUpload,
					success: $.proxy(this.fullImageUploadCallback, this),
					error: false
				});
			}
			else
			{
				$('#redactor_modal .redactor_plugin_tab').hide();
				if (this.opts.imageGetJson === false)
				{
					$('#redactor_modal #redactor_plugin_tabs').remove();
					$('#redactor_modal #redactor_plugin_tab3').show();
				}
				else
				{
					var tabs = $('#redactor_modal #redactor_plugin_tabs a');
					tabs.eq(0).remove();
					tabs.eq(1).addClass('redactor_plugin_tabs_act');
					$('#redactor_modal #redactor_plugin_tab2').show();
				}
			}

			// bind click event
			$('#redactor_modal #redactor_plugin_upload_btn').click($.proxy(this.fullImageUploadCallbackLink, this));

		}, this);

		this.buttonAdd('modal_full_image', '添加全屏图片', function()
		{
			this.modalInit('添加全屏图片', '#modal_full_image', 500, callback);	
			return false;
		});	

		 // this.buttonAddSeparatorBefore('modal_full_image');
	},

	fullImageUploadCallback: function(json)
	{
		if (json !== false) {
			var filelink = json.filelink;
			this.insertFullImage(filelink);	
		}
	},

	fullImageUploadCallbackLink: function()
	{
		if ($('#redactor_modal #redactor_plugin_file_link').val() !== '')
		{
			var filelink = $('#redactor_modal #redactor_plugin_file_link').val();
			this.insertFullImage(filelink);	
		}
		else
		{
			this.modalClose();
		}		
	},

	insertFullImage: function(filelink)
	{
		this.selectionRestore();
		var current = this.getCurrent(), parent;
		if ($(current).hasClass('redactor_editor') || $(current).hasClass('redactor_box')) {
			return false;
		}

		var html = '<div class="fullscreen-image" data-fullscreen-image-url="' + filelink + '" style="position: absolute;left: 0;top: 0;overflow: hidden;width: 100%;height: 100%;background-color: #000;background-image: url(\'' + filelink + '\') !important;background-size: contain;background-repeat: no-repeat !important;background-position: center !important;"></div>'
					 + '<p class="page-break-after-always" style="page-break-after: always;"></p>'
					 ;

		for (var i = 0; i < 5; i ++) {
			parent = $(current).parent()[0];
			if ($(parent).hasClass('redactor_editor')) {
				$(current).before(html);
				break;
			}
			current = parent;
		}
		this.modalClose();
	}


}


/**
 * 插入留白
 *
 */
RedactorPlugins.modal_space = {

	init: function()
	{	
		var callback = $.proxy(function()
		{
			this.selectionSave();		
			$('#redactor_modal #redactor_space_btn').click($.proxy(function()
			{			
				var height = $('#redactor_modal .redactor_space_height:checked').val();
				if (height) {
					this.addSpace(height);
				}
				return false;					
			}, this));
		}, this);
	
		this.buttonAdd('modal_space', '添加留白', function()
		{
			this.modalInit('添加留白', '#modal_space', 500, callback);	
			return false;
		});	

		 // this.buttonAddSeparatorBefore('modal_space');
			
	},

	addSpace: function(height)
	{
		var height_percent = ( height * 100 ) + '%';
		this.selectionRestore();
		var html = '<p class="editor-space" data-editor-space="' + height + '" style="padding-top: ' + height_percent + ';"></p>';
		this.execCommand('inserthtml', html);
		this.modalClose();
	}	

}

/**
 * 段落左右缩进
 *
 **/
RedactorPlugins.modal_p_indents = {

	init: function()
	{
		var dropdown = {
			indentParFivePercent:
			{
				title: '5%',
				func: 'indentParFivePercent'
			},
			indentParTenPercent:
			{
				title: '10%',
				func: 'indentParTenPercent'
			},
			indentParTwentyPercent:
			{
				title: '20%',
				func: 'indentParTwentyPercent'
			},
		};
		
		this.buttonAdd('modal_p_indents', '段落左右缩进', false, dropdown);	

		// this.buttonAddSeparatorBefore('modal_p_indents');
			
	},

	indentParFivePercent: function()
	{
		this.indentPar('5%');
	},	

	indentParTenPercent: function()
	{
		this.indentPar('10%');
	},

	indentParTwentyPercent: function()
	{
		this.indentPar('20%');
	},

	indentPar: function(percent)
	{
		this.selectionRestore();
		var current = this.getCurrent();
		if (current.nodeType === 3) {//Text Node
			current = this.getParent();
		}
		if (!$(current).hasClass('redactor_box') && !$(current).hasClass('redactor_editor')) { //排除编辑器
			$(current).each(function () {
				this.style.setProperty( 'padding-left', percent );
				this.style.setProperty( 'padding-right', percent );
			});		
		}		
	}


}

/**
 * 更多列表样式
 *
 */
RedactorPlugins.modal_list = {


	init: function()
	{
		var dropdown = {
			armenian:
			{
				title: 'Ա, Բ, Գ',
				func: 'insertArmenianListStyle'
			},
			cjk_ideographic:
			{
				title: '一, 二, 三',
				func: 'insertCjkIdeographicListStyle'
			},			
			decimal:
			{
				title: '1, 2, 3',
				func: 'insertDecimalListStyle'
			},
			decimal_leading_zero:
			{
				title: '01, 02, 03',
				func: 'insertDecimalLeadingZeroListStyle'
			},
			georgian:
			{
				title: 'ა, ბ, გ',
				func: 'insertGeorgianListStyle'
			},			
			hebrew:
			{
				title: 'א, בּ, ב',
				func: 'insertHebrewListStyle'
			},
			hiragana:
			{
				title: 'あ, い, う',
				func: 'insertHiraganaListStyle'
			},
			hiragana_iroha:
			{
				title: 'い, ろ, は',
				func: 'insertHiraganaIrohaListStyle'
			},
			katakana:
			{
				title: 'ア, イ, ウ',
				func: 'insertKatakanaListStyle'
			},
			katakana_iroha:
			{
				title: 'イ, ロ, ハ',
				func: 'insertKatakanaIrohaListStyle'
			},
			lower_alpha:
			{
				title: 'a, b, c',
				func: 'insertLowerAlphaListStyle'
			},
			lower_greek:
			{
				title: 'α, β, γ',
				func: 'insertLowerGreekListStyle'
			},
			lower_latin:
			{
				title: 'a, b, c',
				func: 'insertLowerLatinListStyle'
			},
			lower_roman:
			{
				title: 'i, ii, iii',
				func: 'insertLowerRomanListStyle'
			},
			none:
			{
				title: '无',
				func: 'insertNoneListStyle'
			},
			upper_alpha:
			{
				title: 'A, B, C',
				func: 'insertUpperAlphaStyle'
			},
			upper_latin:
			{
				title: 'A, B, C',
				func: 'insertUpperLatinStyle'
			},
			upper_roman:
			{
				title: 'I, II, III',
				func: 'insertUpperRomanStyle'
			},
		};
		
		this.buttonAdd('modal_list', '更多列表样式', false, dropdown);	

		// this.buttonAddSeparatorBefore('modal_list');
			
	},

	insertArmenianListStyle: function()
	{
		this.insertListStyle('armenian');	
	},

	insertCjkIdeographicListStyle: function()
	{
		this.insertListStyle('cjk-ideographic');	
	},

	insertDecimalListStyle: function()
	{
		this.insertListStyle('decimal');	
	},

	insertDecimalLeadingZeroListStyle: function()
	{
		this.insertListStyle('decimal-leading-zero');	
	},

	insertGeorgianListStyle: function()
	{
		this.insertListStyle('georgian');	
	},

	insertHebrewListStyle: function()
	{
		this.insertListStyle('hebrew');	
	},

	insertHiraganaListStyle: function()
	{
		this.insertListStyle('hiragana');	
	},

	insertHiraganaIrohaListStyle: function()
	{
		this.insertListStyle('hiragana-iroha');	
	},

	insertKatakanaListStyle: function()
	{
		this.insertListStyle('katakana');	
	},

	insertKatakanaIrohaListStyle: function()
	{
		this.insertListStyle('katakana-iroha');	
	},

	insertLowerAlphaListStyle: function()
	{
		this.insertListStyle('lower-alpha');	
	},

	insertLowerGreekListStyle: function()
	{
		this.insertListStyle('lower-greek');	
	},

	insertLowerLatinListStyle: function()
	{
		this.insertListStyle('lower-latin');	
	},

	insertLowerRomanListStyle: function()
	{
		this.insertListStyle('lower-roman');	
	},

	insertNoneListStyle: function()
	{
		this.insertListStyle('none');	
	},

	insertUpperAlphaStyle: function()
	{
		this.insertListStyle('upper-alpha');	
	},

	insertUpperLatinStyle: function()
	{
		this.insertListStyle('upper-latin');	
	},

	insertUpperRomanStyle: function()
	{
		this.insertListStyle('upper-roman');	
	},

	insertListStyle: function(type)
	{
		this.selectionRestore();
		var select = this.getSelection();
		//先判断ol节点
		if ($(select).get(0).tagName !== 'OL') {
			this.execCommand('insertorderedlist', false);
		}
		$(this.getSelection()).css('list-style-type', type);
	}

}



/**
 * 段落组合 ??????
 *
 */
RedactorPlugins.modal_p_group = {

	init: function()
	{
		this.buttonAdd('modal_p_group', '段落组合', $.proxy(function() {
			this.groupParagraph();
			return false;
		}, this));	
	},

	groupParagraph: function()
	{
		var selection = this.getSelection();

		//anchorNode
		//向上找根节点 最多5层
		var anchorNode = selection.anchorNode;
		for (var i = 0; i < 5; i ++) {
			parent = anchorNode.parentNode;
			if ($(parent).hasClass('redactor_editor')) {
				break;
			}
			anchorNode = parent;
		}

		//focusNode
		//向上找根节点 最多5层
		var focusNode = selection.focusNode;
		for (var i = 0; i < 5; i ++) {
			parent = focusNode.parentNode;
			if ($(parent).hasClass('redactor_editor')) {
				break;
			}
			focusNode = parent;
		}

		//重新设置选择区域
		this.selectionSet(anchorNode, 0, focusNode, 1); //??
		this.selectionSave();
		this.selectionRestore();

		//获取设置区域后的html
		html = this.getSelectionHtml();

		//插入html
		html = '<div class="paragraph-group">' + html + '</div>';
		this.execCommand('inserthtml', html);

		//删除前后的空节点
		var div = $("div.paragraph-group", this.$editor);
		if (!div.prev().html()) {
			div.prev().remove();
		}
		if (!div.next().html()) {
			div.next().remove();
		}
	}

}

/**
 * 段落强制不缩进
 *
 */
RedactorPlugins.modal_p_forced_not_indented = {

	init: function()
	{
		this.buttonAdd('modal_p_forced_not_indented', '段落强制不缩进', $.proxy(function(obj) {
			this.setParIndent();
			return false;
		}, this));	
	},

	setParIndent: function()
	{
		this.selectionRestore();
		var current = this.getCurrent();
		if (current.nodeType === 3) {//Text Node
			current = this.getParent();
		}
		if (!$(current).hasClass('redactor_box') && !$(current).hasClass('redactor_editor')) { //排除编辑器
			$(current).each(function () {
				this.style.setProperty( 'text-indent', '0em', 'important');
			});
		}
		this.modalClose();
	}

}

/**
 * 音标
 * @type {Object}
 */
RedactorPlugins.modal_phonetic = {

	init: function()
	{
		var that = this;
		var dropdown = {
			phonetic1:
			{
				title: '&#x00E6;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x00E6;');
				}
			},
			phonetic2:
			{
				title: '&#x00F0;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x00F0;');
				}
			},
			phonetic3:
			{
				title: '&#x014B;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x014B;');
				}
			},
			phonetic4:
			{
				title: '&#x0251;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0251;');
				}
			},
			phonetic5:
			{
				title: '&#x0252;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0252;');
				}
			},
			phonetic6:
			{
				title: '&#x0254;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0254;');
				}
			},
			phonetic7:
			{
				title: '&#x0259;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0259;');
				}
			},
			phonetic8:
			{
				title: '&#x025B;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x025B;');
				}
			},
			phonetic9:
			{
				title: '&#x025C;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x025C;');
				}
			},
			phonetic10:
			{
				title: '&#x0261;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0261;');
				}
			},
			phonetic11:
			{
				title: '&#x026A;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x026A;');
				}
			},
			phonetic12:
			{
				title: '&#x0283;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0283;');
				}
			},
			phonetic13:
			{
				title: '&#x028A;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x028A;');
				}
			},
			phonetic14:
			{
				title: '&#x028C;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x028C;');
				}
			},
			phonetic15:
			{
				title: '&#x0292;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x0292;');
				}
			},
			phonetic16:
			{
				title: '&#x02C8;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x02C8;');
				}
			},
			phonetic17:
			{
				title: '&#x02CC;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x02CC;');
				}
			},
			phonetic18:
			{
				title: '&#x02D0;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x02D0;');
				}
			},
			phonetic19:
			{
				title: '&#x03B8;',
				callback: function(obj)
				{
					that.insertPhonetic('&#x03B8;');
				}
			},

		};
		
		this.buttonAdd('modal_phonetic', '加入音标', false, dropdown);	

		// this.buttonAddSeparatorBefore('modal_phonetic');
			
	},

	insertPhonetic: function(html)
	{
		this.selectionRestore();
		this.execCommand('inserthtml', html);

	}

}