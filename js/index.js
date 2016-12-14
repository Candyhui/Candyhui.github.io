$(function(){
	/*设置作品集div.slider的高度*/
	function sliderHeightReset(){
		$("div.slider").css("height",$(".item.show").css("height"));
	}
	/*作品集向左轮播一次函数*/
	function slide_left(){
		if(timer!==null){
			clearInterval(timer);
			timer=null;
		}
		var parent = $(".slider");
		var node1,node2,node3;
		node1=parent.find(".show").removeClass("item-1");
		node1.removeClass("show");
		node1.addClass("item-0");
		node2=parent.find(".item-2").removeClass("item-2");
		node2.addClass("item-1");
		node2.addClass("show");
		node3=parent.find(".item-3").css("display","block");
		node3.removeClass("item-3");
		node3.addClass("item-2");
		setTimeout(function(){
			node1.css("display","none");
			node1.removeClass("item-0");
			node1.addClass("item-3");
		},300);
		sliderHeightReset();
		/*再次开启定时器*/
		timer = setInterval(slide_left,3000);	
	}
	/*作品集向右轮播一次函数*/
	function slide_right(){
		if(timer!==null){
			clearInterval(timer);
			timer=null;
		}
		var parent = $(".slider");
		var node1,node2,node3;
		node3=parent.find(".item-3").css("display","none");
		node3.removeClass("item-3");
		node3.addClass("item-0");
		setTimeout(function(){
			node3.css("z-index","8");
			node3.css("display","block");
			node2=parent.find(".item-2").removeClass("item-2");
			node2.css("z-index","10");
			node2.addClass("item-3");
			node1=parent.find(".item-1").removeClass("item-1");
			node1.css("z-index","9");
			node1.addClass("item-2");
			node1.removeClass("show");
			node3.removeClass("item-0");
			node3.addClass("item-1");
			node3.addClass("show");
		},300);
		sliderHeightReset();
		/*再次开启定时器*/
		timer = setInterval(slide_left,3000);		
	}
	/*页面加载先初始化高度*/
	sliderHeightReset();
	/*监听作品集slide的按钮点击事件*/
	$(".arrow.prev").click(function(){
		slide_left();
	});
	$(".arrow.next").click(function(){
		slide_right();
	});
	/*监听作品集是否有鼠标移上*/
	$(".item").mouseenter(function(){
		if(timer!==null){
			clearInterval(timer);
			timer=null;
		}
		$(".item .mask").addClass("out");
	});
	$(".item").mouseleave(function(){
		timer = setInterval(slide_left,3000);
		$(".item .mask").removeClass("out");
	});
	/*监听社交图标的鼠标hover事件*/
	$(".social.icon a").mouseover(function(e){
		var target=e.target.parentNode;
		$(".social.detail").html(target.getAttribute("descript"));
	});
	/*开启定时器，每隔一定时间轮播*/
	var timer = setInterval(slide_left,3000);
})
		//H5点击特效
	svg2.onclick =function(e){
	   var x = e.offsetX;
		 var y = e.offsetY;
		 var r =document.createElementNS('http://www.w3.org/2000/svg','circle');
     r.setAttribute("cx",x);
		 r.setAttribute("cy",y);
     r.setAttribute("r",25);
     r.setAttribute("fill",rc(0,255));
		 r.setAttribute("opacity",1);
		 var timer = setInterval(function(){
		 var r1=parseInt(r.getAttribute("r"));
		 r1+=2;
		 var o=parseFloat(r.getAttribute("opacity"));
		 o-=0.05;
     r.setAttribute("r",r1);
		 r.setAttribute("opacity",o);
     
		 if(o<=0){
		  clearInterval(timer);
			r.parentNode.removeChild(r);
		 }
		 },50);
	  svg2.appendChild(r);
		
	 }  
	 /**随机色函数**/
	  function rn(min,max){
    return Math.floor( Math.random()*(max-min)+min );
  }
	
  function rc(min,max){
    var r = rn(min,max);
    var g = rn(min,max);
    var b = rn(min,max);
    return `rgb(${r},${g},${b})`;
  }