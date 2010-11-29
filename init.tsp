<%
include(projectPath+'collam.tyle');

pageHead=
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
  '<html xmlns="http://www.w3.org/1999/xhtml">'+
  '<head>'+
  '<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />';

htmlRadio=?<name,[:{value,text}]options,checkIndex>
(
	.i=-1;
	options:!
	(	i+=1;
		format('<div><input type="radio" name="<>" value="<>" <>></input><></div>',{name,$.value,checkIndex==i?'checked',$[-1]})
	)
);

htmlText=?<name,class>( format('<input type="text" name="<>" class="<>" value="<>"></input>',{name,class,txt2html(getp(name))}));
htmlCheckbox=?<name>
( format('<input type="checkbox" name="<>" <>></input>',{name,getp(name)=='on'?'checked'})
);

getCSSColor=?<v,rgb>
(
	.l=0(v*85).!{170-$,170+$}:!hex!;
	format('#<|2><|2><|2>',{l[rgb[0]],l[rgb[1]],l[rgb[2]]})
);

//generateTextInputData=?([{name,[=>]data}]$; 'type="text" name="'+$.name+'" id="'+$.name+'" value="'+$.data[$.name]+'"');
//generateRadioInputData=?([{name,value,[=>]data}]$; 'type="radio" name="'+$.name+'" value="'+$.value+'"'+($.data[$.name]==$.value?' checked'));

  
//------------- { implementations of functions that are called by tyledHttp.tyle
useHTTPS=0;

serializeVariables = ? <[session]> // O: all data that should be stored on disk when leaving
( //{: "user" } @ $.variables
);
unserializeVariables = ? <[session]> // I: session in which the element 'variable' contains data loaded from disk; O: variables
// converts the loaded data into
( //$.variables 
);
initProject=?
( collam_init!;
);
quitProject = ? 
(
);
//-------------- }

%>
