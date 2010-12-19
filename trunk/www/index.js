
ixUrlTail=0;ixType=1;ixText=2;ixProp=3;ixColor=4;ixArrowMode=5;ixArrowColor=6;ixLineUrlTail=7;ixLineText=8;ixMetaChildren=9;ixChildren=10;

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
function lineClick(props,box)
{
	if (switchMenu(props[ixLineUrlTail],'connection'))
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
		e=document.createElement("div");
		e.className='itemFinish';
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
	var backwards;
	var container;
	function getIdPostfix()
	{	return ""+instanceCounter+"_"+backwards+"_"+elemCounter;
	}
	function genItems(tree,offset,isMeta)
	{
		var i;
		if (!isMeta)
		{	var subOffset=(lineMargin+lineWidth)*tree.length+lineOffset;
			offset+=subOffset;
		}
		for(i=0; i<tree.length; i++)
		{
			var id=getIdPostfix();
			var props=tree[i];
			var box=makeItemBox(props);
			box.id='b'+id;
			box.style.marginLeft=px(offset);
			var linef=function(props,box) { return function(event) { lineClick(props,box); event.stopPropagation(); } }(props,box);

			var el=[box];
			/*if (props[ixArrowMode]&1)
			{
				var ar=document.createElement("div");
				ar.className='arrow0';
				ar.id='ar0_'+id;
				ar.innerHTML='<img src="arrow.png"></img>';
				ar.addEventListener('click',linef,false);
				el.push(ar);
			}
			if (props[ixArrowMode]&2)
			{
				var ar=document.createElement("div");
				ar.className=backwards?'arrow2':'arrow1';
				ar.id='ar1_'+id;
				ar.innerHTML='<img src="arrow.png"></img>';
				ar.onclick=linef;
				el.push(ar);
			}
			{
				var line=document.createElement("div");
				line.className='line';
				line.id='vl'+id;
				line.onclick=linef;
				el.push(line);
				line=document.createElement("div");
				line.className='line';
				line.id='hl'+id;
				line.onclick=linef;
				el.push(line);
				if (props[ixArrowMode]&4)
				{
					line=document.createElement("div");
					line.className='shortlineHor';
					line.id='shl'+id;
					el.push(line);
				}
			}*/
			//TODO: ixLineText
			elemCounter++;
			if (isMeta)
				offset+=lineOffset;
			if (backwards)
			{	genItems(props[ixChildren],offset,false);
				genItems(props[ixMetaChildren],offset,true);
			}
			{
				var j;
				for(j=0;j<el.length;j++)
					container.appendChild(el[j]);
			}
			if (!backwards)
			{	genItems(props[ixMetaChildren],offset,true);
				genItems(props[ixChildren],offset,false);
			}
			//document.write();
		}
	}
	function genLines(tree,parentBox)
	{
		var i;
		var subOffset=(lineMargin+lineWidth)*tree.length+lineOffset;
		if (parentBox.offsetWidth<subOffset)
			parentBox.style.width = px(subOffset);
		var offset=subOffset+parentBox.offsetLeft;
		for(i=0; i<tree.length; i++)
		{
			var props=tree[i];
			var id=getIdPostfix();
			var eb=document.getElementById("b"+id);
			var hh=(eb.offsetHeight-4)/(props[ixArrowMode]&4?3:2);
			var left=parentBox.offsetLeft+lineOffset+lineMargin*(backwards?i: tree.length-i-1);
			var ehl=document.getElementById("hl"+id);
			var evl=document.getElementById("vl"+id);
			ehl.style.backgroundColor=evl.style.backgroundColor=props[ixArrowColor];
			evl.style.left=ehl.style.left=px(left);
			ehl.style.width=px(offset-left);
			ehl.style.top=px(eb.offsetTop+hh);
			evl.style.top=px(backwards?ehl.offsetTop:parentBox.offsetTop+parentBox.offsetHeight);
			evl.style.height=px(backwards?parentBox.offsetTop-ehl.offsetTop:ehl.offsetTop-evl.offsetTop);
/*			if (props[3]&1)
			{	var ar=document.getElementById(ar0_'+id);
				ar.style.top=px(backwards?ehl.offsetTop-7:parentBox.offsetTop+parentBox.offsetHeight-10);
				ar.style.left=px(backwards?offset-8:left-6);
				ar.style.backgroundColor=props[4];
			}*/
			if (props[ixArrowMode]&1)
			{	var ar=document.getElementById('ar0_'+id);
				ar.style.top=px(ehl.offsetTop-7);
				ar.style.left=px(offset-8);
				ar.style.backgroundColor=props[ixArrowColor];
			}
			if (props[ixArrowMode]&2)
			{	var ar=document.getElementById('ar1_'+id);
				ar.style.top=px(backwards?parentBox.offsetTop-8 : parentBox.offsetTop+parentBox.offsetHeight);
				ar.style.left=px(left-6);
				ar.style.backgroundColor=props[ixArrowColor];
			}
			if (props[ixArrowMode]&4)
			{	var shl=document.getElementById('shl'+id);
				shl.style.top=px(ehl.offsetTop+10);
				shl.style.left=px(offset-shl.offsetWidth);
				shl.style.backgroundColor=props[ixColor];
			}
			elemCounter++;
			genLines(props[ixChildren],eb);
		}
	}
	function fillSpider(target,spider)
	{
		instanceCounter++;
		container=document.createElement("div");
		elemCounter=0;
		backwards=1;
		genItems(spider[0],0,false);
		var cbox;
		{
			var ec=document.createElement("div");
			ec.className="item";
			ec.id="centre"+instanceCounter;
			cbox=makeItemBox(spider[1]);
			ec.appendChild(cbox);
			container.appendChild(ec);
		}
		elemCounter=0;
		backwards=0;
		genItems(spider[2],0,false);
		elemCounter=0;
		target.appendChild(container);
		/*{
			backwards=1;
			genLines(spider[0],cbox);
			elemCounter=0;
			backwards=0;
			genLines(spider[2],cbox);
		}*/
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
