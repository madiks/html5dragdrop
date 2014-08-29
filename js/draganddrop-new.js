var DragAndDrop = {};
DragAndDrop.is_drag_in = false;
DragAndDrop.forbidden_tag = ['tr','td','th','tbody','i','b','sup'];
DragAndDrop.getIframeElem = function (event, ui, iframe_id) {
	var elem = document.getElementById(iframe_id).contentDocument;
	//console.log(event);
	var pos = $("#"+iframe_id).offset();
	var c = ui.offset.left,
	d = ui.offset.top-pos.top;
	var targetNode = elem.elementFromPoint(c,d);
    targetNode = this.filterHtmlTag(targetNode);
	//console.log(targetNode);
	if(targetNode != null){
	    targetNode = HTMLBlockDragView.rewriteTargetData_(targetNode, c, d);

	    //console.log(targetNode);

	    var top = $(targetNode).offset().top;
	    var left = $(targetNode).offset().left+pos.left;
	    var height = $(targetNode).height();
        var tagName = targetNode.tagName.toLowerCase();
        var width = $(targetNode).outerWidth();
	    //console.log({targettop:top,cusortop:d});
	    var rate = (d - top) / height;

	    var spos = rate >= 0.5 ? 'after' : 'before';

        var top = $(targetNode).offset().top+pos.top;

       return {
         position: spos,
         height: height,
         target: targetNode,
         tagName: tagName,
         top: top,
         left: left,
         width: width,
         status: true
       }
	}else{
	   return {
	     status: false
	   } 
	}
}

DragAndDrop.filterHtmlTag = function (tag) {
    var tagc = tag;
    var tagName = tag.tagName.toLowerCase();
    while($.inArray(tagName, this.forbidden_tag) !== -1){
        tagc = tagc.parentNode;
        //console.log('tagc:');
        //console.log(tagc);
        if(tagc){
            tagName = tagc.tagName.toLowerCase();
        }
        //console.log(tagName);
       
    }
    return tagc;
}

DragAndDrop.getElemByPos = function(event , iframe_id){
    var elem = document.getElementById(iframe_id).contentDocument;
    //console.log(event);
    var pos = $("#"+iframe_id).offset();
    var c = event.x,
    d = event.y;
    var targetNode = elem.elementFromPoint(c,d);

    //console.log(targetNode);

    targetNode = this.filterHtmlTag(targetNode);
    //console.log('after filterHtmlTag:');
    //console.log(targetNode);
    
    if(targetNode != null ){
        targetNode = HTMLBlockDragView.rewriteTargetData_(targetNode, c, d);

        //console.log(targetNode);

        var top = $(targetNode).offset().top+pos.top;
        var left = $(targetNode).offset().left+pos.left;
        var height = $(targetNode).height();
        var width = $(targetNode).outerWidth();
        var tagName = targetNode.tagName.toLowerCase();
        return {
          top: top,
          left: left,
          height: height,
          width: width,
          tagName: tagName,
          target: targetNode,
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
		$(".ui-draggable-dragging").show();
	    //console.log('dragover');
        $('.pattern-insertion-overlay').hide();
	    var data = this.getIframeElem(event, ui, iframe_id);

	    //var html_mark = "<hr id='mark_position' class='divider_mark_position_abcd' style='border-bottom: 3px solid rgb(155, 187, 89)' >";

	    console.log(data);

	    if(data.status){
            if(data.tagName === "body"){
                $('.pattern-insertion-overlay').css({
                        'width': data.width, 
                        'top': data.top, 
                        'left': data.left, 
                        'height': '3px', 
                        'background-color': 
                        'rgb(155, 187, 89)'
                }).show();
            }else{
                if (data.position == 'after') {
                  $('.pattern-insertion-overlay').css({
                        'width': data.width, 
                        'top': data.top+data.height+1, 
                        'left': data.left, 
                        'height': '3px', 
                        'background-color': 
                        'rgb(155, 187, 89)'
                    }).show();
                } else if (data.position == 'before'){
                    $('.pattern-insertion-overlay').css({
                        'width': data.width, 
                        'top': data.top-1, 
                        'left': data.left, 
                        'height': '3px', 
                        'background-color': 
                        'rgb(155, 187, 89)'
                    }).show();
                }
            }
	    }
	}else{
		$(".ui-draggable-dragging").hide();
	}
}



DragAndDrop.dropAction = function (event, ui, iframe_id){
    //console.log(ui.draggable.context.id);
    //console.log( "dropped" );

    $('.pattern-insertion-overlay').hide();

    var data = this.getIframeElem(event, ui, iframe_id);
    
    //console.log(data);

    if(data.status){
        //console.log(data.target);
        if(data.tagName === "body"){
            $(data.target).append(ui.draggable.context.innerHTML);
        }else{
            if (data.position == 'after') {
                $(data.target).after(ui.draggable.context.innerHTML);
            } else if (data.position == 'before'){
                $(data.target).before(ui.draggable.context.innerHTML);
            }
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
        //过滤标签
        if ($.inArray(a.tagName.toLowerCase(), DragAndDrop.forbidden_tag) !== -1) {
            return 0;
        }
        a = a.getBoundingClientRect();
        return ! a.width || !a.height ? !1 : !0
    },
    findNearestChildOf_: function(a, b, c) {
        //将传入元素的子节点压入数组
        //console.log(a);
        var temp = a;
        var a = Array.prototype.slice.call(a.children);

        if(temp.tagName.toLowerCase() !== "body"){
            a.push(temp);
        }
        
        //console.log(a);
        //过滤数组
        a = a.filter(function(a) {
            return this.isValidTarget_(a)
        },
        this);
        //console.log(a);
        var d = null,
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
