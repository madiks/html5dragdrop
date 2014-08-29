/**
 * jQuery ColorPicker
 * from Redactor
 * 2013-4-24 19:01
 */
(function($){
	jQuery.fn.colorPicker = function(option)
	{
		return this.each(function()
		{
			var obj = $(this);
			if (!obj.data('colorPicker')) 
			{
				obj.data('colorPicker', new ColorPicker(this, option));
			}
		})
	}
	var ColorPicker = function(element, options) 
	{
		this.el = $(element);
		this.opts = $.extend({
			colors: [
				'#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#ffff00',
				'#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada', '#fff2ca',
				'#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5', '#ffe694',
				'#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#b7dde8', '#fac08f', '#f2c314',
				'#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#92cddc', '#e36c09', '#c09100',
				'#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#31859b', '#974806', '#7f6000'],
			clickClassName: "", //string
			callback: null, //function 
			zIndex: 0, //number
		}, options);
		this.init();
	}
	ColorPicker.prototype = 
	{
		init: function()
		{
			this.dropdown = this.buildDropDown();
			this.connectOpennigEvent();
		},
		connectOpennigEvent: function() 
		{
			this.el.bind('click.colorPicker', $.proxy(function(eventData)
			{
				this.showDropDown(eventData, this.dropdown)
			}, this));
		},
		disconnectOpenningEvent: function() 
		{
			this.el.unbind('.colorPicker');
		},
		buildColorPicker: function(dropdown) {
			$(dropdown).width(210);
			var len = this.opts.colors.length, that = this;
			for (var i = 0; i < len; ++i)
			{
				var color = this.opts.colors[i];
				var swatch = $('<a rel="' + color + '" href="javascript:void(null);" style="float: left; font-size: 0; border: 2px solid #fff; padding: 0; margin: 0; width: 20px; height: 20px;"></a>').css({ 'backgroundColor': color });
				$(dropdown).append(swatch);
				swatch.bind('click', function(){
					that.triggerCallback(that.opts.callback, $(this).attr('rel'));
				});
			}
			$(dropdown).append(this.buildNoneElement());//加入空元素
			return dropdown;
		
		},
		buildNoneElement: function() {
			var elnone = $('<a href="javascript:void(null);" class="redactor_color_none"></a>').html('无');
			elnone.bind('click', $.proxy(function() {
				this.triggerCallback(this.opts.callback, "");
			}, this));
			return elnone;
		},
		buildDropDown: function() 
		{
			var dropdown = $('<div class="redactor_dropdown" style="display: none;">');
			dropdown = this.buildColorPicker(dropdown);
			$('body').append(dropdown);
			return dropdown;
		},
		showDropDown: function(eventData, dropdown) 
		{
			this.disconnectOpenningEvent();
			this.hideAllDropDown();
			this.addClickEffect();
			var left = this.el.offset().left;
			var top = this.el.offset().top;
			var height = this.el.height();			
			$(dropdown).css({ position: 'absolute', left: left + 'px', top: ( top + height ) + 'px' }).show();
			if (this.opts.zIndex) {
				$(dropdown).css('zIndex', this.opts.zIndex);
			}
			
			var hdlHideDropDown = $.proxy(function() { this.hideAllDropDown()}, this);
			$(document).one('click', hdlHideDropDown);			
			this.el.one('click', hdlHideDropDown);	;			
			
			eventData.stopPropagation();//stop event bubbling
		},
		hideAllDropDown: function() 
		{
			$('.redactor_dropdown').hide();
			this.removeClickEffect();
			this.connectOpennigEvent();
		},
		addClickEffect: function()
		{
			if (this.opts.clickClassName) 
			{
				this.el.addClass(this.opts.clickClassName);
			}			
		},
		removeClickEffect: function()
		{
			if (this.opts.clickClassName) 
			{
				this.el.removeClass(this.opts.clickClassName);
			}		
		},		
		triggerCallback: function(aCallback /*, arguments */) {
			if ( ! aCallback)
				return; // callback wasn't specified after all
			
			var callbackArguments = Array.prototype.slice.call(arguments, 1);
			return aCallback.apply(this.el[0], callbackArguments);
		}		
	}
})(jQuery)