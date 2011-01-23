nextID=0;
function getNewId()
{
	nextID++;
	return nextID;
}

function Connection(argument,conclusion,probability)
{
	this.id=getNewId();
	this.argumentConns={};
	this.argument=argument;
	this.conclusion=conclusion;
	this.probability=probability;
}
Connection.prototype.hasArrowPoint=1;
/*Connection.prototype.getconclusionConns=function()
{
	return {this.conclusion.id};
}*/
Connection.prototype.calcProbability=function()
{
	var m=this.probability;
	//putline(.?{this.data->calcProbability()}); putline(.?{this.argument->getText(),this.conclusion->getText()});
	for(a in this.argumentConns)
	{	m*=this.argumentConns[a].calcProbability();
	}
	return (this.probability<0?1.0:0.0)+(m*this.argument.calcProbability());
}
Connection.prototype.getColor=function()
{
	var cp=this.calcProbability();
	getCSSColor(this.probability<0?1.0-cp:cp,this.probability<0?[1,0,0]:[0,1,0]);
}
Connection.prototype.getText=function()
{
	var p=this.probability;
	return this.hasArrowPoint?(p>=0?'supports'+(p==1.0?'':' '+p):'challenges'+(p==-1.0?'':' '+-p)):(p==1.0?null :''+p);
}

function Item()
{
	this.id=getNewId();
	this.argumentConns={};
	this.conclusionConns={};
}
Item.prototype.hasArrowPoint=0;
/*Item.prototype.getconclusionConns=function()
{
	return this.conclusionConns;
}*/
Item.prototype.calcProbability=function()
{
	var m=1.0;
	for(a in this.argumentConns)
	{	m*=this.argumentConns[a].calcProbability();
	}
	return m;
}
Item.prototype.getColor=function()
{
	var cp=this.calcProbability();
	getCSSColor(cp,cp<0?[1,0,0]:[0,1,0]);
}
Item.prototype.getText=function()
{
	var p=this.probability;
	return this.hasArrowPoint?(p>=0?'supports'+(p==1.0?'':' '+p):'challenges'+(p==-1.0?'':' '+-p)):(p==1.0?null :''+p);
}
Item.prototype.getTagText=function(prop)
{	
	return '&#x2116;&nbsp;'+this.id+(prop!=1.0?'&nbsp;&nbsp;P&nbsp;'+prop:'');
}
Item.prototype.getItemJSONProps=function()
{
	return { 'box': { 'text':this.getText(),'probBox':this.getTagText(this.calcProbability()),'color':this.getColor() } };
}

function Or()
{
	Item.call(this);
}
Or.prototype = new Item;
Or.prototype.calcProbability=function()
{
	var m=1.0;
	for(a in this.argumentConns)
	{	m*=1.0-this.argumentConns[a].calcProbability();
	}
	return 1.0-m;
}
Or.prototype.getText=function()
{
	return 'or';
}
function And()
{
	Item.call(this);
}
And.prototype = new Item;
And.prototype.getText=function()
{
	return 'and';
}

function Proposition(text,probability)
{
	Item.call(this);
	this.text=text;
	this.probability=probability==null?1.0:probability;
}
Proposition.prototype = new Item;
Proposition.prototype.calcProbability=function()
{
	return this.probability * Item.prototype.calcProbability.call(this);
}
Proposition.prototype.getText=function()
{
	return this.text;
}

Proposition.prototype.hasArrowPoint = 1;
/*
	$.getTagText=?<prop><[Item]this>
	(	.p=getPropData(this).probability;
		(Item.prototype.getTagText(prop))+(p!=1.0 ? '&nbsp;('+p+')')
	);
*/
Proposition.prototype.getTagText=function(prop)
{	
	return (Item.prototype.getTagText.call(this,prop))+(this.probability!=1.0 ? '&nbsp;('+this.probability+')' : '');
}

function connectItems(argument,conclusion, strength)
{
	var c=new Connection(argument,conclusion,strength);
	argument.conclusionConns[c.id]=c;
	conclusion.argumentConns[c.id]=c;
}

function getJSONItemConclusionTree(item,level)
{
	if (!level)
		return [];
	var r=[];
	for (i in this.conclusionConns)
	{
		var cc=this.conclusionConns[i];
		//.c=item->getColor();
		if (cc.conclusion.prototype!=Connection.prototype)
		{
			var ps=getItemJSONProps(cc.conclusion);
			ps.arrow=
				{
					'mode': (cc.conclusion.hasArrowPoint*2)/*|(@$.key.argumentConns>1?4)|(level==1&&$.key.conclusionConns?8)*/,
					'color': cc.getColor(),
					//'urlTail': urlTailForConnection(item,$.key), 
					'text': cc.getText()
				};
			ps.metaChildren=getJSONArgumentTree(cc,level-1);
			ps.children=getJSONItemConclusionTree(cc.conclusion,level-1);
			r.push( [ cc.conclusion.id, ps ] );
		}
	}
	r.sort();
	var rr=[];
	for(ri in r)
	{	rr.push(r[ri][1]);
	}
	return rr;
}

function getJSONArgumentTree(object,level)
{
	if (!level)
		return [];
	var r=[];
	for (i in this.argumentConns)
	{
		var cc=this.argumentConns[i];
		{
			ps.arrow=
				{
					'mode': (/*object.hasArrowPoint|*/1)/*|(@$.key.argumentConns>1?4)|(level==1&&$.key.conclusionConns?8)*/,
					'color': cc.getColor(),
					//'urlTail': urlTailForConnection(item,$.key), 
					'text': cc.getText()
				};
			ps.metaChildren=getJSONArgumentTree(cc,level-1);
			ps.children=getJSONArgumentTree(cc.argument,level-1);
			r.push( [ cc.argument.id, ps ] );
		}
	}
	r.sort();
	var rr=[];
	for(ri in r)
	{	rr.push(r[ri][1]);
	}
	return rr;
}

function getJSONTriple(center,level)
{
	var l=getItemJSONProps(center).box;
	return {
		'topTree': getJSONItemConclusionTree(center,level-1),
		'center': l,//+{(level==1&&getValidconclusionConns(center)?8)|(level==1&&getValidArgs(center)?16)},
		'bottomTree': getJSONArgumentTree(center,level-1)
	};
}

function testFill(target)
{
	var p1=new Proposition('final conclusion');
	var p2=new Proposition('center conclusion');
	var p3=new Proposition('arg 1');
	var p4=new Proposition('arg 2',0.2);
	var p5=new Proposition('arg 3');
	var p6=new Or();
	var p7=new Proposition('arg 4');
	var p8=new Proposition('arg 5');
	connectItems(p2,p1,1);
	connectItems(p3,p6,1);
	connectItems(p5,p6,1);
	connectItems(p6,p2,1);
	connectItems(p4,p2,-1);
	connectItems(p7,p5.conclusionConns[p6.id],-1);
	connectItems(p8,p7.conclusionConns[p5.conclusionConns[p6.id].id],1);
	var currentItem=p2;
	fillSpider(target,getJSONTriple(currentItem,-1));
}