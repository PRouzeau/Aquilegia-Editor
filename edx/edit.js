"use strict";
var aqlO = {};
var xpage="", xpara="";
var pagePos=[], pagePosEnd=[], pageName=[], pageNameNor=[];

/* Aquilegia editor (c) Pierre Rouzeau 2016   Licence GPL V2 or any later version + MIT  */
/* Use finediff by Raymond Hill and Markitup by Jay Salvat - MIT license*/
$(document).ready(function(){
	$('#texta').markItUp(mySettings); // $('textarea').markItUp( { Settings }, { OptionalExtraSettings } );
	document.myform.gpg.onclick = function (e) { // goto page scrolling function
		e.preventDefault(); // stop submission
		var stext = "■"+document.myform.gopage.value;
		var texta = document.myform.texta;
		var txtastr = document.myform.texta.value;
		var posi = txtastr.toLowerCase().indexOf(stext.toLowerCase()); // take the position of the word in the text
		var posi2 = txtastr.toLowerCase().replace(" ","_").indexOf(stext.toLowerCase());
		posi = Math.max (posi, posi2);
		if (posi != -1) {// select the textarea and the word
			texta.value = txtastr.substr(0, posi+stext.length+100);
			texta.scrollTop = texta.scrollHeight;
			setTimeout(function(){ 
				texta.value = txtastr;
				texta.setSelectionRange (posi+1, posi+stext.length); // select the range on Chrome, but don't scroll to 	
				texta.focus();
			},200);
		}	
		else 
			alert(stext+' not found'); // alert word not found
	}
	$('#texta').click(function() { 
		$("#pgsuggest").hide();
	});
	$("#pgsuggest").click(function() { 
		$('#pgsuggest').hide();
	});
	$("#pglist").click(function() { 
		$('#pglist').hide();
	});
	$("#imglist").click(function() { 
		$('#imglist').hide();
		$('#imgtip').hide();
	});
	$("#imgtip").click(function() { 
		$('#imglist').hide();
		$('#imgtip').hide();
	});
	$('#fileinp').hover(function(){
		window.fltimeout = setTimeout(function(){
			$.get("listpages.php", function(data) { // get external pages from php
				var ll="", npage; // comment
				var pagelist = data.split("\n");
				pagelist.pop();
				pagelist.sort();
				pagelist.unshift("hlp");
				var i=0, ll="";
				for (var i=0; i<pagelist.length; i++) 
					ll+="<p><a href='javascript:insFile(\""+pagelist[i]+"\");'>"+pagelist[i]+"</a></p>";
				$("#pgsuggest").html(ll);
				$("#pgsuggest").show();
			});
		}, 1000);
	}, function(){
		clearTimeout(window.fltimeout);    
	});
	var url = window.location.href; 
	var hash = url.split('#')[1];
	if (hash) {
		var xfile = hash.split("/",1)[0].split("!")[0]; // 
		xpage = hash.split("/")[1];
		if (xpage) {
			xpara = xpage ? xpage.split("!")[1] : ""; 
			xpage = xpage ? xpage.split("!")[0] : ""; 
		}
		else {
			xpara = hash.split("/",1)[0].split("!")[1]; 
		}	
		xpara = xpara ? xpara : "";
		document.myform.flname.value = xfile;
		loadPage();
	}
});

function insFile(file) {
	document.myform.flname.value =file;
	$('#btnload').click();
}

function forceSave() {
	document.myform.forcesave.value = "force save";
	$("#warn_edit").hide();
	$("#svp").click(); // document.myform.submit();  do not define submit value
}

function launchIntoFullscreen(el) {
	if(el.requestFullscreen) 
		el.requestFullscreen();
	else if(el.mozRequestFullScreen) 
		el.mozRequestFullScreen();
	else if(el.webkitRequestFullscreen) 
		el.webkitRequestFullscreen();
	else if(el.msRequestFullscreen) 
		el.msRequestFullscreen();
}

function selPage (){
	var curPos = $('#texta').prop("selectionStart");
	var textastr = $('#texta').val();
	var textcut = textastr.substr (0,curPos);
	var start= textcut.lastIndexOf('■')+1;
	var end = textastr.indexOf ('■',curPos);
	if (end==-1) 
		end = textastr.length-1;
	var datatxt = textastr.substring (start, end);
	if (!datatxt)
		alert ('Cannot select a page. Is the cursor on a page ?');
	else {
		$.ajax({
			url: "savetest.php",
			type : 'POST',
			data: {key:datatxt},
		//	dataType: 'text',
		//	contentType: 'application/text',
			success: function(data) {
				//alert (data);
				dispPage("aqlpreview");
			},
			error: function() {
				alert('An error occurred while saving the page');
			}
		}); 
	}
}

function dispPage(page) {
	var loc = window.location.href;
	loc = loc.substring(0, loc.lastIndexOf("/"));
	loc = loc.substring(0, loc.lastIndexOf("/")+1);
	var ad = loc+"#hlp/"+page;
	window.open(ad, "_blank");
}

var loadedFile ="";
var origFile="";
function loadPage(e) {
	function findPara (content) {
		var pageTab = content.split('\n');
		var line, linelg, posPara=0;
		for (var j=0; j<pageTab.length; j++) {
			linelg = pageTab[j].length;
			if (pageTab[j].substr(0,2) == "==") {
				line = pageTab[j].replace (/^={2,4}[ ]*/g,"");
				if (xpara == hlpDefAnchor(line.trim()))
					break;	
			}
			posPara += linelg+1;
		}
		return [linelg, posPara];
	}
	//var $form = $(e.target).parent(); // any use ?
	var $form = $("#xform"); // Jquery ref (to use Serialize function)
	var store= document.myform.texta.value;
	document.myform.texta.value=""; // to not send the text for loading
	$.ajax({
		url: 'load.php',
		type: 'POST',
		data: $form.serialize(),
		success: function(result) {
			var tabres = result.split ("\n",2);
			var res = tabres[0].split ("res:")[1];
			if (res=="OK") {
				document.myform.sha1.value = tabres[1].split ("sha1:")[1]
				document.myform.texta.value = result.split ("text:")[1];
				origFile  = document.myform.texta.value;
				loadedFile = document.myform.flname.value;
				if (xpage) {
					listP(); // list pages in the file
					var i = pageNameNor.indexOf(xpage);
					if (xpara) {
						var t = findPara (document.myform.texta.value.substring (pagePos[xpage], pagePosEnd[xpage]));
						goPos(pagePos[xpage]+t[1], t[0], 120);
					}
					else
						goPos(pagePos[xpage], xpage.length, 120);
					xpage = "";
				}
				else { // independant page
					var t = findPara (document.myform.texta.value);
					goPos(t[1], t[0], 120);
				}
			}
			else {
				document.myform.flname.value = loadedFile;
				alert(res);
			}	
		},
		error: function() {
			document.myform.flname.value = loadedFile;
			alert('An error occurred while loading the page');
		}
	});
	document.myform.texta.value=store;
}

function history() {
	window.open ('history.php?hpage='+document.myform.flname.value,'_self',false);
}

function resetPage() {
	document.myform.texta.value=origFile;
}	

function savePage(e) {
var dtidx=0, j=1, oldpn, newpn, tabnewpage=[];
	var $form = $(e.target).parent();
	var revtag = document.myform.revision.value.trim();
	if (!revtag) {
		alert ("Page not saved\nThere is no revision tag");
		return;
	}
	revtag = ":"+revtag;
	var taboldpage = origFile.split ("■");
	if (loadedFile=="aquilegia_syntax")
		tabnewpage[0] = document.myform.texta.value; // no split as separator exist in block
	else 
		tabnewpage = document.myform.texta.value.split ("■");	
	var today = "(:date "+aqldate()+":)";
	if (tabnewpage.length>1) 
		for (var i=1; i<tabnewpage.length; i++) {
			oldpn = hlpNamePage (z(taboldpage[j]).split("\n",1)[0].split(/[,;]/)[0]);
			newpn = hlpNamePage (tabnewpage[i].split("\n",1)[0].split(/[,;]/)[0]);
		/*	var o = taboldpage[j];	var n = tabnewpage[i];
			var on = taboldpage[j].length;	var nn = tabnewpage[j].length; */
			if 	((taboldpage[j]!=tabnewpage[i]) && tabnewpage[i].match(/\(:date.*?:\)/)) {
				tabnewpage[i] = tabnewpage[i].replace(/\(:date.*?:\)/, today);  
				revtag = "/"+newpn+revtag;
			}	
			else if (!tabnewpage[i].match(/\(:date.*?:\)/)){
				dtidx = tabnewpage[i].split("\n", 2).join("\n").length+1;
				tabnewpage[i] = insertStr (tabnewpage[i], dtidx, today); 
				revtag = "/"+newpn+revtag;
			}
			if (oldpn==newpn) j=j+1;		
		}
	else {
		if (taboldpage[0]!=tabnewpage[0] && tabnewpage[0].match(/\(:date.*?:\)/)) 
			tabnewpage[0] = tabnewpage[0].replace(/\(:date.*?:\)/,today);  	
		else if (!tabnewpage[0].match(/\(:date.*?:\)/)) {
			dtidx = tabnewpage[0].split("\n", 2).join("\n").length+1;
			tabnewpage[0] = insertStr (tabnewpage[0], dtidx, today); 
		}
	}	
	//alert (tabnewpage.join("■"));
	document.myform.texta.value = tabnewpage.join("■"); 
	document.myform.revision.value = revtag;
	$.ajax({
		url: 'save.php',
		type: 'POST',
		data: $form.serialize(),
		success: function(result) {
			var tabres = result.split ("\n",2);
			if (tabres[0].substr(0,4)=="res:") {
				var res = tabres[0].split ("res:")[1];
				if (res=="OK") {
					document.myform.sha1.value = tabres[1].split ("sha1:")[1]
					document.myform.revision.value ="";
					origFile = document.myform.texta.value; // save successful, so reset original file
					var dt = new Date();
					$("#msgresult").html(dt.getTime());
				}	
				else if (res=="concurrent")
					$("#warn_edit").show();
				else if (res=="unchanged") 
					$("#msgresult").html("unchanged");
				else	
					alert (res);
			}
			else 
				alert ("Program problem, 'save.php' returned:\n"+result);
		},
		error: function() {
			alert('An error occurred while saving the page');
		}
	});
}

function listP () {
	pageNameNor = []; // reinit when called multiple times
	var textastr = $('#texta').val();
	var res;
	var regexp = /■([^,\n]*)/g;
	var pNorm, prec="";
	while ((res = regexp.exec(textastr)) !== null) {
		pNorm = hlpNamePage(res[1]);
		pagePos  [pNorm] = res.index+1;
		pageName [pNorm] = res[1]; // not normalised
		pageNameNor.push (pNorm);
		if (prec) 
			pagePosEnd[prec] = pagePos [pNorm]-1;
		prec = pNorm;
	}
	pagePosEnd [pNorm] = textastr.length;
	pageNameNor.sort();	
}

function listPages () { // internal page for scrolling
	var ll="";
	if ($("#pglist").css("display")=="block")
		$("#pglist").hide();
	else {
		listP();
		for (var i=0; i<pageNameNor.length; i++)
			ll+="<p><a href='javascript:goPos("+pagePos[pageNameNor[i]]+","+pageNameNor[i].length+", 100);'>"+pageName[pageNameNor[i]]+"</a></p>"
		$("#pglist").html(ll);
		$("#pglist").css("left","380px");
		$("#pglist").css("top","46px");
		$("#pglist").css("display","block");
	}
}

function linkPages () { // all pages to add link
var tabexclu = ["hlpdef", "hlpfoot", "hlphead", "hlpdiag", "menu"]; // some page already filtered
	if ($("#pglist").css("display")=="block")
		$("#pglist").hide();
	else {
		$.get("listpages.php", function(data) { // get external pages from php
			var ll="", title, npage, pgl; // comment
			var pagelist = data.split("\n"); 
			var index = pagelist.indexOf("imglist");
			if (index > -1) 
				pagelist.splice(index, 1);
			pagelist.pop(); // eject last empty line of external pages
			var textastr = document.myform.texta.value;
			var i=0, li =[], idx = [], res, ll="";
			var regexp = /■([^,\n]*).*?\n(.*?)\n/g;
			while ((res = regexp.exec(textastr)) !== null) {
				if (tabexclu.indexOf(res[1].toLowerCase())==-1) 
					pagelist.push(res[2].replace(/^={2,4}/, "").trim()+"♥"+res[1]); // sorted by title, not page name
			}	
			pagelist = pagelist.sort(function (a, b) {
				return a.toLowerCase().localeCompare(b.toLowerCase()); // case insensitive sorting
			}); 
			for (var i=0; i<pagelist.length; i++) {
				pgl = pagelist[i].split("♥");
				if (pgl[1]) {
					title = pgl[0];
					npage = pgl[1];
				}	
				else {
					title = pgl[0].replace (/_/g," ");
					npage = pgl[0];
				}	
				npage = npage.trim().toLowerCase().replace (/[\t ]/g,"_");
				ll+="<p class='pindent'><a class='secindent' href='javascript:insBl(\" %"+title+"%"+npage+" \");'>"+title+"</a></p>"
			}	
			$("#pglist").html(ll);
			var rg = $(document.documentElement).width()- $("#pglist").width() -20;
			$("#pglist").css("left",rg);
			$("#pglist").css("top","16px");
			$("#pglist").show();
		});
	}	
}

var imglist; // required as global to show the image tooltip

function listImg () {
	if ($("#imglist").css("display")=="block")
		$("#imglist").hide();
	else {
		$.get( "listimg.php", function(data) {
			var ll="", ext;
			imglist = data.split("\n"); 
			for (var i=0; i<imglist.length; i++) {
				ext = imglist[i].substr(-4).toLowerCase();
				if (ext==".png" || ext==".jpg" || ext==".svg")
					ll+="<p><a href='javascript:insBl(\" 280%"+imglist[i]+" \");' class='showi img"+i+"'>"+imglist[i]+"</a></p>"
			}	
			$("#imglist").html(ll);
			var rg = $(document.documentElement).width()- $("#imglist").width() -20;
			$("#imglist").css("left",rg);
			$("#imglist").show();
			$('.showi').hover(function(){
				var imgx = $(this);
				window.imgbtimeout = setTimeout(function(){
					var imgcl = imgx.attr("class").split(' ');
						var imgad = "../h/d/";
						var idx = imgcl[1].substr(3);
						var content = "<a href='javascript:insBl(\" 280%"+imglist[idx]+" \");'>"+
							"<img border='1' src='../h/d/"+imglist[idx]+"' width='128'></a>"
						$("#imgtip").html(content);
						$("#imgtip").css ("left",imgx.offset().left+40);
						var tp = Math.min (imgx.offset().top, $(document.documentElement).height()- $("#imgtip").height()-10);
						$("#imgtip").css ("top", tp);
						$("#imgtip").css("display", "block");
					}, 800);
			}, function(){
				clearTimeout(window.imgbtimeout);    
			});
		});
	}	
}

function insBl (str) { // insert a block in textarea at current position and select it. similar to insertBlock in Markitup 
// is there any interest to make the inserted string a range object ? 
	var texta = document.myform.texta;
	var curPos = texta.selectionStart;
	var textastr = texta.value;
	texta.value  = textastr.slice(0, curPos) + str + textastr.slice(curPos);
	texta.selectionStart=curPos;
	texta.selectionEnd=curPos+str.length;
	texta.focus();
}

function replaceBl (newstr) { // replace block at current position and reselect
// is there any interest to make the inserted string a range object ? 
	var texta = document.myform.texta;
	var curPos = texta.selectionStart;
	var curPosEnd = texta.selectionEnd;
	var textastr = texta.value;
	texta.value = textastr.slice(0, curPos) + newstr + textastr.slice(curPosEnd);
	texta.selectionStart=curPos;
	texta.selectionEnd=curPos+newstr.length;
	texta.focus();
	return (newstr.length-(curPosEnd -curPos)); // return the index delta 
}

function goPos (posi, width, offset) {
	var texta = document.myform.texta;
	var txtastr = texta.value;	
	texta.value = txtastr.substr(0, posi+offset);
	texta.scrollTop = texta.scrollHeight;
	texta.value = txtastr;
	texta.setSelectionRange (posi, posi+width); // select the range on Chrome, but don't scroll to 	
	texta.focus();
}

function searchRep(caseSens) {
	searchRep.tabPos=[];
	var strSearch = prompt ("Search ?"); 
	searchRep.lenStr = strSearch.length;	
	searchRep.strReplace = prompt ("Replace by ?");
	var textaStr = document.myform.texta.value;
	if (!caseSens) {
		var textsearch = textaStr.toLowerCase(); 	
		strSearch = strSearch.toLowerCase();
	} else 
		var textsearch = textaStr; 
	var k=-1;
	while((k=textsearch.indexOf (strSearch,k+1)) >= 0) 
		searchRep.tabPos.push(k);
	searchRep.idx = -1;
	var dtop =	$(document.documentElement).height()- $("#modal_dialog").height()-80;
	$("#modal_dialog").css("top", dtop);
	dialogsrp(); // initialise dialog box
	srp();
}

function srp () {
	searchRep.idx++;
	if (searchRep.idx < searchRep.tabPos.length) {
		goPos (searchRep.tabPos[searchRep.idx], searchRep.lenStr, 20);
		$("#modal_dialog").show();
	}
}

function dialogsrp() { //confirm box as confirm()  don't work in FireFox, it hides the selection, ok in Chrome
	$("#modal_dialog input").off("click"); 
    $("#modal_dialog .title").html("Replace text ?");
    $('#modal_dialog #btnYes').click(function() {
        $("#modal_dialog").hide();
        var delta = replaceBl (searchRep.strReplace);
		for (var j=searchRep.idx+1; j <searchRep.tabPos.length; j++)
			searchRep.tabPos[j] += delta;
		srp();
    });
    $('#modal_dialog #btnNo').click(function() {
        $("#modal_dialog").hide();
        srp();
    });
	$('#modal_dialog #btnAbort').click(function() {
        $("#modal_dialog").hide();
    });
}

//== Utility functions ========================================================
function aqldate(){
	var mth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var d = new Date();
	var hr  = ("0" + Number(d.getHours())).slice(-2);
	var min = ("0" + Number(d.getMinutes())).slice(-2);
	return d.getDate()+' '+mth[d.getMonth()]+' '+d.getFullYear()+' '+hr+":"+min;
}

function hlpNamePage (name) { // transform string in page name - normalise or escape accented chars ?
	return z(name).trim().toLowerCase().replace(/[\t ]+/g ,'_');
}

function hlpDefAnchor (a) { // for anchors special chars are replaced by a dot followed by hex code, like wikimedia
    a= a.replace (/\s+/g,'_').toLowerCase(); // space replaced by underscores
    a= a.replace (/[^\w-]/g, function (match) { //replace special char by'.'+hex code. DOTS and COLON ARE ESCAPED 
		return ('.' + match.charCodeAt(0).toString(16)); //code char -> .Hex 
	});
	return a; 
}

function insertStr (source, index, string) {// insertion of a string within another - index CAN BE undef
    return (index) ? source.substr(0, index) + string + source.substr(index) : source;
}
function z(val) {return (val||'');} // Make empty strings of undefined
