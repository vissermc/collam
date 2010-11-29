<%
act(getp('type'),getp('index'),getp('item'),getp('item2'),getp('val')).!(
%>
<%=pageHead%>
<meta http-equiv="refresh" content="0;URL=<%=$%>" />
<script>
function init()
{<%
	$[0]!=()?(%>
		var val=prompt('<%=$[0]%>','<%=$[1]%>');
		window.location = val==null ? 'index.tsp' : window.location+'&val='+val;<%;
	):(%>
	window.location='index.tsp';<%
	);%>
}
</script>
</head>
<body onload="init();" >
</body>
</html><%
);
%>
