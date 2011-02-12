//TODO: minimal width of item due to arrows

jSplitTree = new Object();

jSplitTree.lineMargin=20;
jSplitTree.lineWidth=5;
jSplitTree.lineOffset=jSplitTree.lineMargin/2;
jSplitTree.arrowSize=6;

jSplitTree.makeItemBox= function(props)
{
	var line, e;
	var b=document.createElement("div");
	b.className='ViSpi_box';
	b.style.backgroundColor=props.color;
	{
		e=document.createElement("div");
		e.className='ViSpi_itemText';
		e.innerHTML=props.text;
		b.appendChild(e);
	}
	jSplitTree.setClick(b,props);

	return b;
}

jSplitTree.px= function(v)
{	return ""+Math.floor(v)+"px";
}
jSplitTree.instanceCounter=0;
jSplitTree.elemCounter;
jSplitTree.container;
jSplitTree.conns;//x,w,s,d,isMeta,color
jSplitTree.getIdPostfix= function(backwards)
{	return ""+this.instanceCounter+"_"+backwards+"_"+this.elemCounter;
}
jSplitTree.setClick=function(target,object)
{
	if (object.onClick!=null)
	{	target.addEventListener('click',function(event) { object.onClick(target); event.stopPropagation(); },false);
		target.style.cursor="pointer";
	}
}

jSplitTree.genItems= function(tree,backwards,parentOffset,isMeta,parentId)
{
	var i;
	var boxOffset=parentOffset+this.lineMargin*tree.length+this.lineOffset;
	for(i in tree)
	{
		var props=tree[i];
		if (props.children==null) props.children=[];
		if (props.metaChildren==null) props.metaChildren=[];
		var id=this.getIdPostfix(backwards);
		var box=this.makeItemBox(props.box);
		box.id='b'+id;
		box.style.minWidth=this.px(this.lineMargin*props.children.length);
		this.elemCounter++;
		var arrowText=null;
		var offset=boxOffset;
		var connOffset=parentOffset+(this.lineMargin)*(backwards?i: tree.length-i-1)+this.lineOffset;
		var w=boxOffset-connOffset;
		var minW=this.lineMargin*props.metaChildren.length+10;
		if (w<minW) { offset+=minW-w; w=minW; }
		box.style.marginLeft=this.px(offset);
		if (props.arrow.text!=null)
		{	arrowText=document.createElement("div");
			arrowText.className='ViSpi_arrowText';
			jSplitTree.setClick(arrowText,props.arrow);
			arrowText.style.marginTop=this.px(!backwards&&(props.arrow.mode&1)&&i==0?10:0);
			arrowText.style.marginLeft=this.px(connOffset-8);
			arrowText.innerHTML=props.arrow.text;
			arrowText.style.backgroundColor=props.arrow.color;
		}
		this.conns.push({'dx':connOffset-offset,'s':parentId,'w':w,'d':box.id,'isMeta':isMeta,'props':props.arrow });
		if (backwards)
		{	this.genItems(props.children,backwards,offset,false,box.id);
			this.container.appendChild(box);
			this.genItems(props.metaChildren,false,connOffset,true,box.id);
			if (arrowText!=null)
				this.container.appendChild(arrowText);	
		}
		else
		{	
			if (arrowText!=null)
				this.container.appendChild(arrowText);	
			this.container.appendChild(box);
			this.genItems(props.children,backwards,offset,false,box.id);
			this.genItems(props.metaChildren,false,connOffset,true,box.id);
		}
		//document.write();
	}
}

jSplitTree.drawConns = function(container)
{
	for(c in this.conns)
	{
		var co = this.conns[c];
		var s=document.getElementById(co.s);
		var d=document.getElementById(co.d);
		var x=co.dx+d.offsetLeft;
		var backwards=s!=null && s.offsetTop>d.offsetTop;
		var isMeta=co.isMeta;
		var yd=d.offsetTop+Math.floor((d.offsetHeight-this.lineWidth)/2);
		var ys=s==null?yd:s.offsetTop +(isMeta?Math.floor((s.offsetHeight+this.lineWidth)/2):(backwards?0:s.offsetHeight));
		var y= backwards ? yd : ys;
		var h=(backwards ? ys : yd ) - y;
		{
			var line=document.createElement("div");
			line.className='ViSpi_line';
			jSplitTree.setClick(line,co);
			line.style.left=this.px(x);
			line.style.width=this.px(this.lineWidth);//this.px(co.w);
			var lineDown=backwards?this.lineWidth:0;
			line.style.top=this.px(y+lineDown);
			line.style.height=this.px(h-lineDown);
			line.style.backgroundColor=co.props.color;//"#334455";
			container.appendChild(line);
		}
		{
			var line=document.createElement("div");
			line.className=backwards?'ViSpi_hlineUp':'ViSpi_hlineDown';
			jSplitTree.setClick(line,co);
			line.style.left=this.px(x);
			line.style.width=this.px(co.w-this.lineWidth);//this.px(co.w);
			line.style.top=this.px(yd-(backwards?0:this.lineWidth*2));
			line.style.height=this.px(this.lineWidth*2);
			line.style.borderLeftWidth=this.px(this.lineWidth);
			line.style.borderLeftStyle="solid";
			if (backwards)
			{
				line.style.borderTopWidth=this.px(this.lineWidth);
				line.style.borderTopStyle="solid";
			}
			else
			{
				line.style.borderBottomWidth=this.px(this.lineWidth);
				line.style.borderBottomStyle="solid";
			}
			line.style.borderColor=co.props.color;
			container.appendChild(line);
		}
		if(co.props.mode)
		{
			var ar=document.createElement("div");
			ar.className='ViSpi_arrow'+(co.props.mode==1?(backwards?2:0):1);
			ar.style.backgroundColor=co.props.color;
			ar.innerHTML='<img src="arrow.png"></img>';
			jSplitTree.setClick(ar,co);
			ar.style.left=this.px(x+(co.props.mode==1?-this.arrowSize:co.w-this.arrowSize-2));
			ar.style.top=this.px(co.props.mode==1?ys-(backwards?this.arrowSize:0):yd-this.arrowSize);
			container.appendChild(ar);
		}
	}
}
jSplitTree.clearTarget = function(target)
{
	while (target.hasChildNodes()) {
		target.removeChild(target.lastChild);
	}
}
jSplitTree.create = function(target,splitTree) // splitTree == { 'topTree': , 'root':, 'bottomTree' } 
{
	this.instanceCounter++;
	this.conns=[];
	this.container=document.createElement("div");
	this.elemCounter=0;
	var cid="center"+this.instanceCounter;
	this.genItems(splitTree.topTree,true,0,false,cid);
	{
		var cbox;
		cbox=this.makeItemBox(splitTree.root);
		cbox.id=cid;
		this.container.appendChild(cbox);
	}
	this.elemCounter=0;
	this.genItems(splitTree.bottomTree,false,0,false,cid);
	this.elemCounter=0;
	target.appendChild(this.container);
	this.drawConns(target);
}
