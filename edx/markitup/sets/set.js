// -------------------------------------------------------------------
// markItUp! http://markitup.jaysalvat.com/  Copyright (C) 2008 Jay Salvat
// Adapted for Aquilegia by Pierre Rouzeau 2016
// -------------------------------------------------------------------
var mySettings = {
	markupSet:  [ 	
		{name:'Heading 1', key:'1', openWith:'== ', closeWith:'', placeHolder:'Your title here...' },
		{name:'Heading 2', key:'2', openWith:'=== ', closeWith:'', placeHolder:'Your title here...' },
		{name:'Heading 3', key:'3', openWith:'==== ', closeWith:'', placeHolder:'Your title here...' },
		{separator:'---------------' },		
		{name:'Bold', key:'B', openWith:"**", closeWith:"**"}, 
		{name:'Italic', key:'I', openWith:"//", closeWith:"//"}, 
		{name:'Underlined', key:'U', openWith:"__", closeWith:"__"}, 
		{name:'Deleted', key:'D', openWith:'<del>', closeWith:'</del>'},
		{name:'Highlight', key:'H', openWith:'^^', closeWith:'^^'},
		{separator:'---------------' },
		{name:'Bulleted list', openWith:'(!(* |!|*)!)'}, 
		{name:'Numeric list', openWith:'(!(# |!|#)!)'}, 
		{separator:'---------------' },
	//	{name:'Picture', key:'P', replaceWith:'[![Size]!]%[![Source]!]' },
	//	{name:'Link', key:'L', openWith:'%[![Text]!]%[![Link]!]'},
		{name:'Link', key:'L', call:function() { linkPages() }},
		{name:'Url', key:'U', openWith:'"[![Text]!] [![Url:!:http://]!]"'},
		{name:'Picture', key:'P', call:function() { listImg() }}, 
		{separator:'---------------' },
		{name:'Quotes', openWith:'<q>', closeWith:'</q>', placeHolder:''},
		{name:'Code', openWith:'<<', closeWith:'>>'}, 
		{separator:'---------------' },
		{name:'Search and replace', call:function() { searchRep(false) }},  
		{name:'Page list', call:function() { listPages() }}, 
		{separator:'---------------' },
		{name:'Preview', call:function() { selPage() }}, 
		{name:'Fullscreen', call:function(){launchIntoFullscreen(document.documentElement)}}, //document.body->black background
		{name:'Syntax', call:function() { loadPage('aquilegia_syntax') }} 
	]
}
