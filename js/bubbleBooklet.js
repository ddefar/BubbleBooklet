var bubbleBooklet = function (name,config) {
  this.init(name);
};

bubbleBooklet.prototype.init = function(name) {
  this.name = name;
  this.makeBubbles(document.getElementById("target"));
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

bubbleBooklet.prototype.measureBubble = function() {
  //izracunaj visinu bubblea (onog sto je wrapano u span) izrazeno u kolicini lineheighova
};

bubbleBooklet.prototype.bubbleUp = function(bubble) {
  var neighbour = bubble.previousSibling;
  this.swapElements(neighbour, bubble);
};

bubbleBooklet.prototype.bubbleDown = function(bubble) {
  var neighbour = bubble.nextSibling;
  this.swapElements(bubble, neighbour);
};

//BACKLOG

bubbleBooklet.prototype.upOrDown = function(bubble) {
  //odluci gura li se bubble Up ili Down
};

bubbleBooklet.prototype.alignBubbles = function(bubble) {
  //poslozi layout po stranicama (vidi dosadasnji throttle)
};

bubbleBooklet.prototype.swapElements = function(obj1, obj2) {
    obj2.nextSibling === obj1
    ? obj1.parentNode.insertBefore(obj2, obj1.nextSibling)
    : obj1.parentNode.insertBefore(obj2, obj1); 
}
