// ==UserScript==
// @name        YouTube Cinema Mode
// @description Improves the YouTube experience by maximizing video player real-estate and fixing some common annoyances.
// @license     MIT
// @match       https://www.youtube.com/*
// @version     0.2.0
// @run-at      document-start
// @grant       none
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @namespace   https://greasyfork.org/en/users/4614
// ==/UserScript==

////////////////////////////////////////////////////////////////
// Main Operations
////////////////////////////////////////////////////////////////

// Detect the type of YouTube page loaded
var isWatchPage = location.href.indexOf("https://www.youtube.com/watch?") === 0;

// Start or install operation handlers
onDocumentStart();
$(document).on("ready", onDocumentEnd);
$(window).on("load", onWindowLoad);

// Operations that are run as early as possible during page load
function onDocumentStart()
{
	installUnsafewindowPolyfill();
	disableSPF();

	if (isWatchPage)
	{
		disableMatchMedia();
		installFullSizePlayerStylesheet();
	}
}

// Operations that run when DOMContentLoaded event is fired
function onDocumentEnd()
{
	if (isWatchPage)
	{
		installTopBarAutohide();
		expandVideoDescription();
		installPlayerAutoFocus();
		installPlaylistRepositioner();
	}
	
	installPlayerAutoPause();	
}

// Operations that run when window is loaded (after YouTube scripts are run)
function onWindowLoad()
{
	if (isWatchPage)
	{
		setTimeout(switchPlayerToTheaterMode, 2000);
    }
}

////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////

// Ensure unsafeWindow object is available both in firefox and chrome
function installUnsafewindowPolyfill()
{
	if (typeof unsafeWindow === 'undefined')
	{
		if (typeof XPCNativeWrapper === 'function' && typeof XPCNativeWrapper.unwrap === 'function')
			unsafeWindow = XPCNativeWrapper.unwrap(window);
		else if (window.wrappedJSObject)
			unsafeWindow = window.wrappedJSObject;
	}
}

// Disable SPF (Structured Page Fragments), which prevents properly attaching to page load events when navigation occurs 
// Will also disable the red loading bar.
function disableSPF()
{
	if (unsafeWindow._spf_state && unsafeWindow._spf_state.config)
	{
		unsafeWindow._spf_state.config['navigate-limit'] = 0;
		unsafeWindow._spf_state.config['navigate-part-received-callback'] = function (targetUrl) { location.href = targetUrl; }
	}
	
	setTimeout(disableSPF, 50);
}

// Disable matchMedia - allow proper resizing of the video player and its contents.
function disableMatchMedia()
{
	window.matchMedia = undefined;
}

// Add full-size player page stylesheet (works correctly only in theater mode).
function installFullSizePlayerStylesheet()
{
	$("head").append(
		"<style type='text/css'>" +
		"body { overflow-x: hidden !important; overflow-y: scroll !important; }" +
		"#masthead-positioner-height-offset { display: none }" +
		"#masthead-positioner { visibility: hidden; opacity: 0; transition: opacity 0.2s ease-in-out; }" +
        ".player-width { width: 100% !important; margin: 0px !important; left: 0px !important; right: 0px !important; }" +		
		".player-height { height: 100vh !important; }" +
		"</style>");
}

// Switch player to theater mode if in default mode.
function switchPlayerToTheaterMode()
{
	if ($("div#page").hasClass("watch-non-stage-mode"))
		$("button.ytp-size-button, div.ytp-size-toggle-large").click();
}

// Auto shows/hides the top bar when mouse enters/leaves (for use with watch pages).
function installTopBarAutohide()
{
	var topBar = getTopBar();
	var videoPlayer = getVideoPlayer();
	var videoPlayerElement = videoPlayer[0];
	
	function topBarIsVisible()
	{
		return topBar.css("visibility") === "visible";
	}
	
	function showTopBar()
	{
		topBar.css("visibility", "visible");
		topBar.css("opacity", "1");
	}
	
	function hideTopBar()
	{
		topBar.css("opacity", "0");
		topBar.css("visibility", "hidden");
	}
	
	function toggleTopBar()
	{
		if (topBarIsVisible())
			hideTopBar();
		else
			showTopBar();
	}
	
	function getScrollTop()
	{
		return $(document).scrollTop();
	}
	
	function onPageScroll()
	{
		if (getScrollTop() > 0)
			showTopBar();
		else
			hideTopBar();
	}
	
	function onKeyDown(e)
	{
		if (e.which === 27)
		{
			if (getScrollTop() === 0)
			{
				toggleTopBar();
				
				if (topBarIsVisible())
					setTimeout(function () { $("input#masthead-search-term").focus() }, 200);
			}
		}
	}
	
	$(document).on("keydown", onKeyDown);
	$(document).on("scroll", onPageScroll);
}

// Continously auto-focus the player whenever the top bar is invisible.
function installPlayerAutoFocus()
{
	function focusPlayer()
	{
		if (getTopBar().css("visibility") !== "visible")
		{
			$(".html5-video-player").focus();
		}
		
		setTimeout(focusPlayer, 20);
	}
	
	focusPlayer();
}

// Expands video description
function expandVideoDescription()
{
	$("#action-panel-details").removeClass("yt-uix-expander-collapsed");	
}

// Correct the positioning of the playlist on window resize. 
function installPlaylistRepositioner()
{
	$("#watch-appbar-playlist").removeClass("player-height");
	
	function onResize()
	{
		var playlistContainer = $("#watch-appbar-playlist");
		
		if (playlistContainer.length === 0)
			return;
		
		var playlistOffset = playlistContainer.offset();
		playlistOffset.top = $("#watch-header").offset().top;
		playlistContainer.offset(playlistOffset);
	}
	
	onResize();
	$(window).resize(onResize);
}

// Pauses playing videos in other tabs when a video play event is detected (works in both watch and channel page videos)
function installPlayerAutoPause()
{
	// Note: the channel page has another hidden video except the main one (if it exists). The hidden video doesn't have an "src" attribute.
	var videoPlayer = getVideoPlayer();

	if (videoPlayer.length === 0)
	{
		//console.log("Player not found, retrying in 100ms..");
		setTimeout(installPlayerAutoPause, 100);
		return;
	}
	
	var videoPlayerElement = videoPlayer.get(0);
	
	// Generate a random script instance ID
	var instanceID = Math.random().toString();		
	
	function onVideoPlay()
	{
		localStorage["YouTubeCinemaMode_PlayingInstanceID"] = instanceID;
		
		function pauseWhenAnotherPlayerStartsPlaying()
		{
			if (localStorage["YouTubeCinemaMode_PlayingInstanceID"] !== instanceID)
				videoPlayerElement.pause();
			else
				setTimeout(pauseWhenAnotherPlayerStartsPlaying, 10);
		}
		
		pauseWhenAnotherPlayerStartsPlaying();
	}
	
	// If video isn't paused on startup, fire the handler immediately
	if (!videoPlayerElement.paused)
		onVideoPlay();
	
	// Add event handler for the "play" event.
	videoPlayer.on("play", onVideoPlay);
}

// Get the video player element
function getVideoPlayer()
{
	return $('video.html5-main-video').filter(function (index) { return $(this).attr("src") !== undefined});
}

// Get the top bar element
function getTopBar()
{
	return $("#masthead-positioner");
}