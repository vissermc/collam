ArgMap = new Object();

ArgMap.getCSSColor = function(v,rgb)
{
	var l=Math.floor(v*85);
	l=[170-l,170+l];
	for(var i in l) l[i]=l[i].toString(16);
	return '#'+l[rgb[0]]+l[rgb[1]]+l[rgb[2]];
}

{
	var nextID=0;
	function getNewId()
	{
		nextID++;
		return nextID;
	}
}

ArgMap.Connection = function(argument,conclusion,probability)
{
	this.id=getNewId();
	this.argumentConns={};
	this.argument=argument;
	this.conclusion=conclusion;
	this.probability=probability;
}
ArgMap.Connection.prototype.isArrowTarget=1;
/*ArgMap.Connection.prototype.getconclusionConns=function()
{
	return {this.conclusion.id};
}*/
ArgMap.Connection.prototype.calcProbability=function()
{
	var m=this.probability;
	//putline(.?{this.data->calcProbability()}); putline(.?{this.argument->getText(),this.conclusion->getText()});
	for(var a in this.argumentConns)
	{	m*=this.argumentConns[a].calcProbability();
	}
	return (this.probability<0?1.0:0.0)+(m*this.argument.calcProbability());
}
ArgMap.Connection.prototype.getColor=function()
{
	var cp=this.calcProbability();
	return ArgMap.getCSSColor(this.probability<0?1.0-cp:cp,this.probability<0?[1,0,0]:[0,1,0]);
}
ArgMap.Connection.prototype.getText=function()
{
	var p=this.probability;
	return this.conclusion.isArrowTarget?(p>=0?'supports'+(p==1.0?'':' '+p):'challenges'+(p==-1.0?'':' '+-p)):(p==1.0?null :''+p);
}

ArgMap.Item = function()
{
	this.id=getNewId();
	this.argumentConns={};
	this.conclusionConns={};
}
ArgMap.Item.prototype.isArrowTarget=0;
/*ArgMap.Item.prototype.getconclusionConns=function()
{
	return this.conclusionConns;
}*/
ArgMap.Item.prototype.calcProbability=function()
{
	var m=1.0;
	for(var a in this.argumentConns)
	{	m*=this.argumentConns[a].calcProbability();
	}
	return m;
}
ArgMap.Item.prototype.getColor=function()
{
	var cp=this.calcProbability();
	return ArgMap.getCSSColor(cp,cp<0?[1,0,0]:[0,1,0]);
}
ArgMap.Item.prototype.getMetaTexts=function(prob)
{	
	var a=[];//if you want to show internal id's, use [this.id];
	if (prob!=1.0)
		a.push('P&nbsp;'+ArgMap.probabilityToString(prob));
	return a;
}
ArgMap.probabilityToString = function(p)
{
	return p.toPrecision(4).replace(/0*$/g,'');
}
ArgMap.formatTextAndMetaTexts = function(text,metaTexts)
{
	var pt='';
	for(var i in metaTexts)
	{
		pt+='<div class="VisAm_MetaBox">'+metaTexts[i]+'</div>';
	}
	return pt+text;
}
ArgMap.Item.prototype.getItemJSONProps=function()
{
	return { 'box': { 'text':ArgMap.formatTextAndMetaTexts(this.getText(),this.getMetaTexts(this.calcProbability())),'color':this.getColor() } };
}

ArgMap.Or = function()
{
	ArgMap.Item.call(this);
}
ArgMap.Or.prototype = new ArgMap.Item;
ArgMap.Or.prototype.calcProbability=function()
{
	var m=1.0;
	for(var a in this.argumentConns)
	{	m*=1.0-this.argumentConns[a].calcProbability();
	}
	return 1.0-m;
}
ArgMap.Or.prototype.getText=function()
{
	return 'or';
}
ArgMap.And = function()
{
	ArgMap.Item.call(this);
}
ArgMap.And.prototype = new ArgMap.Item;
ArgMap.And.prototype.getText=function()
{
	return 'and';
}

ArgMap.Proposition = function(text,probability)
{
	ArgMap.Item.call(this);
	this.text=text;
	this.probability=probability==null?1.0:probability;
}
ArgMap.Proposition.prototype = new ArgMap.Item;
ArgMap.Proposition.prototype.calcProbability=function()
{
	return this.probability * ArgMap.Item.prototype.calcProbability.call(this);
}
ArgMap.Proposition.prototype.getText=function()
{
	return this.text;
}

ArgMap.Proposition.prototype.isArrowTarget = 1;

ArgMap.Proposition.prototype.getColor=function()
{
	var cp=this.calcProbability();
	return ArgMap.getCSSColor(cp,[0,1,1]);
}

/*
	$.getMetaTexts=?<prop><[ArgMap.Item]this>
	(	.p=getPropData(this).probability;
		(ArgMap.Item.prototype.getMetaTexts(prop))+(p!=1.0 ? '&nbsp;('+p+')')
	);
*/
ArgMap.Proposition.prototype.getMetaTexts=function(prob)
{	
	var a=ArgMap.Item.prototype.getMetaTexts.call(this,prob);
	if (this.probability!=1.0)
	{
		for (var t in this.argumentConns) // this strange loop just to check whether array is nonempty
		{
			a[1]+='&nbsp;('+ArgMap.probabilityToString(this.probability)+')';
			break;
		}
	}
	return a;
}

ArgMap.connectItems = function(argument,conclusion, strength)
{
	var c=new ArgMap.Connection(argument,conclusion,strength);
	argument.conclusionConns[conclusion.id]=c;
	conclusion.argumentConns[argument.id]=c;
}

ArgMap.getJSONItemConclusionTree = function(item,level)
{
	if (!level)
		return [];
	var r=[];
	for (var i in item.conclusionConns)
	{
		var cc=item.conclusionConns[i];
		var c=cc.conclusion;
		//.c=item->getColor();
		if (c.prototype!=ArgMap.Connection.prototype)
		{
			var ps=c.getItemJSONProps();
			ps.arrow=
				{
					'mode': (c.isArrowTarget*2)/*|(@$.key.argumentConns>1?4)|(level==1&&$.key.conclusionConns?8)*/,
					'color': cc.getColor(),
					//'urlTail': urlTailForConnection(item,$.key), 
					'text': cc.getText()
				};
			ps.metaChildren=ArgMap.getJSONArgumentTree(cc,level-1);
			ps.children=ArgMap.getJSONItemConclusionTree(c,level-1);
			r.push( [ c.id, ps ] );
		}
	}
	r.sort();
	var rr=[];
	for(var ri in r)
	{	rr.push(r[ri][1]);
	}
	return rr;
}

ArgMap.getJSONArgumentTree = function(object,level)
{
	if (!level)
		return [];
	var r=[];
	for (var i in object.argumentConns)
	{
//		alert(ps.box.text);
		var cc=object.argumentConns[i];
		var a=cc.argument;
		var ps=a.getItemJSONProps();
		{
			ps.arrow=
				{
					'mode': (object.isArrowTarget?1:0)/*|(@$.key.argumentConns>1?4)|(level==1&&$.key.conclusionConns?8)*/,
					'color': cc.getColor(),
					//'urlTail': urlTailForConnection(item,$.key), 
					'text': cc.getText()
				};
			ps.metaChildren=ArgMap.getJSONArgumentTree(cc,level-1);
			ps.children=ArgMap.getJSONArgumentTree(a,level-1);
			r.push( [ a.id, ps ] );
		}
	}
	r.sort();
	var rr=[];
	for(var ri in r)
	{	rr.push(r[ri][1]);
	}
	return rr;
}

ArgMap.getJSONTriple = function(center,level)
{
	var l=center.getItemJSONProps().box;
	return {
		'topTree': ArgMap.getJSONItemConclusionTree(center,level-1),
		'root': l,//+{(level==1&&getValidconclusionConns(center)?8)|(level==1&&getValidArgs(center)?16)},
		'bottomTree': ArgMap.getJSONArgumentTree(center,level-1)
	};
}

ArgMap.draw = function(target, root)
{
	if (typeof(root)=='string')
		root=ArgMap.parse(root);
	fillSpider(target,ArgMap.getJSONTriple(root,-1));
}

ArgMap.processStruct = function(struct, parent,grandParent)
{
	var elems=/^(\*?)(<?)([+\-]?)((?:[01]\.?[0-9]*)?) *((?:\[[01]\.?[0-9]*\])?) *((?:\#[^ ]+)?) *(.*)/.exec(struct[0]);
	if (elems.length<2)
		return;
	var id = elems[6]!='' ? elems[6].substr(1) : null;
	
	var  item=elems[7]=='' ? ArgMap.items[id] : 
	(
		/^or$/i.test(elems[7]) ? new ArgMap.Or() : 
		(
			/^and$/i.test(elems[7]) ? new ArgMap.And() : new ArgMap.Proposition(elems[7]) 
		) 
	);
	if (id!=null)
		ArgMap.items[id]=item;
	if (elems[1]=='*')
		ArgMap.rootItem=item;
	if (elems[5]!='')
		item.probability=parseFloat(elems[5].substr(1));
	var strength=(elems[3]=='-'?-1.0:1.0) * (elems[4]=='' ? 1.0: parseFloat(elems[4]));
	if (elems[2]=='<')
	{	ArgMap.connectItems(item,parent.conclusionConns[grandParent.id],strength);
	}
	else
	{
		if (parent!=null)
		{	//alert(item.text);
			//alert(parent.text);
			ArgMap.connectItems(item,parent,strength);
		}
	}
	for (var i in struct[1])
		ArgMap.processStruct(struct[1][i],item,parent);
	return item; 
}

ArgMap.appendInDepth = function(struct,depth,item)
{
	var s=struct;
	for(var i=0; i<depth*2; i++)
	{	s=s[s.length-1];
	}
	s.push([item,[]]);
}

ArgMap.parse = function(text)
{
	var struct=[];
	var lines=text.split("\n");
	ArgMap.rootItem=null;
	ArgMap.items={};
	for (var i in lines)
	{
		var line=lines[i];
		if (line.length==0)
			continue;
		var tabs=line.match(/^((?:\t|[ ][ ])*)/)[0].length;
		line=line.substr(tabs);
		ArgMap.appendInDepth(struct,tabs,line);
	}
	var r;
	for(i in struct)
	{
		r = ArgMap.processStruct(struct[i],null,null);
		//if (ArgMap.rootItem!=null) ArgMap.rootItem = r;
	}
	return ArgMap.rootItem!=null?ArgMap.rootItem:r;
}	
