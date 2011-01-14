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
Or.prototype = New prototype;
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
And.prototype = New prototype;
And.prototype.getText=function()
{
	return 'and';
}
