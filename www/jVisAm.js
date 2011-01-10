function Connection()
{
	this.prototype.new = function(argument,conclusion,probability)
	{
		this.id=getNewId();
		this.arguments=[];
		this.argument=argument;
		this.conclusion=conclusion;
		this.hasArrowPoint=1;
		this.probability=probability;
	}
	this.prototype.getConclusions=function()
	{
		return [this.conclusion];
	}
	this.prototype.calcProbability=function()
	{
		var m=this.probability;
		//putline(.?{this.data->calcProbability()}); putline(.?{this.argument->getText(),this.conclusion->getText()});
		for(a in this.arguments)
		{	m*=this.arguments[a].calcProbability();
		}
		return (this.probability<0?1.0:0.0)+(m*this.argument.calcProbability());
	}
	this.prototype.getColor=function()
	{
		var cp=this.calcProbability();
		getCSSColor(this.probability<0?1.0-cp:cp,this.probability<0?[1,0,0]:[0,1,0]);
	}
	this.prototype.getText=function()
	{
		var p=this.probability;
		return this.hasArrowPoint?(p>=0?'supports'+(p==1.0?'':' '+p):'challenges'+(p==-1.0?'':' '+-p)):(p==1.0?null :''+p);
	}
}