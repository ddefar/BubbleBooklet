var bubbleWrapper;

var bubbleBooklet = function (name,config) {
  this.init(name);
};

bubbleBooklet.prototype.init = function(name) {
  this.name = name;
  bubbleWrapper = document.getElementById("target");
  this.makeBubbles(bubbleWrapper);
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
  //opcenitije: rekurzija po DOM elementima dok ne dodjes do neceg sto ne sadrzi child elemente - ako
  //sadrzi text, wrappaj svaku rijec u span, ako ne sadrzi tekst (to je slika or sth) - wrappaj njega direktno
};

bubbleBooklet.prototype.blowBubble = function(bucket) {
  console.debug('blowing bubble for: ', bucket.tagName);
  if(bucket.tagName=="IMG") {
    var bubble = document.createElement('span');
    var bubble_inner = bucket.cloneNode();

    bubble.appendChild(bubble_inner);
    parent = bucket.parentNode;
    parent.replaceChild(bubble,bucket);

    height = this.measureImageBubble(bubble);
    console.log(height);

  } else {
    text = bucket.innerHTML.replace(/(\S+\s*)/g, "<span>$1</span>");
    bucket.innerHTML = text;

    height = this.measureTextBubble(bucket);
    //console.log(height);
  }
};

// bubbleBooklet.prototype.measureImageBubble = function(bubble) {
//   //morat ćemo dopustiti max jedan parent za svaki bubble -> problem izračunati ako  neki div npr. wrappa više djece i jako
//   var image = $(bubble).children()[0];

//   var height = $(image).outerHeight(true);

//   return height; //return bubble height
// };

// bubbleBooklet.prototype.measureTextBubble = function(bucket) {
//   //morat ćemo dopustiti max jedan parent za svaki bubble -> problem izračunati ako  neki div npr. wrappa više djece i jako
//   bubble = $(bucket).children()[0];

//   console.log(bubble);

//   var height = $(bubble).outerHeight(true);

//   return height; //return bubble height
// };

bubbleBooklet.prototype.bubbleUp = function(bubble) {
  //gurni bubble jedno mjesto "prema gore" (smanji index za 1)
};

bubbleBooklet.prototype.bubbleDown = function(bubble) {
  //gurni bubble jedno mjesto "prema dolje" (smanji index za 1)
};

//BACKLOG

bubbleBooklet.prototype.upOrDown = function(bubble) {
  //odluci gura li se bubble Up ili Down
};

bubbleBooklet.prototype.alignBubbles = function(bubble) {
  //poslozi layout po stranicama (vidi dosadasnji throttle)
};
