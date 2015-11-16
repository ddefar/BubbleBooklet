
var bubbleBooklet = function (name,config) {
  this.init(name);
};

bubbleBooklet.prototype.init = function(name) {
  this.name = name;
  this.bubbleWrapper = document.getElementById("booklet-inner");
  this.bubbleWrapperHeight = $(this.bubbleWrapper).height();
  this.makeBubbles(this.bubbleWrapper);
  //this.alignBubbles();
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
  console.debug('blowing bubble for: ', bucket.tagName);
  if(bucket.tagName=="IMG") {
    var bubble = document.createElement('span');
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

  var offsetTop = $(bubble).offset().top - $(this.bubbleWrapper).offset().top
  if(offsetTop > this.bubbleWrapperHeight && offsetTop < 500)
  {
    var heightDifference = offsetTop - this.bubbleWrapperHeight;
    this.upOrDown(bubble, heightDifference);
  }
};

bubbleBooklet.prototype.bubbleUp = function(bubble) {
  var neighbour = $(bubble).prev('span')[0];
  console.debug('bubbleUp ',neighbour);
  this.swapElements(neighbour, bubble);
};

bubbleBooklet.prototype.bubbleDown = function(bubble) {
  var neighbour = $(bubble).next('span')[0];
  console.debug('bubbleDown', neighbour);
  this.swapElements(bubble, neighbour);
};

//BACKLOG

bubbleBooklet.prototype.upOrDown = function(bubble, heightDifference) {
  //odluci gura li se bubble Up ili Down
  console.log("height:" + bubble + ":" + $(bubble).outerHeight(true));
  if(heightDifference < $(bubble).outerHeight(true))
  {
      this.bubbleUp(bubble);
  }
  else
  {
      this.bubbleDown(bubble);
  }
};

bubbleBooklet.prototype.alignBubbles = function() {
  //poslozi layout po stranicama (vidi dosadasnji throttle)
  var me = this;
  ($(this.bubbleWrapper).find('span')).each(function(index, bubble)
  {
      me.measureBubbleTopOffset(bubble);
  });
};

bubbleBooklet.prototype.swapElements = function(obj1, obj2) {
    console.debug("obj1", obj1);
    console.debug("obj2", obj2);
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}

bubbleBooklet.prototype.getNextBubbleSibling = function(bubble) {
  var nextSibling = bubble.nextSibling;

  if(!nextSibling)
  {
    nextSibling = $(bubble).parent().next();
  }
  return nextSibling;
}

bubbleBooklet.prototype.getPreviousBubbleSibling = function(bubble) {
  var previousSibling = bubble.previousSibling;

  if(!previousSibling)
  {
    previousSibling = $(bubble.parentNode.nextSibling).find('span');
  }
  return previousSibling;
}
