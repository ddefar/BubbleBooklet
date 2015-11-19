
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
    me.alignBubbles($(me.bubbleWrapper));

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
  //postavi config listu selectora sto ide u bubble (atomi)
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

bubbleBooklet.prototype.previousBubble = function(bubble) {
  var _bubble = $(bubble),
      prev = _bubble.prev();

  if(prev.not('span')) {
    prev = (prev.find('span')) ? (prev.find('span')[0]) : prev;
  }
  return prev;
}

bubbleBooklet.prototype.nextBubble = function(bubble) {
  var _bubble = $(bubble),
      next = _bubble.next();

  if(next.not('span')) {
    
    next = (next.find('span')) ? (next.find('span')[0]) : next;
    
  }
  console.debug('next Bubble ', next);
  return next;
}

bubbleBooklet.prototype.bubbleUp = function(bubble) {
  var neighbour = bubble.previousSibling;
  if(neighbour)
  {
    this.swapElements(neighbour, bubble);
  }
};

// bubbleBooklet.prototype.bubbleDown = function(bubble) {
//   var neighbour = this.nextBubble(bubble);
//   if(typeof neighbour !== "undefined")
//   {
//     this.swapElements(bubble, neighbour);
//     return true;
//   }
//   return false;
// };

bubbleBooklet.prototype.bubbleDown = function(bubble) {
  var neighbour = $(bubble).next();
  if(typeof neighbour !== "undefined")
  {
    this.swapElements(bubble, neighbour[0]);
    if(typeof neighbour !== "span")
      this.alignBubbles(neighbour);
    return true;
  }
  return false;
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

bubbleBooklet.prototype.alignBubbles = function(bucket) {
  var me = this;
  bucket.find('.moving-bubble').each(function(index, bubble)
  {
      //console.debug('moving-bubble ', bubble);
      var overflow = ($(bubble).position().top) - me.bookletHeight;
      
      while( ( overflow > 0 ) && ( overflow < me.measureBubble(bubble) ) ) {
        if(me.bubbleDown(bubble)) {
          overflow = ($(bubble).position().top) - me.bookletHeight;
        } else {
          break;
        }
      }
      // while( ( overflow > 0 ) && ( overflow < me.measureBubble(bubble) ) ) {
      //   if(me.bubbleDown(bubble)) {
      //     overflow = ($(bubble).position().top) - me.bookletHeight;
      //   } else {
      //     break;
      //   }
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
    console.debug("obj1", obj1);
    console.debug("obj2", obj2);
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}
