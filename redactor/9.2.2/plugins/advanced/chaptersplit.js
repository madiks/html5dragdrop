if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

/**
 * 拆分章节
 *
 */
RedactorPlugins.chapter_split = {

	init: function()
	{	
	
		var callback = $.proxy(function()
		{
			this.selectionSave();
			this.handleSplitChapter();
			return false;
			
		}, this);
		
		this.buttonAdd('chapter_split', '分割章节', callback);	
		
		// this.addBtnSeparatorBefore('chapter_split');		
			
	},

	/**
	 * 编辑器光标上面的html
	 *
	 */
	getCurrentAboveHtml: function()
	{
		var aboveHtml = "";
		var root = this.getCurrentRootNode(), above = root, prev;
		while (true) {
			prev = $(above).prev()[0];
			if (typeof prev === 'undefined') {
				break;
			}
			aboveHtml = prev.outerHTML + aboveHtml;
			above = prev;
		}
		//console.log(aboveHtml);
		return this.filterTempHtml(aboveHtml);
	},
	
	/**
	 * 编辑器光标下面的html
	 *
	 */
	getCurrentBelowHtml: function()
	{
		var belowHtml = "";
		var root = this.getCurrentRootNode(), below = root, next;
		while (true) {
			next = $(below).next()[0];
			if (typeof next === 'undefined') {
				break;
			}
			belowHtml = belowHtml + next.outerHTML;
			below = next;
		}
		return this.filterTempHtml(belowHtml);		
	},
	
	/**
	 * 获取当前的根节点，向上查找父节点5次
	 *
	 */
	getCurrentRootNode: function()
	{
		var current = this.getCurrent();
		//节点是redactor_box或者redactor_editor
		//由redactor_box定位到redactor_editor
		if ($(current).hasClass('redactor_box')) {
			current = $(current).find('.redactor_editor');
		}
		if ($(current).hasClass('redactor_editor')) {
			//插入临时节点
			var tempNode = this.insertTempNodeAtCaret();
			//获取临时节点
			current = this.getCurrentNode();
		}
		
		//查找根节点 5次
		var root = current, parent;
		for (var i = 0; i < 5; i ++) {
			parent = $(root).parent()[0];
			if ($(parent).hasClass('redactor_editor')) {
				break;
			}
			root = parent;
		}	
		return root;
	},
	
	/**
	 * 获取当前的根节点html
	 *
	 */
	getCurrentRootHtml: function()
	{
		var rootHtml = this.getCurrentRootNode().outerHTML;
		return this.filterTempHtml(rootHtml);
	},	
	
	/**
	 * 临时节点的html
	 *
	 */
	getTempHtml: function()
	{
		var tempHtml = '<span class="temp-element">&nbsp;</span>';
		return tempHtml;
	},
	
	/**
	 * 光标处插入临时节点
	 *
	 */
	insertTempNodeAtCaret: function()
	{
		var tempNode = $(this.getTempHtml())[0];
		this.insertNode(tempNode);	
	},
	
	/**
	 * 过滤临时内容
	 *
	 */
	filterTempHtml: function(html)
	{
		return html.replace(this.getTempHtml(), '');
	},
	
	/**
	 * 删除临时节点
	 *
	 */
	removeTempNode: function()
	{
		this.$editor.find("span.temp-element").remove();
	},
	
	/**
	 * 执行拆分
	 *
	 */
	handleSplitChapter: function()
	{	
		this.selectionRestore();
		var aboveHtml = this.getCurrentAboveHtml() + this.getCurrentRootHtml(); //上部分html
		var belowHtml = this.getCurrentBelowHtml(); //下部分html

		this.removeTempNode();//去除临时节点
		refreshGlobalOriginalCode(this.get());//刷新原始code，防止弹出保存提示。
		
		if (aboveHtml && belowHtml) {
			var url = _BASEURL + '/editor/manages/?method=split.chapter';
			$.ajax({ 
				type: "POST", 
				url: url, 
				data: {'sid':_SUBJECT_ID, 'cid':_CHAPTER_ID, 'above_content': aboveHtml, 'below_content': belowHtml} , 
				dataType: "json", 
				beforeSend: function(){
					$('.message-area-container').removeClass('hidden');
					$('#loading-area').html('正在分割...');			
				},
				success: function(msg) { 
					if (msg['status'] == 200) {
						$('#loading-area').html('分割成功');
						//向下创建li
						var nCid = msg['message']['new_chapter']['id'];
						var nCname = msg['message']['new_chapter']['name'];
						var newLi = buildChapterSelectNode(nCid, nCname);
						newLi.find('.chapter-merge-up').removeClass('hide');
						newLi.effect("highlight", {"color":"#ffc"}, 1000, function() {
							$('.chapter-select.active').click();//重新加载
						});
						$('.chapter-select.active').after(newLi);
					} else {
						$('#loading-area').html('抱歉...发生错误。请几秒钟后重试。');
					}			
				}, 
				error: function( msg) { $('#loading-area').html('未知错误，请稍后再试'); } 
			});			
		
		}
	}
}