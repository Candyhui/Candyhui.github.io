/*******导航栏，运用hover***************/
/*	$('.nav a').click(function(e){
				e.preventDefault();
				$(this).parent().addClass('active').siblings('.active').removeClass('active');
			});*/
$('.nav > li').mouseenter(function(){
	$(this).addClass('active').siblings('.active').removeClass('active');
	$(this).children('.dropdown').slideDown(300);
});
$('.nav > li').mouseleave(function(){
	$(this).addClass('active').siblings('.active').removeClass('active');
	$(this).children('.dropdown').slideUp(300);
});
// $('.nav > li').hover(function(){
// 	$(this).addClass('active').siblings('.active').removeClass('active');
// 	$(this).children('.dropdown').slideDown(300);
// 	}, 
// 	function(){
// 		$(this).addClass('active').siblings('.active').removeClass('active');

// 		$(this).children('.dropdown').slideUp(300);
// });



/*轮播数组*****自定义*/
var imgs=[
  {"i":0,"img":"images/img01.jpg"},
  {"i":1,"img":"images/img02.jpg"},
  {"i":2,"img":"images/img03.jpg"},
  {"i":3,"img":"images/img04.jpg"},
  {"i":4,"img":"images/img02.jpg"},
];
var slider={
	LIWIDTH:0,
	$parent:null,
	$imgs:null,
	$indexs:null,
	DURATION:1000,
	WAIT:3000,
	timer:null,
	init:function($parent){
		this.$parent=$parent;
		this.$parent.addClass("slider");
		this.$imgs=$("<ul class='imgs'><a href='#'></a></ul>");
		this.$indexs=$("<ul class='indexs'><a href='#'></a></ul>");
		this.$parent.append(this.$imgs);
		this.$parent.append(this.$indexs);
		this.LIWIDTH=parseFloat(
			this.$parent.css("width")
		);
		this.$imgs.css(
			"width",imgs.length*this.LIWIDTH
		);
		this.updateView();
		this.myBind();
		this.autoMove();
	},
	myBind:function(){
		this.$indexs.on("mouseover","li",this,
		  function(e){
				var $this=$(this);
				if(!$this.hasClass("hover")){
					e.data.move(
						$this.html()
						 -$this.siblings(".hover").html()	
					);
				}
			}
		);
		this.$parent.hover(
			function(){
				clearTimeout(this.timer);
				this.timer=null;
				this.canAuto=false;
			}.bind(this),
			function(){
				this.canAuto=true;
				console.log(this.canAuto);
				this.autoMove();
			}.bind(this)
		)
	},
	autoMove:function(){
		this.timer=setTimeout(
			this.move.bind(this,1),this.WAIT	
		);
	},
	move:function(n){
		this.$imgs.stop(true);
		if(n>0){
			this.$imgs.animate(
				{left:-n*this.LIWIDTH},
				this.DURATION,
				this.changeImgs.bind(this,n)
			);
		}else{
			this.changeImgs(n);
			this.$imgs.animate({left:0}, this.DURATION);
		}
	},
	changeImgs:function(n){
		if(n>0){
			imgs=imgs.concat(imgs.splice(0,n));
			this.updateView();
			this.$imgs.css("left",0);
		}else{
			n*=-1;
			imgs=imgs.splice(imgs.length-(n),n).concat(imgs);
			this.updateView();
			var left=parseFloat(
				this.$imgs.css("left")
			)-n*this.LIWIDTH;
			this.$imgs.css("left",left);
		}
		if(this.canAuto)
			this.autoMove();
	},
	updateView:function(){
		for(var i=0,liImgs="",liIdxs="";
				i<imgs.length;
				i++){
			liImgs+="<li><img src='"+imgs[i].img+"'></li>"
			liIdxs+="<li>"+(i+1)+"</li>"
		}
		this.$imgs.html(liImgs);
		this.$indexs.html(liIdxs);
		this.$indexs.children("li:eq("+imgs[0].i+")").addClass("hover");
	},
}
$.fn.slider=function(){
	slider.init(this);
}




