// ==UserScript==
// @name        YouTube Cinema Mode
// @description Improves the YouTube experience by maximizing video player real-estate and fixing some common annoyances.
// @license     MIT
// @match       https://www.youtube.com/*
// @version     0.1.11
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
		"#masthead-positioner { visibility: hidden; opacity: 0; transition: opacity 0.3s ease-in-out; }" +
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
	var topBarHoverTimeout;
	
	function cancelTopBarHoverTimeout()
	{
		if (topBarHoverTimeout)
		{
			clearTimeout(topBarHoverTimeout);
			topBarHoverTimeout = undefined;
		}
	}
	
	$(document).mouseleave(function (e)
	{
		cancelTopBarHoverTimeout()
	});
	
	$(document).mousemove(function (e)
	{
		if (e.pageY < 35)
		{
			var topBar = $("#masthead-positioner");
			
			if (!topBarHoverTimeout && topBar.css("visibility") === "hidden")
			{
				topBarHoverTimeout = setTimeout(function ()
				{
					topBar.css("visibility", "visible");
					topBar.css("opacity", "1");
					
					function onTopBarMouseLeave()
					{
						topBar.css("opacity", "0");
						topBar.css("visibility", "hidden")					    
					}
					
					$(document).one("mouseleave", onTopBarMouseLeave);
					$("div#player-api, div#content").one("mouseenter", onTopBarMouseLeave);
				}, 500);
			}
		}
		else
		{
			cancelTopBarHoverTimeout();
		}
	});
}

// Expands video description
function expandVideoDescription()
{
	$("#action-panel-details").removeClass("yt-uix-expander-collapsed");	
}

// Pauses playing videos in other tabs when a video play event is detected (works in both watch and channel page videos)
function installPlayerAutoPause()
{
	// Note: the channel page has another hidden video except the main one (if it exists). The hidden video doesn't have an "src" attribute.
	var videoPlayer = $('video.html5-main-video').filter(function (index) { return $(this).attr("src") !== undefined});

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
		console.log("play event triggered");
		unsafeWindow.localStorage["FullSizeYouTubePlayer_PlayingInstanceID"] = instanceID;
		
		function pauseWhenAnotherPlayerStartsPlaying()
		{
			if (unsafeWindow.localStorage["FullSizeYouTubePlayer_PlayingInstanceID"] !== instanceID)
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