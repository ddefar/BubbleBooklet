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
	if (bucket.firstChild) {
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
  	//bubble.appendChild(bucket.cloneNode());
  	bubble.appendChild(bubble_inner);
  	console.debug(bucket.cloneNode());
  	console.debug(bubble);
  	console.debug(bucket.parentElement);
  	
  	bucket.parentNode.replaceChild(bubble,bucket)
  } else {
  	bucket.html().replace(/(\S+\s*)/g, "<span>$1</span>");
  }
};

bubbleBooklet.prototype.measureBubble = function() {
  //izracunaj visinu bubblea (onog sto je wrapano u span) izrazeno u kolicini lineheighova
};

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