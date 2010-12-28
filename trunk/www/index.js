
ixUrlTail=0;ixType=1;ixText=2;ixProp=3;ixColor=4;ixArrowMode=5;ixArrowColor=6;ixArrowUrlTail=7;ixArrowText=8;ixMetaChildren=9;ixChildren=10;

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
	var type=props[ixType];
	if (switchMenu(props[ixUrlTail],type))
	{
		eFloatMenus[type].style.left=px(box.offsetLeft);
		eFloatMenus[type].style.top=px(box.offsetTop+box.offsetHeight);
	}
}
function arrowClick(props,box)
{
	if (switchMenu(props[ixArrowUrlTail],'connection'))
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
	b.style.backgroundColor=props[ixColor];
	if (props[ixArrowMode]&8)
	{
		line=document.createElement("div");
		e=document.createElement("div");
		e.className='shortlineVert';
		e.style.backgroundColor=props[ixColor];
		line.appendChild(e);
		line.className='shortlineTop';
		b.appendChild(line);
		b.style.marginTop="10px";
	}
	{
		e=document.createElement("div");
		e.className='probabilityBox';
		e.innerHTML=props[ixProp];
		b.appendChild(e);
		e=document.createElement("div");
		e.className='itemText';
		e.innerHTML=props[ixText];
		b.appendChild(e);
	}
	b.addEventListener('click',function(event) { itemClick(props,b); event.stopPropagation();},false);
//	b.onclick=function() {  return false;}

	if (props[ixArrowMode]&16)
	{
		line=document.createElement("div");
		e=document.createElement("div");
		e.className='shortlineVert';
		e.style.backgroundColor=props[ixColor];
		line.appendChild(e);
		line.className='shortlineBottom';
		b.appendChild(line);
		b.style.marginBottom="10px";
	}
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
		var boxOffset=parentOffset;
		if (!isMeta)
		{	boxOffset+=lineMargin*tree.length+lineOffset;
		}
		//else
		//	boxOffset+=lineOffset+lineWidth;
		for(i in tree)
		{
			var id=getIdPostfix(backwards);
			var props=tree[i];
			var box=makeItemBox(props);
			box.id='b'+id;
			box.style.marginLeft=px(boxOffset);
			var linef=function(props,box) { return function(event) { arrowClick(props,box); event.stopPropagation(); } }(props,box);
			elemCounter++;
			var arrowText=null;
			var connOffset=isMeta?parentOffset+lineWidth+30:parentOffset+lineOffset+(lineMargin)*(backwards?i: tree.length-i-1)+lineOffset;
			if (props[ixArrowText]!=null)
			{	arrowText=document.createElement("div");
				arrowText.className='arrowText';
				arrowText.style.marginTop=px(!backwards&&(props[ixArrowMode]&1)&&i==0?10:0);
				arrowText.style.marginLeft=px(connOffset-28);
				arrowText.innerHTML=props[ixArrowText];
				arrowText.style.backgroundColor=props[ixArrowColor];
				//arrowText.style.textShadow="black 0px 0px 1px";
			}
			if (isMeta)			
			{	var placeHolder=document.createElement("div");
				placeHolder.className='placeHolder';
				placeHolder.id='ph'+id;
				container.appendChild(placeHolder);
				container.appendChild(arrowText);	
				conns.push({'x':parentOffset+lineWidth,'w':30,'d':placeHolder.id,'s':box.id,'isMeta':true,'color':props[ixArrowColor],'arrow':true });
				genItems(props[ixMetaChildren],backwards,connOffset,true);
				container.appendChild(box);
				genItems(props[ixChildren],backwards,boxOffset,false,box.id);
				return;
			}
			conns.push({'x':connOffset,'s':parentId,'w':boxOffset-connOffset+20,'d':box.id,'isMeta':false,'color':props[ixArrowColor],'arrow':props[ixArrowMode]&1 });
			if (backwards)
			{	genItems(props[ixChildren],backwards,boxOffset,false,box.id);
				container.appendChild(box);
				genItems(props[ixMetaChildren],backwards,connOffset,true);
				if (arrowText!=null)
					container.appendChild(arrowText);	
			}
			else
			{	
				if (arrowText!=null)
					container.appendChild(arrowText);	
				genItems(props[ixMetaChildren],backwards,connOffset,true);
				container.appendChild(box);
				genItems(props[ixChildren],backwards,boxOffset,false,box.id);
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
			var yd=d.offsetTop+d.offsetHeight/2;
			var y=s==null?yd : ( backwards ? yd : s.offsetTop+s.offsetHeight );
			var h=(backwards ? s.offsetTop : yd ) - y;
			{
				var line=document.createElement("div");
				line.className='line';
				//todo line.onclick=linef;
				line.style.left=px(conns[c].x+(conns[c].isMeta?conns[c].w:0));
				line.style.width=px(lineWidth);//px(conns[c].w);
				//alert(conns[c].s);
				//alert(y);
				line.style.top=px(y);
				line.style.height=px(h);
				line.style.backgroundColor=conns[c].color;//"#334455";
				container.appendChild(line);
			}
			{
				var line=document.createElement("div");
				line.className='line';
				//todo line.onclick=linef;
				line.style.left=px(conns[c].x);
				line.style.width=px(conns[c].w);//px(conns[c].w);
				line.style.top=px(yd);
				line.style.backgroundColor=conns[c].color;//"#334455";
				container.appendChild(line);
			}
			if(conns[c].arrow)
			{
				if (backwards)
				{
					var ar=document.createElement("div");
					ar.className=conns[c].isMeta?'arrow3':'arrow0';
					ar.innerHTML='<img src="arrow.png"></img>';
					//ar.addEventListener('click',linef,false);

					ar.style.top=px(y-6);
					ar.style.left=px(conns[c].x+(conns[c].isMeta?0:conns[c].w-8));
					ar.style.backgroundColor=conns[c].color;
					container.appendChild(ar);
				}
				else
				{
					var ar=document.createElement("div");
					ar.className='arrow1';
					ar.innerHTML='<img src="arrow.png"></img>';
					//ar.addEventListener('click',linef,false);

					ar.style.top=px(y);
					ar.style.left=px(conns[c].x-6);
					ar.style.backgroundColor=conns[c].color;
					container.appendChild(ar);
				}
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
