/**
 * jQuery DropDownList
 * from Redactor
 * 2013-4-25
 */
(function($){
	jQuery.fn.dropDownList = function(option)
	{
		return this.each(function()
		{
			var obj = $(this);
			if (!obj.data('dropDownList')) 
			{
				obj.data('dropDownList', new DropDownList(this, option));
			}
		})
	}
	var DropDownList = function(element, options) 
	{
		this.el = $(element);
		this.opts = $.extend({
			dropdown: 
			{
				test: 
				{
					title: '测试',
					result: '测试',
				}
			},
			clickClassName: "", //string 
			callback: null //function
		}, options);
		this.init();
	}
	DropDownList.prototype = 
	{
		init: function()
		{
			this.dropdown = this.buildDropDown();
			this.connectOpennigEvent();
		},
		connectOpennigEvent: function() 
		{
			this.el.bind('click.dropDownList', $.proxy(function(eventData)
			{
				this.showDropDown(eventData, this.dropdown)
			}, this));
		},
		disconnectOpenningEvent: function() 
		{
			this.el.unbind('.dropDownList');
		},
		buildDropDown: function() 
		{
			var dropdown = $('<div class="redactor_dropdown" style="display: none;">');
			$.each(this.opts.dropdown, $.proxy(function(i, key)
			{
				var swatch = $('<a href="javascript:void(null);" class=""></a>').html(key.title);
				$(dropdown).append(swatch);
				swatch.bind('click', $.proxy(function()
				{
					this.triggerCallback(this.opts.callback, key.result, key.title);
				}, this));
			}, this));			
			
			
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
			$(dropdown).css({ position: 'absolute', left: left + 'px', top: (top + height) + 'px' }).show();
			
			var hdlHideDropDown = $.proxy(function() { this.hideAllDropDown()}, this);
			$(document).one('click', hdlHideDropDown);			
			this.el.one('click', hdlHideDropDown);	
			
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