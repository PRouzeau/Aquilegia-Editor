"use strict";
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
	$("#pglist").click(function() { 
		$('#pglist').hide();
	})
	$("#imglist").click(function() { 
		$('#imglist').hide();
		$('#imgtip').hide();
	})
	$("#imgtip").click(function() { 
		$('#imglist').hide();
		$('#imgtip').hide();
	})
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
				$("#pglist").html(ll);
				$("#pglist").css("left","75px");
				$("#pglist").css("top","20px");
				$("#pglist").show();
			});
		}, 800);
	}, function(){
		clearTimeout(window.fltimeout);    
	});
});

function insFile(file) {
	document.myform.flname.value =file;
	$('#btnload').click();
}

function forceSave() {
	document.myform.forcesave.value = "force save";
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
				loadPage("aqlpreview");
			},
			error: function() {
				alert('An error occurred while saving the page');
			}
		}); 
	}
}

function loadPage(page) {
	var loc = window.location.href;
	loc = loc.substring(0, loc.lastIndexOf("/"));
	loc = loc.substring(0, loc.lastIndexOf("/")+1);
	var ad = loc+"#hlp/"+page;
	window.open(ad, "_blank");
}

function listPages () { // internal page for scrolling
	if ($("#pglist").css("display")=="block")
		$("#pglist").hide();
	else {
		var textastr = $('#texta').val();
		var pos =[], name = [], res, ll="";
		var regexp = /■([^,\n]*)/g;
		while ((res = regexp.exec(textastr)) !== null) {
			pos [res[1]] = res.index+1;
			name.push (res[1]);
		}
		name.sort();
		for (var i=0; i<name.length; i++)
			ll+="<p><a href='javascript:goPos("+pos[name[i]]+","+name[i].length+", 100);'>"+name[i]+"</a></p>"
		$("#pglist").html(ll);
		$("#pglist").css("left","380px");
		$("#pglist").css("top","46px");
		$("#pglist").css("display","block");
	}
}

function linkPages () { // all pages to add link
	if ($("#pglist").css("display")=="block")
		$("#pglist").hide();
	else {
		$.get("listpages.php", function(data) { // get external pages from php
			var ll="", clean, npage; // comment
			var pagelist = data.split("\n"); 
			pagelist.pop();
			var textastr = document.myform.texta.value;
			var i=0, li =[], idx = [], res, ll="";
			var regexp = /■([^,\n]*)/g;
			while ((res = regexp.exec(textastr)) !== null) 
				pagelist.push(res[1]);
			pagelist.sort();
			for (var i=0; i<pagelist.length; i++) {
				clean = pagelist[i].replace (/_/g," ");
				npage = pagelist[i].trim().toLowerCase().replace (/[\t ]/g,"_");
				ll+="<p><a href='javascript:insBl(\" %"+clean+"%"+npage+" \");'>"+clean+"</a></p>"
			}	
			$("#pglist").html(ll);
			var rg = $(document.documentElement).width()- $("#pglist").width() -20;
			$("#pglist").css("left",rg);
			$("#pglist").css("top","6px");
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

