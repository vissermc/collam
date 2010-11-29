rem rmdir /s Y:\http\subleme\data /q 2>nul
cd /d "%~dp0"
..\tyle\tylerun.bat %~0
// 

///// functions
otlog=getTickCount!; pts=puts;
trace=? ( pts{$,' [',0.001*(getTickCount!-otlog),"]\r\n"}; otlog=getTickCount!;);

///// init
trace('start');
httpPath=$[0].!RE_rep{`(.**\\).++`,'\1'};
projectPath='collam';
testMode=1;
showLog=?();
include(httpPath+'tyledHttp.tyle');
trace('finish init');
///// main
getJSONTriple(currentItem);
act(0,0,1000,0.3);
///// end
trace('done');
quit!;

#q
