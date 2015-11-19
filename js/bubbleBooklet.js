
var bubbleBooklet = function (name,config) {
  this.init(name);
};

bubbleBooklet.prototype.init = function(name) {
  var me = this;
  this.name = name;
  $( document ).ready(function() {
    me.bubbleWrapper = document.getElementById("booklet-inner");
    me.booklet = document.getElementById("booklet");
    me.bubbleWrapperHeight = $(me.bubbleWrapper).height();
    me.bookletHeight = $(me.booklet).height();
    me.makeBubbles(me.bubbleWrapper);
    me.alignBubbles();

    $("#nav").find("#prev").on("click", function() {
      var top = $(me.bubbleWrapper).position().top;
      if(top != 0) {
        top += me.bookletHeight;
        $(me.bubbleWrapper).css({'top' : top + 'px'});
      }
    });
    $("#nav").find("#next").on("click", function() {
      var top = $(me.bubbleWrapper).position().top - me.bookletHeight;
      if(me.bubbleWrapperHeight > -1*top)
        $(me.bubbleWrapper).css({'top' : top + 'px'});
    });
  });
};

bubbleBooklet.prototype.announce = function() {
  console.log("New booklet created " + this.name);
};

bubbleBooklet.prototype.makeBubbles = function(bucket) {
  var me  = this;
  if (bucket.children && bucket.children.length > 0) {
    [].forEach.call(bucket.children,function(child) {
      me.makeBubbles(child);
    });
  } else {
    me.blowBubble(bucket);
  }
  //za sad wrappaj svaku rijec i svaki <img> element u span (vidi initBookletContent)
};

bubbleBooklet.prototype.blowBubble = function(bucket) {
  //console.debug('blowing bubble for: ', bucket.tagName);
  if(bucket.tagName=="IMG") {
    var bubble = document.createElement('span');
    $(bubble).addClass("moving-bubble");
    var bubble_inner = bucket.cloneNode();

    bubble.appendChild(bubble_inner);
    parent = bucket.parentNode;
    parent.replaceChild(bubble,bucket);

  } else {
    text = bucket.innerHTML.replace(/(\S+\s*)/g, "<span>$1</span>");
    bucket.innerHTML = text;
  }
};

bubbleBooklet.prototype.bubbleUp = function(bubble, bubbleHeight) {
  var neighbour = bubble.previousSibling;
  if(neighbour)
  {
    this.swapElements(neighbour, bubble);
  }
};

bubbleBooklet.prototype.bubbleDown = function(bubble, neighbour) {
  var me = this;

  $(neighbour).children('span').each(function(index, childBubble)
  {
    me.swapElements(bubble, childBubble);
    
    var overflow = ($(bubble).position().top) - me.bookletHeight;
    if(overflow > me.measureBubble(bubble))
    {
      //do nothing
      return false;
    }
  });


  var overflow = ($(bubble).position().top) - this.bookletHeight;
  if( ( overflow > 0 ) && ( overflow < me.measureBubble(bubble) ) )
  {
      neighbour = neighbour.nextSibling;
      if(neighbour)
      {
        this.bubbleDown(bubble, neighbour);
      }
  }
};

bubbleBooklet.prototype.upOrDown = function(bubble, heightDifference, movingBubbleHeight) {
  //odluci gura li se bubble Up ili Down
  //console.log("height:" + bubble + ":" + $(bubble).outerHeight(true));
  // var movingBubble = $(bubble).children()[0];//wrapped in span, but its height can only be calculated from the child - like img
  // var movingBubbleHeight = $(movingBubble).outerHeight(true);
  console.log(heightDifference);
  console.log(movingBubbleHeight);
  if(heightDifference < movingBubbleHeight/2) 
  {
      this.bubbleUp(bubble, movingBubbleHeight);
  }
  else 
  {
      this.bubbleDown(bubble, movingBubbleHeight);
  }
};

bubbleBooklet.prototype.alignBubbles = function() {
  var me = this;
  ($(this.bubbleWrapper).find('.moving-bubble')).each(function(index, bubble)
  {
      console.debug('moving-bubble ', bubble);
      var neighbour = bubble.nextSibling;
      if(neighbour)
      {
        me.bubbleDown(bubble, neighbour);
      }

      // var overflow = ($(bubble).position().top) - me.bookletHeight;
      
      // while( ( overflow > 0 ) && ( overflow < me.measureBubble(bubble) ) ) {
      //   me.bubbleDown(bubble);
      //   overflow = ($(bubble).position().top) - me.bookletHeight;
      //   //console.log('overflow: ' + overflow + ', max: ' + (me.measureBubble(bubble) -10));
      // }
  });
};

bubbleBooklet.prototype.measureBubble = function(bubble) {
  if(bubble.children && bubble.children.length > 0) {
    return $(bubble.children[0]).height();//zasad samo da radi za sliku
  } else {
    return $(bubble).height();
  }
}

bubbleBooklet.prototype.swapElements = function(obj1, obj2) {
    //console.debug("obj1", obj1);
    //console.debug("obj2", obj2);
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}
