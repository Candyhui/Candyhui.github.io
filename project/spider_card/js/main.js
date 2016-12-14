var path={
	"0":"img/back.jpg",
	"1":"img/1.jpg",
	"2":"img/2.jpg",
	"3":"img/3.jpg",
	"4":"img/4.jpg",
	"5":"img/5.jpg",
	"6":"img/6.jpg",
	"7":"img/7.jpg",
	"8":"img/8.jpg",
	"9":"img/9.jpg",
	"10":"img/10.jpg",
	"11":"img/11.jpg",
	"12":"img/12.jpg",
	"13":"img/13.jpg"
};
var game={
	OFFSETX:0,//纸牌区域左上角距离屏幕左侧的距离
	OFFSETY:0,//纸牌区域左上角距离屏幕顶部的距离
	CARDWIDTH:0,//纸牌的宽度会根据屏幕的大小自适应
	CARDHEIGHT:0,//纸牌的高度
	CARDSPACEX:0,//纸牌横向间距
	//offX:0,//触发事件时鼠标距离元素左侧的距离
	offY:0,//触发事件时鼠标距离元素顶部的距离
	initX:0,//拖拽开始前的初始left位置
	initY:0,//拖拽开始前的初始top位置
	SPACEY:30,//同一列正面朝上的纸牌的top偏移量
	data1:new Array(),//排在上方用户可以移动的纸牌数组
	data2:new Array(),//叠在下方等待用户发牌的纸牌数组
	enableDrag:false,//记录纸牌是否可拖拽
	isGroup:false,//判断是否为多张一起拖拽
	dealState:0,//1表示正在发牌
	SCORE:500,//初始得分为500分
	MOVETIMES:0,//初始移牌数为0
	init:function(){
		/*初始化纸牌宽度以及列间距*/
		this.init_CARDWIDTH();
		/*初始化OFFSET*/
		this.init_OFFSET();
		/*先初始化data1和data2数组*/
		this.init_dataArr();
		/*画出初始化纸牌*/
		this.init_View();
		/*初始化得分和移牌数*/
		this.SCORE=500;
		this.MOVETIMES=0;
		this.setScoreAndMoveTimes();
		/*绑定事件*/
		this.events_bind();
	},
	setScoreAndMoveTimes:function(){
		score.innerHTML=this.SCORE;
		moveTimes.innerHTML=this.MOVETIMES;
	},
	init_CARDWIDTH:function(){
		if(window.screen.width>=1280&&window.screen.width<1440){
			this.CARDWIDTH=100;
			this.CARDHEIGHT=135;
			this.CARDSPACEX=10;
		}else if(window.screen.width>=1440){
			this.CARDWIDTH=115;
			this.CARDHEIGHT=154;
			this.CARDSPACEX=10;
		}else{	
			this.CARDWIDTH=80;
			this.CARDHEIGHT=108;
			this.CARDSPACEX=10;
		}
	},
	init_OFFSET:function(){
		var main = document.querySelector("#main");
		this.OFFSETX = main.offsetLeft;
		this.OFFSETY = main.offsetTop;
	},
	init_View:function(){
		/* 初始化拖拽区 */
		this.init_dragArea();
		/* 初始化发牌区 */
		this.init_dealArea();
		/* 初始化纸牌收集区域 */
		this.init_colleArea();
	},
	getDomElement:function(i){
		var node=document.querySelector("#col"+i+">"+"ul");
		return node;
	},
	init_colleArea:function(){
		var colleArea=document.querySelector("ul.colle_area");
		colleArea.innerHTML="";
	},
	init_dragArea:function(){
		/*先将拖拽区域清空*/
		var ulList=document.querySelectorAll("li.col>ul");
		for(var k=0;k<ulList.length;k++){
			ulList[k].innerHTML="";
		}
		for(var i=0;i<10;i++){
			var node=this.getDomElement(i);
			var docFrag=document.createDocumentFragment();
			for(var j=0;j<this.data1[i].length;j++){
				var img=document.createElement("img");
				var imgPath=path[0];
				if(j==this.data1[i].length-1){
					imgPath=path[this.data1[i][j]];
				}
				img.setAttribute("src",imgPath);
				var li=document.createElement("li");
				li.setAttribute("id","card"+i+j);
				li.style.top=j*this.CARDSPACEX+"px";
				li.style.left=0+"px";
				li.appendChild(img);
				docFrag.appendChild(li);
			}
			node.appendChild(docFrag);
		}
	},
	getDivWH:function(dealArea){
		var h=0;
		if(window.screen.width>=1280&&window.screen.width<1440){
			// w=100;
			h=135;
		}else if(window.screen.width>=1440){
			// w=115;
			h=154;
		}else{
			// w=80;
			h=108;
		}
		var off=parseInt(dealArea.lastChild.style.left);
		var w=main.clientWidth-off;
		return new Array(w,h);
	},
	// changeDivWH:function(){
	// 	// var ww=$(window).width();
	// 	var off=parseInt($("ul.deal_area li").last().css("right"));
	// 	var width=this.getDivWH()[0]+off+"px";
	// 	var height=this.getDivWH()[1]+"px";
	// 	// console.log(that.getDivWH);
	// 	$("ul.deal_area>div")[0].style.width=width;
	// 	$("ul.deal_area>div")[0].style.height=height;
	// },
	getDealIndex:function(node){
		var temp=node.getAttribute("id").slice(1);
		var i1 = temp.slice(0,1);
		var i2 = temp.slice(1);
		return [parseInt(i1),parseInt(i2)];
	},
	sleep:function(millis){
		var now = new Date();
		var exitTime = now.getTime() + millis;
		while(true){
			now = new Date();
			// var a=now.getTime();
			if(now.getTime()>exitTime){
				return;
			}
		}
	},
	dealCards:function(node){
		/*正在发牌的时候是不允许拖拽纸牌的*/
		this.dealState=1;
		/*表示第几次发牌*/
		var times=this.getDealIndex(node)[0];
		/*获取node下所有的待发纸牌，将其放到拖拽区域*/	
		var cardList=document.querySelectorAll(".deal"+times);
		for(var i=0;i<cardList.length;i++){
			/*获取拖拽区域的对应列，并获取最后一张牌的top值*/
			var colList=document.getElementById("col"+i).firstChild;
			if(colList.lastChild===null){
				var topOff=0;
				cardList[i].style.top=topOff+"px";
			}else{
				var topOff=parseFloat(colList.lastChild.style.top);	
				cardList[i].style.top=this.SPACEY+topOff+"px";
			}	
			// console.log(topOff);
			/*修改当前元素的img,top,left值*/
			cardList[i].firstChild.src=path[this.data2[times][i]];
			cardList[i].style.left=i*(this.CARDWIDTH+this.CARDSPACEX)+1+"px";	
			cardList[i].style.transition="all .3s linear "+"0."+i+"s";
			/*延迟一段时间执行代码，将当前元素加到上面的列末尾*/
			var delay=0;
			function append_card(){
				// if(delay==9){
				// 	/*发牌结束将状态改回正常*/
				// 	this.dealState=0;
				// }
				// console.log(delay);
				colList=document.getElementById("col"+delay).firstChild;
				var length=colList.querySelectorAll("li").length;
				colList.appendChild(cardList[delay]);
				var colLast=colList.lastChild;
				colLast.setAttribute("id","card"+delay+length);
				colLast.removeAttribute("class");
				colLast.style.left=0+"px";
				colLast.style.transition="";
				delay++;
			}
			setTimeout(append_card,1201);			
		}
		/*发牌结束，将data2对应的部分添加到data1*/
		var dealArr=this.data2[times];
		for(var j=9;j>=0;j--){
			this.data1[j]=this.data1[j].concat(dealArr.pop());
		}
		// this.data2.shift();
		/*发牌结束将状态改回正常*/
		var that=this;
		setTimeout(function(){
			that.dealState=0;
		},1202);	
	},
	addDivForDealArea:function(){
		/*为发牌区域添加一个div包裹*/
		var dealArea = document.querySelector("ul.deal_area");
		var off=parseInt(dealArea.lastChild.style.left);
		var div = document.createElement("div");
		div.style.position="absolute";
		div.style.bottom="0px";
		div.style.right="0px";
		div.style.width=this.getDivWH(dealArea)[0]+"px";
		div.style.height=this.getDivWH(dealArea)[1]+"px";
		dealArea.appendChild(div);
		/*remains:为当前窗口添加一个监听大小变化的事件*/
		// var that=this;
		// $(window).bind("resize",that.changeDivWH);
		/*为div添加鼠标事件*/
		div.onmouseover=function(e){
			e.target.className="divhover";
		};
		div.onmouseout=function(e){
			e.target.className="";		
		};
		div.onclick=function(e){
			if(this.dealState===0){
				var target=e.target;
				var prev=target.previousElementSibling;
				if(prev!==null){
					this.dealCards(prev);	
				}	
			}
		}.bind(this);	
	},
	init_dealArea:function(){
		/*先将发牌区域清空*/
		var node=document.querySelector("ul.deal_area");
		node.innerHTML="";
		for(var i=4;i>=0;i--){
			var docFrag=document.createDocumentFragment();
			for(var j=0;j<10;j++){
				var img=document.createElement("img");
				var imgPath=path[0];
				img.setAttribute("src",imgPath);
				var li=document.createElement("li");
				li.setAttribute("id","c"+i+j);
				li.setAttribute("class","deal "+"deal"+i);
				/*获取main元素的宽高*/
				var mainWidth=main.clientWidth;
				var mainHeight=main.clientHeight;
				li.style.top=(mainHeight-this.CARDHEIGHT)+"px";
				li.style.left=(mainWidth-this.CARDWIDTH-(4-i)*this.CARDSPACEX)+"px";
				// li.style.bottom="0";
				// li.style.right=(4-i)*10+"px";
				li.appendChild(img);
				docFrag.appendChild(li);
			}
			node.appendChild(docFrag);
		}
		this.addDivForDealArea();
	},
	create_arr104:function(){
		var arr=new Array();
		for(var i=0;i<104;i++){
			arr[i]=i%13+1;
		}
		return arr;
	},
	init_dataArr:function(){
		var arr=this.create_arr104();
		var arr1=[];
		/*先将104个数分成54和50个数两组*/
		for(var i=0;i<54;i++){
			var rnd=Math.floor(Math.random()*arr.length);
			arr1[i]=arr[rnd];
			arr.splice(rnd,1);
		}
		// this.data1=arr1;
		// this.data2=arr;
		/*初始化data1*/
		for(var j=0;j<10;j++){
			if(j<4){
				var d1=[];
				for(var j1=0;j1<6;j1++){
					var index1=j*6+j1;
					d1[j1]=arr1[index1];
				}
				this.data1[j]=d1;
			}else{
				var d2=[];
				for(var j2=0;j2<5;j2++){
					var index2=24+(j-4)*5+j2;
					d2[j2]=arr1[index2];
				}
				this.data1[j]=d2;
			}
		}
		/*初始化data2*/
		// console.log(arr);
		for(var k=0;k<5;k++){
			var d3=[];
			for(var k1=0;k1<10;k1++){
				var index3=k*10+k1;
				d3[k1]=arr[index3];
			}
			this.data2[k]=d3;
		}
	},
	events_bind:function(){
		/*为纸牌和空位绑定鼠标悬停事件*/
		var imgs=document.querySelectorAll("#main ul li.col img");
		var licols=document.querySelectorAll("#main ul li.col");
		for(var i in imgs){
			imgs[i].onmouseover=function(e){
				var target=e.target;
				e.stopPropagation();
				target.className="imghover";
			};
			imgs[i].onmouseout=function(e){
				var target=e.target;
				e.stopPropagation();
				target.className="";
			};
		}
		for(var j in licols){
			licols[j].onmouseover=function(e){
				var target=e.target;
				e.stopPropagation();
				target.className="col lihover";
			};
			licols[j].onmouseout=function(e){
				var target=e.target;
				e.stopPropagation();
				target.className="col";
			};
			/*在父元素中为纸牌绑定拖拽事件*/
			licols[j].ondragstart=function(e){
				this.cardEvent_dragstart(e);
			}.bind(this);
			licols[j].ondrag = function(e){
				this.cardEvent_drag(e);	
			}.bind(this);
			licols[j].ondragover=function(e){
				e.preventDefault();
			};
		    licols[j].ondragend=function(e){
		    	this.cardEvent_dragend(e);
		    	/*判断游戏是否结束*/
		    	/*1. 游戏成功*/
		    	if((this.SCORE+this.MOVETIMES)===1300){
		    		
		    	}
		    	/*2. 游戏失败*/
		    }.bind(this);
		}
	},
	enable_drag:function(arr){
		var card=document.getElementById("card"+arr[0]+arr[1]);
		if(card.firstChild.getAttribute("src")=="img/back.jpg"){
			return false;
		}
		var colList=this.data1[arr[0]];
		var cur=arr[1];
		for(var i=cur+1;i<colList.length;i++,cur++){
			// debugger;
			if((colList[cur]-1)!==colList[i]){
				return false;
			}
		}
		return true;
	},
	cardEvent_dragstart:function(e){
		var target=e.target;
		var parent=target.parentNode;
		/*移动的纸牌对应data1数组的二维下标*/
		var arr=this.getCardIndex(parent);
		var top=parent.style.top;
		this.initY=parseInt(top.slice(0,top.length-2));
		if(target.nodeName.toLowerCase()=="img"){
			/*先判断是否满足拖拽条件*/
			/*如果满足，则设置如下，并设置变量enableDrag=true*/
				/*否则设置enableDrag=false*/
			// console.log(this.enable_drag(arr));
			if(this.enable_drag(arr)){
				this.offX = e.offsetX;
	      		this.offY = e.offsetY;
	      		this.enableDrag=true;
			}else{
				this.enableDrag=false;
			}
			/*如果是正在发牌，则不能拖拽纸牌*/
			if(this.dealState===1){
				this.enableDrag=false;
			}		
		}
	},
	cardEvent_drag:function(e){
		/*判断是否满足拖动的条件*/
		if(this.enableDrag===true){
			var target=e.target;
			var parent=target.parentNode;
			// e.dataTransfer.setData("Text",parent.id);
			var licolNum=this.getCardCol(parent);
			if(target.nodeName.toLowerCase()=="img"){
				var x = e.pageX;
			    var y = e.pageY;
		    //drag事件最后一刻，无法读取鼠标的坐标，pageX和pageY都变成0!
			    if(x==0 && y==0){
			      return;  //不处理拖动最后一刻X和Y都为0的情形
			    }
			    x = x-this.offX-this.OFFSETX-(this.CARDWIDTH+this.CARDSPACEX)*licolNum;
			    y = y-this.offY-this.OFFSETY;
			    parent.style.left = x+'px';
			    parent.style.top = y+'px';
			    /*先判断parent后面是否还有同辈元素*/
			    	/*如果有，则让后面所有的同辈元素作相同的移动*/
			    		/*x相同y按30px递增*/
			    	/*设置isGroup=true*/
			    if(parent.nextElementSibling!==null){
			    	var temp=parent;
			    	var spaceY=this.SPACEY;
			    	while((temp=temp.nextElementSibling)!==null){
			    		temp.style.left=x+'px';
			    		temp.style.top=y+spaceY+'px';
			    		spaceY+=30;
			    	}
			    	this.isGroup=true;
			    }
			}
		}		
	},
	checkCol_isMeet13:function(col){
		/*检查col列中是否存在满足13张连牌的情况*/
		var arr=this.data1[col];
		var index=-1;
		for(var i=0;i<arr.length;i++){
			if(arr[i]===13){
				index=i;
			}
		}
		if(-1!==index){
			var temp=arr[index];
			var count=1;
			for(var j=index+1;j<arr.length;j++){
				if(temp===(arr[j]+1)){
					temp=arr[j];
					count++;
				}else{
					return false;
				}
			}
			if(j==arr.length&&count==13) return new Array(true,index);
		}
		return false;
	},
	collectCards:function(meetArr){
		/*开始收集牌的时候，将dealState置1，来阻止用户拖拽牌*/
		this.dealState=1;
		/*将13张连牌收集，放在页面左下角的ul.colle_area中*/
		var colle_area=document.querySelector("ul.colle_area");			
		var left=-1*meetArr[0]*(this.CARDWIDTH+this.CARDSPACEX);
		var top=main.clientHeight-this.CARDHEIGHT;
		var classForColle="";//为收集的纸牌设置统一的class
		var cardK=this.getDomElement(meetArr[0]).lastElementChild;
		var cardList=new Array();//获取13张连牌dom元素数组
		for(var l=0;l<13;l++){
			if(cardK.previousElementSibling===null){
				cardList.push(cardK);
			}else{
				cardK=cardK.previousElementSibling;
				cardList.push(cardK.nextElementSibling);
			}	
		}
		/*如果ul.colle_area区域中没有元素节点*/
		if(colle_area.lastElementChild===null){
			var n=0;
		}else{
			var cla=colle_area.lastElementChild.getAttribute("class");
			var n=parseInt(cla.substring(cla.length-1))+1;	
		}
		classForColle="colle"+n;
		left=left+50*n;
		for(var i=0;i<13;i++){
			cardList[i].setAttribute("class",classForColle);
			cardList[i].style.top=top+"px";
			cardList[i].style.left=left+"px";
			cardList[i].removeAttribute("id");
			cardList[i].style.transition="all .3s linear "+(i*0.15)+"s";
			/*延迟一段时间执行代码，将当前元素加到上面的列末尾*/
			var delay=0;
			function append_card(){
				colle_area.appendChild(cardList[delay]);
				var colLast=colle_area.lastChild;
				colLast.style.left=50*n+"px";
				colLast.style.transition="";
				delay++;
			}
			setTimeout(append_card,2101);
		}
		/*收集牌结束，将data1对应的部分删除*/
		this.data1[meetArr[0]]=this.data1[meetArr[0]].slice(0,meetArr[1]);
		/*收集牌结束，修改得分*/
		this.SCORE+=100;
		this.setScoreAndMoveTimes();
		/*收集牌结束将状态改回正常*/
		var that=this;
		setTimeout(function(){
			that.dealState=0;
			/*收集牌结束后，如果k纸牌所在的列非空,且下一张牌是背面朝上，则将其翻过来*/
			var curCol=that.getDomElement(meetArr[0]);
			if(curCol.lastElementChild!==null){
				var prevCardImg=curCol.lastElementChild.firstChild;
				if(prevCardImg.getAttribute("src")=="img/back.jpg"){
					prevCardImg.setAttribute("src",path[that.data1[meetArr[0]][meetArr[1]-1]]);
				}
			}	
		},2102);
	},
	cardEvent_dragend:function(e){
		/*满足拖动的条件才执行以下*/
		if(this.enableDrag===true){
			var target=e.target;
			var parent=target.parentNode;
			var x = parent.style.left;
			var y = parent.style.top;
			var arr=this.getCardIndex(parent);
			var tarCol=this.adjustCardPosition(arr,x,y);
			/*拖动结束后执行下面*/
			/*需要将enableDrag,isGroup重新置为false*/
			this.enableDrag=false;
			this.isGroup=false;
			/*找到目标列纸牌K的位置往下遍历，判断是否凑足13张连牌*/
			if(-1!==tarCol){
				if(this.checkCol_isMeet13(tarCol)){
					var meetArr=new Array();
					meetArr.push(tarCol);
					meetArr.push(this.checkCol_isMeet13(tarCol)[1]);
					this.collectCards(meetArr);
				}
			}	
		}
	},
	getCardCol:function(node){
		/*表示纸牌所在的列，0-9*/
		/*return number*/ 
		var col=node.getAttribute("id").slice(4,5);
		return parseInt(col);
	},
	getCardIndex:function(node){
		/*return arr*/ 
		var temp=node.getAttribute("id").slice(4);
		var i1 = temp.slice(0,1);
		var i2 = temp.slice(1);
		return [parseInt(i1),parseInt(i2)];
	},
	/*返回该节点的后续同辈节点的数组*/
	getNodeAfterSibling:function(node){
		var afterSiblingList=new Array();
		while((node=node.nextElementSibling)!==null){
			afterSiblingList.push(node);
		}
		return afterSiblingList;
	},
	cardPos_transform:function(xy,arr,tarCol){
			/*获取目标列最后一张纸牌的y，将y+30赋给xy[1]*/
			xy[1]=this.getTarPosY(tarCol);
			/*可拼接，说明这次移动顺利，则要将对应的dom移动到正确的父元素末尾*/
				/*先获取源列和目标列的父元素*/
			var pSrc=this.getDomElement(arr[0]);
			var pDes=this.getDomElement(tarCol);
			var src=document.getElementById("card"+arr[0]+arr[1]);
			var srcSliblingList=this.getNodeAfterSibling(src);
			/*appendChild()将子节点从原父节点中移除，添加到新父对象的末尾*/
			/*无需再使用removeChild()方法;pSrc.removeChild(src);*/
			pDes.appendChild(src);
			var des=pDes.lastChild;
			des.id=this.getTarPosId(tarCol);
			des.style.left="0px";
			des.style.top=xy[1]+"px";		
			if(this.isGroup===true){
				/*如果移动的是纸牌组，则继续执行以下*/
				/*能走到这一步，说明srcSliblingList不为空*/
				var topSpace=this.SPACEY;
				for(var nOfs in srcSliblingList){
					// console.log(typeof(nOfs));
					var sibling=srcSliblingList[nOfs];
					pDes.appendChild(sibling);
					des=pDes.lastChild;
					des.id="card"+tarCol+(this.data1[tarCol].length+1+parseInt(nOfs));
					des.style.left="0px";
					des.style.top=xy[1]+topSpace+"px";
					topSpace+=this.SPACEY;
				}
				/*改变dom位置后，同样也要修改data1数组中的数值位置*/
				var cl=this.data1[arr[0]];
				var cn=cl.splice(arr[1],cl.length-arr[1]);
				this.data1[tarCol]=this.data1[tarCol].concat(cn);
			}else{
				/*改变dom位置后，同样也要修改data1数组中的数值位置*/
				var cn=this.data1[arr[0]].pop();
				this.data1[tarCol].push(cn);
			}
			/*如果源列有纸牌，则将源列最末尾一张牌翻过来*/
			if(pSrc.hasChildNodes()){
				var turn=pSrc.lastChild;
				turn.firstChild.src=path[this.data1[arr[0]][arr[1]-1]];
			}		
	},
	adjustCardPosition:function(arr,x,y){
		//入参arr表示源纸牌所在的列和索引值
		var curCol=arr[0];//当前纸牌的列出
		var tarCol=-1;//可能的目标列数	
		var xy=[];
		x=parseFloat(x);
		y=parseFloat(y);
		var offCol=Math.floor(x/(this.CARDWIDTH+this.CARDSPACEX));//偏移的列数
		var x1=offCol*(this.CARDWIDTH+this.CARDSPACEX);
		var x2=(offCol+1)*(this.CARDWIDTH+this.CARDSPACEX);
		if((this.CARDWIDTH-(x-x1))>=(this.CARDWIDTH-(x2-x))){
			tarCol=curCol+offCol;
			xy[0]=x1;	
		}else{
			tarCol=curCol+offCol+1;
			xy[0]=x2;
		}
		/*如果纸牌超过第0列或是超过第10列*/
		if(tarCol<0){
			xy[0]=0;
			tarCol=0;
		}
		if(tarCol>9){
			xy[0]=9*(this.CARDWIDTH+this.CARDSPACEX);
			tarCol=9;
		}
		/*根据目标列的最后一个纸牌判断是否相连*/
		/*或者目标位置为空位，则移动*/
		if(this.judgeConcat(arr,tarCol)||this.data1[tarCol].length==0){
			this.cardPos_transform(xy,arr,tarCol);
			/*重新显示移牌和得分*/
			this.MOVETIMES++;
			this.SCORE--;
			this.setScoreAndMoveTimes();
		}else{
			/*如果不满足，则让纸牌回到原位*/
			  /*根据isGroup值，得出移动的纸牌是单张还是组状态*/
			 var src=document.getElementById("card"+arr[0]+arr[1]);
			 xy[0]=0;
			 xy[1]=this.initY;
			 // console.log(xy[0],xy[1]);
			 src.style.left = xy[0]+'px';
			 src.style.top = xy[1]+'px';
			 if(this.isGroup===true){
			    var spaceY=this.SPACEY;/*同一列中正面朝上的牌的top偏移*/		
			 	while((src=src.nextElementSibling)!==null){
			    	src.style.left=xy[0]+'px';
			    	src.style.top=xy[1]+spaceY+'px';
			    	spaceY+=this.SPACEY;
			    }
			 }
			
		}
		return tarCol;
	},
	/*判断两个纸牌是否可以相连*/
	judgeConcat:function(arr,tarCol){
		var card1=this.data1[arr[0]][arr[1]];
		var cardList=this.data1[tarCol];
		var card2=cardList[cardList.length-1];
		// console.log(card1,card2);
		if((card1+1)==card2){
			return true;
		}else{
			return false;
		}
	},
	/*返回目标位置的top偏移值*/
	getTarPosY:function(tarCol){
		var length=this.data1[tarCol].length;
		if(this.data1[tarCol].length!==0){
			var index=this.data1[tarCol].length-1;
			var card=document.getElementById("card"+tarCol+index);
			var top=card.style.top;	
		}
		// console.log(top);
		return length===0?0:parseInt(top.slice(0,top.length-2))+30;
	},
	/*返回目标位置正确的id值*/
	getTarPosId:function(tarCol){
		var index=this.data1[tarCol].length;
		return "card"+tarCol+index;
	},
};