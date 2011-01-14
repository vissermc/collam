function Connection(argument,conclusion,probability)
{
	this.id=getNewId();
	this.arguments={};
	this.argument=argument;
	this.conclusion=conclusion;
	this.probability=probability;
}
Connection.prototype.hasArrowPoint=1;
/*Connection.prototype.getConclusions=function()
{
	return {this.conclusion.id};
}*/
Connection.prototype.calcProbability=function()
{
	var m=this.probability;
	//putline(.?{this.data->calcProbability()}); putline(.?{this.argument->getText(),this.conclusion->getText()});
	for(a in this.arguments)
	{	m*=this.arguments[a].calcProbability();
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
	this.arguments={};
	this.conclusions={};
	this.probability=probability;
}
Item.prototype.hasArrowPoint=0;
/*Item.prototype.getConclusions=function()
{
	return this.conclusions;
}*/
Item.prototype.calcProbability=function()
{
	var m=1.0;
	for(a in this.arguments)
	{	m*=this.arguments[a].calcProbability();
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
	return '&#x2116;&nbsp;'+this.id+(prop!=1.0?'&nbsp;&nbsp;P&nbsp;'+prop);
}

function Or()
{
}
Or.prototype = New Item;
Or.prototype.calcProbability=function()
{
	var m=1.0;
	for(a in this.arguments)
	{	m*=1.0-this.arguments[a].calcProbability();
	}
	return 1.0-m;
}
Or.prototype.getText=function()
{
	return 'or';
}
function And()
{
}
And.prototype = New Item;
And.prototype.getText=function()
{
	return 'and';
}

function Proposition(text,probability)
{
	this.text=text;
	this.probability=probability;
}
Proposition.prototype = New Item;
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
Item.prototype.getTagText=function(prop)
{	
	return (Item.prototype.getTagText.call(this,prop))+(this.probability!=1.0 ? '&nbsp;('+this.probability+')');
}

getItemJSONProps=?<[Item]i>
(	{: 'type'=>i->type, 'box'=>{:'urlTail'=>format('&type=<>&item=$<>',{i->type, i.id}),'text'=>i->getText(),'probBox'=>i->getTagText(i->calcProbability()),'color'=>i->getColor()}}
);

getJSONItemConclusionTree=?<[Item]item,level>
(
	level ? ( 
		//.c=item->getColor();
		{:}(item.conclusions %!
		(
			$.key.class!=connectionClass?
			{
				[Item]($.key).id,
				getItemJSONProps($.key)+
				{:	
					'arrow'=>
					{:
						'mode'=>($.key->hasArrowPoint*2)/*|(@$.key.arguments>1?4)|(level==1&&$.key.conclusions?8)*/,
						'color'=>$.data->getColor(),
						'urlTail'=>urlTailForConnection(item,$.key), 
						'text'=>$.data->getText()
					},
					'metaChildren'=>getJSONArgumentTree($.data,level-1), 
					'children'=>getJSONItemConclusionTree($.key,level-1)
				}
			}
		))%!$.data
	)
);

getJSONArgumentTree=?<[TrackedObject]object,level>
(
	level ? 
	(	
		{:}(getValidArgs(object)%!
		{	$.key.id,
			getItemJSONProps($.key)+
			{: 
				'arrow'=>
				{:
					'mode'=>(object->hasArrowPoint|1)/* | (@$.key.conclusions>1?4)|(level==1&&getValidArgs($.key)?16)*/, 
					'color'=>$.data->getColor(),
					'urlTail'=>urlTailForConnection($.key,object), 
					'text'=>$.data->getText(),
				},
				'metaChildren'=>getJSONArgumentTree($.data,level-1),
				'children'=>getJSONArgumentTree($.key,level-1)
			}
		}
		)%!$.data
	)
);

getJSONTriple=?<[Item]center,level>
(
	.l=getItemJSONProps(center)['box'];
	getJSONItemConclusionTree(center,level-1),
	l,//+{(level==1&&getValidConclusions(center)?8)|(level==1&&getValidArgs(center)?16)},
	getJSONArgumentTree(center,level-1)
);
