/*TMODJS:{"version":18,"md5":"07dc67d1cd6ca3af753e89ee1a276c1c"}*/
template('tpl/list',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,list=$data.list,item=$data.item,i=$data.i,$escape=$utils.$escape,$out='';$out+='<ul> ';
$each(list,function(item,i){
$out+=' <li>编号：';
$out+=$escape(item.projectNum);
$out+=' &nbsp;&nbsp;姓名：';
$out+=$escape(item.projectName);
$out+='</a></li> ';
});
$out+=' </ul>';
return new String($out);
});