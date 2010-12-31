showProbabilities=true;//false;

lineMargin=20;
lineWidth=5;
lineOffset=lineMargin/2+lineWidth;
lastUrlTail=null;
lastSelectedType=null;
function menuClick(type,index)
{
	var url='action.tsp?index=$'+index+lastUrlTail;
	hideMenu();
	window.location=url;
	return false;
}
function hideMenu()
{
	if (lastSelectedType!=null)
	{	eFloatMenus[lastSelectedType].style.visibility="hidden";		
		lastSelectedType=null;
	}
}
function switchMenu(urlTail,type)
{
	if (lastUrlTail==urlTail && lastSelectedType==type)
	{	hideMenu();
		return false;
	}
	else
	{	hideMenu();
		lastUrlTail=urlTail;
		lastSelectedType=type;
		eFloatMenus[type].style.visibility="visible";
		return true;
	}
}
function itemClick(props,box)
{
	var type=props.type;
	if (switchMenu(props.urlTail,type))
	{
		eFloatMenus[type].style.left=px(box.offsetLeft);
		eFloatMenus[type].style.top=px(box.offsetTop+box.offsetHeight);
	}
}
function arrowClick(props,box)
{
	if (switchMenu(props.arrowUrlTail,'connection'))
	{
		eFloatMenus.connection.style.left=px(box.offsetLeft-30);
		eFloatMenus.connection.style.top=px(Math.floor(box.offsetTop+box.offsetHeight/2+6));
	}
}
function makeItemBox(props)
{
	var line, e;
	var b=document.createElement("div");
	b.className='box';
	b.style.backgroundColor=props.color;
	if (showProbabilities)
	{
		e=document.createElement("div");
		e.className='probabilityBox';
		e.innerHTML=props.prop;
		b.appendChild(e);
	}
	{
		e=document.createElement("div");
		e.className='itemText';
		e.innerHTML=props.text;
		b.appendChild(e);
	}
	b.addEventListener('click',function(event) { itemClick(props,b); event.stopPropagation();},false);
//	b.onclick=function() {  return false;}

	return b;
}

function px(v)
{	return ""+Math.abs(v)+"px";
}
{
	var instanceCounter=0;
	var elemCounter;
	var container;
	var conns;//x,w,s,d,isMeta,color
	function getIdPostfix(backwards)
	{	return ""+instanceCounter+"_"+backwards+"_"+elemCounter;
	}
	function genItems(tree,backwards,parentOffset,isMeta,parentId)
	{
		var i;
		var boxOffset=parentOffset+lineMargin*tree.length+lineOffset;
		for(i in tree)
		{
			var id=getIdPostfix(backwards);
			var props=tree[i];
			var box=makeItemBox(props);
			box.id='b'+id;
			box.style.minWidth=px(lineMargin*props.children.length);
			var linef=function(props,box) { return function(event) { arrowClick(props,box); event.stopPropagation(); } }(props,box);
			elemCounter++;
			var arrowText=null;
			var offset=boxOffset;
			var connOffset=parentOffset+lineOffset+(lineMargin)*(backwards?i: tree.length-i-1)+lineOffset;
			var w=boxOffset-connOffset+20;
			var minW=lineMargin*props.metaChildren.length+10;
			if (w<minW) { offset+=minW-w; w=minW; }
			box.style.marginLeft=px(offset);
			if (props.arrowText!=null)
			{	arrowText=document.createElement("div");
				arrowText.className='arrowText';
				arrowText.style.marginTop=px(!backwards&&(props.arrowMode&1)&&i==0?10:0);
				arrowText.style.marginLeft=px(connOffset-28);
				arrowText.innerHTML=props.arrowText;
				arrowText.style.backgroundColor=props.arrowColor;
			}
			conns.push({'x':connOffset,'s':parentId,'w':w,'d':box.id,'isMeta':isMeta,'color':props.arrowColor,'arrow':props.arrowMode&1 });
			if (backwards)
			{	genItems(props.children,backwards,offset,false,box.id);
				container.appendChild(box);
				genItems(props.metaChildren,false,connOffset-20,true,box.id);
				if (arrowText!=null)
					container.appendChild(arrowText);	
			}
			else
			{	
				if (arrowText!=null)
					container.appendChild(arrowText);	
				container.appendChild(box);
				genItems(props.children,backwards,offset,false,box.id);
				genItems(props.metaChildren,false,connOffset-20,true,box.id);
			}
			//document.write();
		}
	}
	function drawConns(container)
	{
		for(c in conns)
		{
			var s=document.getElementById(conns[c].s);
			var d=document.getElementById(conns[c].d);
			var backwards=s!=null && s.offsetTop>d.offsetTop;
			var isMeta=conns[c].isMeta;
			var yd=d.offsetTop+d.offsetHeight/2;
			var y=s==null?yd : ( backwards ? yd : s.offsetTop+(isMeta?s.offsetHeight/2+lineWidth:s.offsetHeight) );
			var h=(backwards ? s.offsetTop : yd ) - y;
			{
				var line=document.createElement("div");
				line.className='line';
				//todo line.onclick=linef;
				line.style.left=px(conns[c].x);
				line.style.width=px(lineWidth);//px(conns[c].w);
				var lineDown=backwards?lineWidth:0;
				line.style.top=px(y+lineDown);
				line.style.height=px(h-lineDown);
				line.style.backgroundColor=conns[c].color;//"#334455";
				container.appendChild(line);
			}
			{
				var line=document.createElement("div");
				line.className='line';
				//todo line.onclick=linef;
				line.style.left=px(conns[c].x);
				line.style.width=px(conns[c].w-5);//px(conns[c].w);
				line.style.top=px(yd-(backwards?0:10));
				line.style.height=px(10);
				line.style.borderLeft="5px solid";
				if (backwards)
					line.style.borderTop="5px solid";
				else
					line.style.borderBottom="5px solid";
				line.style.MozBorderRadius=line.style.WebkitBorderRadius=line.style.borderRadius=backwards?"10px 0px 10px 10px":"10px 10px 0px 10px";
				line.style.borderColor=conns[c].color;//"#334455";
				//line.style.backgroundColor=conns[c].color;//"#334455";
				container.appendChild(line);
			}
			if(conns[c].arrow)
			{
				var ar=document.createElement("div");
				ar.style.backgroundColor=conns[c].color;
				ar.innerHTML='<img src="arrow.png"></img>';
				//ar.addEventListener('click',linef,false);
				if (backwards)
				{
					ar.className='arrow0';
					ar.style.top=px(y-6);
					ar.style.left=px(conns[c].x+(conns[c].w-8));
				}
				else
				{
					ar.className='arrow1';
					ar.style.top=px(y);
					ar.style.left=px(conns[c].x-6);
				}
				container.appendChild(ar);
			}
		}
	}
	function fillSpider(target,spider)
	{
		instanceCounter++;
		conns=[];
		container=document.createElement("div");
		elemCounter=0;
		var cid="centre"+instanceCounter;
		genItems(spider[0],true,0,false,cid);
		var bid;
		var cbox;
		{
			//var ec=document.createElement("div");
			//ec.className="item";
			//ec.id=cid;
			//ec.appendChild(cbox);
			cbox=makeItemBox(spider[1]);
			cbox.id=cid;
			container.appendChild(cbox);
		}
		elemCounter=0;
		genItems(spider[2],false,0,false,cid);
		elemCounter=0;
		target.appendChild(container);
		//alert(document.getElementById(cid).offsetTop);
		/*{
			backwards=1;
			genLines(spider[0],cbox);
			elemCounter=0;
			backwards=0;
			genLines(spider[2],cbox);
		}*/
		drawConns(target);
	}
}
//document.offsetHeight
//document.offsetTop

function removeEmpties(form)
{
	//for (property in form)
	//	alert(property);
	//form.viewpoint.value=null;
	//form.removeChild(form.viewpoint);
	var sub = form.getElementsByTagName('input');
	query = new Array();
	for(i in sub){
		if(sub[i].name){
		query.push(sub[i].name + '=' + sub[i].value);
		}
	}
	query = '?' + query.join('&'); 
	alert(query);
}
