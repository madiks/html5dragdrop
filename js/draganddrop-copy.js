var DragAndDrop = {};
DragAndDrop.is_drag_in = false;
DragAndDrop.getIframeElem = function (event, ui, iframe_id) {
	var elem = document.getElementById(iframe_id).contentDocument;
	//console.log(event);
	var pos = $("#"+iframe_id).offset();
	var c = ui.offset.left-pos.left,
	d = ui.offset.top-pos.top;
	var targetNode = elem.elementFromPoint(c,d);
	//console.log(targetNode);
	
	if(targetNode != null){
	    targetNode = HTMLBlockDragView.rewriteTargetData_(targetNode, c, d);

	    console.log(targetNode);

	    var top = $(targetNode).offset().top;
	    var left = $(targetNode).offset().left;
	    var height = $(targetNode).height();
	    var width = $(targetNode).width();
	    //console.log({targettop:top,cusortop:d});

	    var rate = (d - top) / height;

	    var spos = rate >= 0.5 ? 'after' : 'before';
	    return {
	      position: spos,
	      target: targetNode,
	      top: top,
	      left: left,
	      width: width,
	      height: height,
	      status: true
	    }
	}else{
	   return {
	     status: false
	   } 
	}
}

DragAndDrop.addMark = function (target) {
	var overlay = $('<div class="pattern-insertion-overlay" style="position: absolute; display:none; pointer-events: none; z-index:1000"></div>');
	$(target).append(overlay);
}

DragAndDrop.dragOver = function (event, ui, iframe_id) {
	if(this.is_drag_in){
	    console.log('over');
	    //console.log(ui);

	    var data = this.getIframeElem(event, ui, iframe_id);

	    

	    console.log(data);

	    if(data.status){
	        //console.log(data.target);
	        if (data.position == 'after') {
	        	$('.pattern-insertion-overlay').css({
	        	    'width': data.width, 
	        	    'top': data.top+2*data.height, 
	        	    'left': data.left, 
	        	    'height': '3px', 
	        	    'background-color': 
	        	    'rgb(155, 187, 89)'
	        	}).show();
	           //$(data.target).after(html_mark);
	        } else if (data.position == 'before'){
	            $('.pattern-insertion-overlay').css({
	                'width': data.width, 
	                'top': data.top+data.height-3, 
	                'left': data.left, 
	                'height': '3px', 
	                'background-color': 
	                'rgb(155, 187, 89)'
	            }).show();
	        }
	    }
	}
}



DragAndDrop.dropAction = function (event, ui, iframe_id){
    console.log(ui.draggable.context.id);
    console.log( "dropped" );

    $('.pattern-insertion-overlay').remove();

    var data = this.getIframeElem(event, ui, iframe_id);
    
    //console.log(data);

    if(data.status){
        //console.log(data.target);
        if (data.position == 'after') {
            $(data.target).after(ui.draggable.context.outerHTML);
        } else if (data.position == 'before'){
            $(data.target).before(ui.draggable.context.outerHTML);
        }
    }
   
}

window.HTMLBlockDragView = {
    rewriteTargetData_: function(a, b, c) {
        var d = this.getNearestElement_(a, b, c);
        return d
    },
    getNearestElement_: function(a, b, c) {
        return a.tagName.toLowerCase() === "html" && (a = a.querySelector("body"), !a) ? null: this.isContainer_(a) ? this.findNearestChildOf_(a, b, c) : a
    },
    isContainer_: function(a) {
        return Array.prototype.slice.call(a.children).some(function(a) {
            return this.isValidTarget_(a)
        },
        this)
    },
    isValidTarget_: function(a) {
        //if (HTMLContent.isCategory(HTMLContent.CATEGORY.PHRASING, a)) return ! 1;
        a = a.getBoundingClientRect();
        return ! a.width || !a.height ? !1 : !0
    },
    findNearestChildOf_: function(a, b, c) {
        var a = Array.prototype.slice.call(a.children),
        a = a.filter(function(a) {
            return this.isValidTarget_(a)
        },
        this),
        d = null,
        e = null;
        a.forEach(function(a) {
            var g = this.shortestDistanceToElement_(a, b, c);
            if (e === null || g < e) e = g,
            d = a
        },
        this);
        return d
    },
    shortestDistanceToElement_: function(a, b, c) {
        a = this.getPointsForMeasuringDistances_(a).map(function(a) {
            return this.computeDistance_(b, c, a[0], a[1])
        },
        this);
        return Math.min.apply(Math, a)
    },
    getPointsForMeasuringDistances_: function(a) {
        var b = a.getBoundingClientRect(),
        c = [[b.left, b.top], [b.right, b.top], [b.right, b.bottom], [b.left, b.bottom]];
        this.getInnerIntervalsFromRange_(b.left, b.right, HTMLBlockDragView.DISTANCE_BETWEEN_EDGE_POINTS_).forEach(function(a) {
            c.push([a, b.top], [a, b.bottom])
        });
        this.getInnerIntervalsFromRange_(b.top, b.bottom, HTMLBlockDragView.DISTANCE_BETWEEN_EDGE_POINTS_).forEach(function(a) {
            c.push([b.left, a], [b.right, a])
        });
        return c
    },
    getInnerIntervalsFromRange_: function(a, b, c) {
        var d = a < b ? 1 : -1,
        e = Math.abs(b - a),
        b = e / c;
        e % c !== 0 && (b = Math.floor(b) + 1, c = e / b);
        for (var e = [], f = 1; f < b; f++) e.push(a + d * f * c);
        return e
    },
    computeDistance_: function(a, b, c, d) {
        return Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2))
    }
};

HTMLBlockDragView.DISTANCE_BETWEEN_EDGE_POINTS_ = 50;
