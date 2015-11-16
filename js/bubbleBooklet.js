
var bubbleBooklet = function (name,config) {
  this.init(name);
};

bubbleBooklet.prototype.init = function(name) {
  this.name = name;
  this.bubbleWrapper = document.getElementById("target");
  this.bubbleWrapperHeight = $(this.bubbleWrapper).height();
  this.makeBubbles(this.bubbleWrapper);
  this.alignBubbles();
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
  //ova funkcija ne valja > uvijek pomiče gore
  var offsetTop = $(bubble).offset().top - $(this.bubbleWrapper).offset().top
  // console.log($(bubble).offset().top);
  // console.log($(this.bubbleWrapper).offset().top);
  if(offsetTop > this.bubbleWrapperHeight && offsetTop < 550)
  {
    var heightDifference = offsetTop - this.bubbleWrapperHeight;
    //console.log(heightDifference);
    this.upOrDown(bubble, heightDifference);
  }

};

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
}

//BACKLOG

bubbleBooklet.prototype.upOrDown = function(bubble, heightDifference) {
  //odluci gura li se bubble Up ili Down
  //console.log("height:" + bubble + ":" + $(bubble).outerHeight(true));
  // if($(bubble).hasClass("moving-bubble"))//npr. img
  // {
    var movingBubble = $(bubble).children()[0];//wrapped in span, but its height can only be calculated from the child - like img
    var movingBubbleHeight = $(movingBubble).outerHeight(true);
    console.log(heightDifference);
    if(heightDifference < movingBubbleHeight) {
        this.bubbleUp(bubble, movingBubbleHeight);
    }
    else {
        this.bubbleDown(bubble, movingBubbleHeight);
    }
  // }
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
