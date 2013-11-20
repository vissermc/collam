//TODO: minimal width of item due to arrows

jSplitTree = new Object();

jSplitTree.lineMargin=20;
jSplitTree.lineWidth=5;
jSplitTree.lineOffset=jSplitTree.lineMargin/2;
jSplitTree.arrowSize=9;

jSplitTree.makeItemBox= function(props)
{
	return $("<div></div>").addClass('ViSpi_box').css('background-color',props.color)
		.append($("<div></div>").addClass('ViSpi_itemText').html(props.text))
		.click(function() { props.onClick(this); } );
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
		box.attr('id','b'+id);
		box.css('min-width', this.lineMargin*props.children.length);
		this.elemCounter++;
		var arrowText=null;
		var offset=boxOffset;
		var connOffset=parentOffset+(this.lineMargin)*(backwards?i: tree.length-i-1)+this.lineOffset;
		var w=boxOffset-connOffset;
		var minW=this.lineMargin*props.metaChildren.length+10;
		if (w<minW) { offset+=minW-w; w=minW; }
		box.css('margin-left',offset);
		if (props.arrow.text!=null) {
			arrowText=$("<div></div>").addClass('ViSpi_arrowText');
			arrowText.click(function() { props.arrow.onClick(this); } );
			arrowText.css({
				'margin-top': !backwards&&(props.arrow.mode&1)&&i==0?10:0, 
				'margin-left': connOffset-8,
				'background-color': props.arrow.color
			}).html(props.arrow.text);
		}
		this.conns.push({'s':parentId,'w':w,'d':box.attr('id'),'isMeta':isMeta,'props':props.arrow });
		if (backwards) {
			this.genItems(props.children,backwards,offset,false,box.attr('id'));
			this.container.append(box).append($('<br>'));
			this.genItems(props.metaChildren,false,connOffset,true,box.attr('id'));
			if (arrowText!=null) {
				this.container.append(arrowText).append($('<br>'));
			}
		}
		else
		{	
			if (arrowText!=null) {
				this.container.append(arrowText).append($('<br>'));
			}
			this.container.append(box).append($('<br>'))
			this.genItems(props.children,backwards,offset,false,box.attr('id'));
			this.genItems(props.metaChildren,false,connOffset,true,box.attr('id'));
		}
		//document.write();
	}
}

jSplitTree.drawConns = function(container)
{
	var lf=new jLineFactory($(container));
	for(c in this.conns) {
		var co = this.conns[c];
		var s = $('#'+co.s);
		var d = $('#'+co.d); //todo: parentId etc
		var sOffset=s.offset(), dOffset=d.offset();
		var h=d.height()+8;
		var backwards=s!=null && sOffset.top>dOffset.top;
		var hOffset = co.isMeta ? this.lineWidth/2 : (backwards ? -h/2 : h/2);
		lf.drawCurvedLine(
			[dOffset.left,dOffset.top+h/2],
			[[-co.w,0],[0,sOffset.top-dOffset.top+hOffset]],
			co.props.color,
			this.lineWidth,
			this.lineWidth*2,
			backwards?this.arrowSize:0,
			backwards?0:this.arrowSize
		 );
	}
}

jSplitTree.create = function(jQuertyTarget,splitTree) // splitTree == { 'topTree': , 'root':, 'bottomTree' } 
{
	this.instanceCounter++;
	this.conns=[];
	this.container=$("<div></div>");
	this.elemCounter=0;
	var cid="center"+this.instanceCounter;
	this.genItems(splitTree.topTree,true,0,false,cid);
	{
		var cbox;
		cbox=this.makeItemBox(splitTree.root);
		cbox.attr('id',cid);
		this.container.append(cbox).append($('<br>'));
	}
	this.elemCounter=0;
	this.genItems(splitTree.bottomTree,false,0,false,cid);
	this.elemCounter=0;
	jQuertyTarget.append(this.container);
	this.drawConns(jQuertyTarget);
}
