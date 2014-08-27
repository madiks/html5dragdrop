function dragdrop(opts) 
{
	//option
	this.dragElements = null;
	this.dropElements = null;

	this.init = function()
	{
		this.dragElements = opts.dragElements;
		this.dropElements = opts.dropElements;

		
		this.bindDrop();
		this.bindDrag();

	};

	this.bindDrag = function()
	{
		var that = this;
		this.dragElements.attr('draggable', true);

		this.dragElements.on('dragstart', function(event) {

            var e = event.originalEvent;
            e.dataTransfer.setData("Text", $(event.target).data('id'));

            var overlay = $('<div class="pattern-insertion-overlay" style="position: absolute; display:none; pointer-events: none; z-index:100000"></div>');
            $('body').append(overlay);

		});

		this.dragElements.on('dragend', function(event) {
			$('.pattern-insertion-overlay').remove();
		});		

		this.dragElements.on('drag', function(event) {
            var e = event.originalEvent;
            var data = that.normalizeTargetData(e);
            var position = that.getInsertionPosition(data);
            that.drawInsertionLineOverlay(data, position);
		});		

	};

	this.bindDrop = function()
	{
		var that = this;
		this.dropElements.on('drop', function(event) {
          var e = event.originalEvent;
          var id = e.dataTransfer.getData("Text");

          var data = that.normalizeTargetData(e);
          var position = that.getInsertionPosition(data);

          // return false;

          if (position == 'after') {
              $(data.target).after($('#' + id).val());
          } else if (position == 'before')
          {
              $(data.target).before($('#' + id).val());
          }

          $('.pattern-insertion-overlay').remove();
          event.preventDefault();
		});


	};


	this.normalizeTargetData = function(e)
	{
	  var x = e.pageX;
	  var y = e.pageY;
	  var targetNode = document.elementFromPoint(x, y);

	  var that = this;
	  if (targetNode.tagName.toLowerCase() === 'div' && targetNode.id === 'redactor-content') {
	    var min = null;
	    $.each(targetNode.children, function(key, node) {
	        // console.log(node.children);
	        var points = that.getPointsForMeasuringDistances(node);
	        $.each(points, function(k, point){
	          var distance = that.computeDistance(x, y, point[0], point[1]);
	          if (min === null || min > distance) {
	            min = distance, targetNode = node;
	          }
	        })
	    });
	  }
	  // console.log(targetNode);
	  var offset = $(targetNode).offset();
	  return {
	    left: x,
	    top: y,
	    target: targetNode
	  }

	};

	this.getInsertionPosition = function(data)
	  {
	    var targetElement = $(data.target);

	    var top = targetElement.offset().top;
	    var height = targetElement.height();

	    var rate = (data.top - top) / height;

	    return rate >= 0.5 ? 'after' : 'before';
	  }


	  this.drawInsertionLineOverlay = function(data, position)
	  {

	    var top, left, width,
	        targetElement = $(data.target);
	    if (position == 'after') 
	    {
	      top = targetElement.offset().top + targetElement.height();
	      left = targetElement.offset().left;
	      width = targetElement.width();
	    } 
	    else if (position == 'before') 
	    {
	      top = targetElement.offset().top;
	      left = targetElement.offset().left;
	      width = targetElement.width();
	    }

	    $('.pattern-insertion-overlay').css({
	        'width': width, 
	        'top': top, 
	        'left': left, 
	        'height': '5px', 
	        'background-color': 
	        '#00ff00'
	    }).show();
	    
	  }

	  this.getPointsForMeasuringDistances = function(a) {
	    var b = a.getBoundingClientRect(),
	        c = [
	            [b.left, b.top],
	            [b.right,
	                b.top
	            ],
	            [b.right, b.bottom],
	            [b.left, b.bottom]
	        ];
	    return c
	  }

	  this.computeDistance = function(a, b, c, d) {
	    return Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2))
	  }


	if (opts) {
		this.init();
	}


}