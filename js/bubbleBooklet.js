
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
    me.makeBubbles(me.bubbleWrapper);
    //me.alignBubbles();

    $("#nav").find("#prev").on("click", function() {
      var top = $(me.bubbleWrapper).position().top;
      if(top != 0) {
        top += $(me.booklet).height();
        $(me.bubbleWrapper).css({'top' : top + 'px'});
      }
    });
    $("#nav").find("#next").on("click", function() {
      var top = $(me.bubbleWrapper).position().top - $(me.booklet).height();
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

// bubbleBooklet.prototype.measureImageBubble = function(bubble) {
//   //morat ćemo dopustiti max jedan parent za svaki bubble -> problem izračunati ako  neki div npr. wrappa više djece i jako sporo
//   var image = $(bubble).children()[0];

//   var height = $(image).outerHeight(true);

//   return height; //return bubble height
// };

// bubbleBooklet.prototype.measureTextBubble = function(bucket) {
//   //morat ćemo dopustiti max jedan parent za svaki bubble -> problem izračunati ako  neki div npr. wrappa više djece i jako sporo
//   bubble = $(bucket).children()[0];

//   console.log(bubble);

//   var height = $(bubble).outerHeight(true);

//   return height; //return bubble height
// };

bubbleBooklet.prototype.measureBubbleTopOffset = function(bubble) {
  // console.log($(this.bubbleWrapper).offset().top);
  // console.log($(bubble).offset().top);
  var offsetTop = $(bubble).offset().top - $(this.bubbleWrapper).offset().top;
  var movingBubble = $(bubble).children()[0];//wrapped in span, but its height can only be calculated from the child - like img
  var movingBubbleHeight = $(movingBubble).outerHeight(true);
  var bottomOfMovingWrapper = offsetTop + movingBubbleHeight;
  // console.log(bottomOfMovingWrapper);

  // console.log(bottomOfMovingWrapper);
  // console.log(bottomOfBubbleWrapper);
  // console.log($(bubble).offset().top);
  // console.log($(this.bubbleWrapper).offset().top);
  if(bottomOfMovingWrapper > this.bubbleWrapperHeight)
  {
    var heightDifference = bottomOfMovingWrapper - this.bubbleWrapperHeight;

    this.upOrDown(bubble, heightDifference, movingBubbleHeight);
  }
};

// bubbleBooklet.prototype.bubbleUp = function(bubble) {
//   var neighbour = $(bubble).prev('span')[0];
//   console.debug('bubbleUp ',neighbour);
//   this.swapElements(neighbour, bubble);
// };

// bubbleBooklet.prototype.bubbleDown = function(bubble) {
//   var neighbour = $(bubble).next('span')[0];
//   console.debug('bubbleDown', neighbour);
//   this.swapElements(bubble, neighbour);

bubbleBooklet.prototype.bubbleUp = function(bubble, bubbleHeight) {
  var neighbour = bubble.previousSibling;
  if(neighbour)
  {
    this.findMovingBubblePosition(neighbour, bubbleHeight, bubble);
  }
  console.log("up");
  //else moving bubble too large for screen
  //console.debug(neighbour);
  //this.swapElements(neighbour, bubble);
};

bubbleBooklet.prototype.bubbleDown = function(bubble, bubbleHeight) {
  var neighbour = bubble.nextSibling;
  console.log(neighbour);
  if(neighbour)
  {
    this.findMovingBubblePosition(neighbour, bubbleHeight, bubble);
  }
  console.log("down");
  //else image is alone on the next page -> call bubble Up?
};

bubbleBooklet.prototype.findMovingBubblePosition = function(neighbour, bubbleHeight, bubble) {

  var textHeight = this.bubbleWrapperHeight - bubbleHeight;
  var newParagraph = document.createElement('p');
  $(newParagraph).addClass("new");

  [].reverse.call($(neighbour).children('span')).each(function(index, textBubble) {
      $(newParagraph).append(textBubble);

      if($(neighbour).outerHeight(true) < textHeight)
      {
        return false;
      }
  })

  this.appendMovingBubble(bubble, newParagraph);
};

bubbleBooklet.prototype.appendMovingBubble = function(bubble, newParagraph) {
  $(bubble).after(newParagraph);
  //$(bubble).removeClass('moving-bubble');
}

//BACKLOG

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
  //poslozi layout po stranicama (vidi dosadasnji throttle)
  var me = this;
  ($(this.bubbleWrapper).find('.moving-bubble')).each(function(index, bubble)
  {
      me.measureBubbleTopOffset(bubble);
  });
};

bubbleBooklet.prototype.swapElements = function(obj1, obj2) {
    //console.debug("obj1", obj1);
    //console.debug("obj2", obj2);
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}

// bubbleBooklet.prototype.getNextBubbleSibling = function(bubble) {
//   var nextSibling = bubble.nextSibling;
//   if(!nextSibling)
//   {
//     nextSibling = $(bubble).parent().next('p').children()[0];
//     nextSibling = $(nextSibling)[0];


//   }
//   return nextSibling;
// }

// bubbleBooklet.prototype.getPreviousBubbleSibling = function(bubble) {
//   var previousSibling = bubble.previousSibling;

//   if(!previousSibling)
//   {
//     previousSiblingParent = $(bubble).parent().next('p');
//     var length = $(previousSiblingParent).length;
//     previousSibling = $(previousSiblingParent).children()[length-1];
//     previousSibling = $(previousSibling)[0];

//     console.log(previousSibling);
//   }

//   return previousSibling;
// }
