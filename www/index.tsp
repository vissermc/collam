<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%
//putline(indent(.?getJSONTriple(currentItem,-1)));
include(projectPath+'collam.tyle');
.hasEmptyParam;
paramDefaults={:'vp_f_p_min'=>0.0,'tf_p_min'=>0.0,'tf_p_max'=>1.0,'vp_f_p_max'=>1.0,'vp_f_ip_min'=>0.0,'tf_ip_min'=>0.0,'tf_ip_max'=>1.0,'vp_f_ip_max'=>1.0};
.params=message.params%!($.data==''||$.data==''(paramDefaults[$.key])?(hasEmptyParam=1;):$);
hasEmptyParam ?
(	%>
	<script>document.location='<%=message.addr+'?'+params2url({:}(params))%>';</script>
	</head><%
):
(
	message.params+=paramDefaults; // this does not override existing
	.viewPoint=0({:'all'=>1,'premises'=>2,'id'=>3}[getp('viewpoint')]);
	.roots=
		viewPoint?
		:	endconc
		:   items // todo: user can also track in deleted items
		:	premises
		:	{:items[getv('vp_id')]};
%>
<style>
body
{
	font-size:14px;
	margin:0;
	padding:0;
}
#header
{
	overflow: auto;
	background-color: #66ff66;
	border: 2px solid #33aa33;
	border-style: none none solid none;
	visibility:hidden;
	height:0px;
}
div.headerElem
{
	padding: 3px;
	border: 2px none #33aa33;
	float: left;
}
#viewfilter
{
	border-style: none solid none solid;
}
div.headerElem div
{
	overflow: auto;
}
div.headerElem div div
{	float: left;
	margin-right: 10px;
}
div.headerElem div div div
{
	float: none;
}
div.headerElemHeader
{	border: 1px solid #22dd22;
	background-color:#ccffcc;
	padding:2px;
}
div.headerElemHeader div
{
	margin-bottom:3px;
}

div.headerSubElemTitle, div.headerElemTitle
{
	font-size:14px;
	font-weight: bold;
	margin-bottom: 5px;
}
div.headerElemTitle
{
	font-size:18px;
}

div.treeContainer
{
	width:100%;
	margin-left:2px 0 2px 0;
	padding-left:20px;
}
div.box
{
	float:left;
	clear:left;
	text-align:center;
	background-color:#88ff88;
	padding:4px;
	margin:5px 0px 5px 0px;
	cursor: pointer;
	-moz-border-radius: 5px;
	border-radius: 5px;	
}
div.arrowText,div.placeHolder
{
	float:left;
	clear:left;
	z-index:2;
	position:relative;
	-moz-border-radius: 5px;
	border-radius: 5px;	
	padding:1px 4px 1px 4px;
}
div.placeHolder
{
	float:left;
	clear:left;
	height:25px;
}
div.line,div.shortlineHor,div.shortlineVert,div.hlineUp,div.hlineDown
{
	margin:0px;padding:0px;
	position:absolute;
	width:5px;height:5px;
	cursor: pointer;
}
div.hlineUp
{
	-moz-border-radius: 10px 0px 10px 10px;
	border-radius: 10px 0px 10px 10px;	
}
div.hlineDown
{
	-moz-border-radius: 10px 10px 0px 10px;
	border-radius: 10px 10px 0px 10px;	
}

div.shortlineHor
{	width:10px;
}
div.shortlineVert
{	height:7px;
	left:10px;
	background-color:black;
}
div.shortlineBottom
{
	position:relative;
	top:5px;
}
div.shortlineTop
{
	position:relative;
	top:-12px;
}
div.arrow0, div.arrow1, div.arrow2,div.arrow3
{
	z-index:2;
	margin:0px;
	position:absolute;
	background-color:#88ff88;
	font-weight:bold;
	font-size:25px;
	overflow:hidden;
	cursor: pointer;
}
div.arrow1,div.arrow3
{
	width:8px;height:17px;
}
div.arrow0, div.arrow2
{
	width:17px;height:8px;
}
div.arrow1 img
{
	position:relative;right:9px;
}
div.arrow2 img
{
	position:relative;bottom:9px;
}

div.probabilityBox
{
	border: 1px solid #aaaaaa;
	background-color: white;
	-moz-border-radius: 3px;
	border-radius: 3px;	
}
div.itemText, div.probabilityBox
{
	display:inline-block;
	padding: 2px;
	margin-right: 5px;
}
a.menuItem 
{
	display:block;
}
div.floatMenu
{
	visibility:hidden;
	position:absolute;left:30px;top:30px; z-index:3;
	border: 1px solid black;
	border-color: #f2f2f2 #333333 #333333 #f2f2f2;
	padding:5px;
	background-color:#cccccc;
}
a.action {
	font-family: sans-serif;
  background-color: #e4d9d9;
  padding: 1px 4px 1px 4px;
  border-left: 1px solid white;
  border-right: 1px solid black;
  border-top: 1px solid white;
  border-bottom: 1px solid black;
}
a.action:hover,a.action:visited,a.action:link
{ color: black;
}
a.action {
  display: inline;
}
a:link, a:visited, a:hover {
	text-decoration: none;
}
a:link {
	color: #0000ee;
}
a:hover {
	background: #fffefd;
	color: #0000ff;
}
a:visited {
	color: #aa00cc;
}
input.pvalue, input.id
{	width:30px;
}
</style>
<script language="javascript" type="text/javascript" src="index.js"></script>
<script language="javascript" type="text/javascript">
function init()
{
	document.addEventListener('click',hideMenu,false);
	eFloatMenus={<%=
	menus:!(format('"<>": document.getElementById("floatMenu<>"),',{$}*2))%>
	};
		//eFloatMenus.push(document.getElementById('floatMenu'+i));
	eContainer=document.getElementById('container');
	var triple=<%=tyle2json(getJSONTriple(currentItem,-1))%>;
	fillSpider(eContainer,triple);
}
</script>
</head>
<body onload="init();" >
<div id="header">
	<div id="project" class="headerElem">
		<div>
			<div class="headerElemTitle">Project</div>
		</div>
		<div>
			<a href="#">New...<a>
		</div>
		<div>
			Select...
		</div>
		<div>
			Delete
		</div>
		<div>
			Save to PC
		</div>
		<div>
			Load from PC
		</div>
	</div>
	<form action="index.tsp" method="get">
		<div id="viewfilter" class="headerElem">
			<div>
				<div class="headerElemTitle">View Filter</div>
				<div><%=htmlCheckbox("tf_save")%>Save&nbsp;<input type="submit" value="Update"></input>&nbsp;&nbsp;<a href="#">Select...<a></div>
			</div>
			<div>
				<div>
					<div class="headerSubElemTitle">Versioning</div>
					<div><%=htmlCheckbox("tf_tracked")%>Track changes</div>
					<div><%=htmlCheckbox("tf_accept")%>Accept all once</div>
					<div><%=htmlCheckbox("tf_latest")%>Show latest</div>
					</div>
				<div>
					<div class="headerSubElemTitle">Viewpoint</div>
					<%=htmlRadio('viewpoint',{{'','end conclusions'},{'all'},{'premises'},{'id','<input type="text" name="vp_id" class="id"></input>'}},viewPoint)%>
				</div>
				<div>
					<div class="headerSubElemTitle">Viewpoint filter</div>
					<div>P between <%=htmlText('vp_f_p_min','pvalue')%> and <%=htmlText('vp_f_p_max','pvalue')%></div>
					<div>Internal P between <%=htmlText('vp_f_ip_min','pvalue')%> and <%=htmlText('vp_f_ip_max','pvalue')%></div>
					<div>Text: <%=htmlText('vp_f_text','searchtext')%></div>
				</div>
				<div>
					<div class="headerSubElemTitle">Tree filter</div>
					<div>P between <%=htmlText('tf_p_min','pvalue')%> and <%=htmlText('tf_p_max','pvalue')%></div>
					<div>Internal P between <%=htmlText('tf_ip_min','pvalue')%> and <%=htmlText('tf_ip_max','pvalue')%></div>
					<div>Text: <%=htmlText('tf_text','searchtext')%></div>
					<div><%=htmlCheckbox("tf_repeat")%>Repeat</div>
				</div>
			</div>
		</form>
	</div>
</div>

<%
	menus%!<i>(%>
<div id="floatMenu<%=i.key%>" class="floatMenu"><%=
		ctup(@i.data):!(
			i.data[$][1]?i.data[$][0]+"<br>" : 
			'<a class="menuItem" href="#" onclick="return menuClick('+("'",i.key,"'")+','+$+');">'+i.data[$][0]+'</a>'
		)%>
</div><%
	);%>
<div class="treeContainer" id="container" style="width:1200px;">
</div>
</body><%
);
%>
</html>