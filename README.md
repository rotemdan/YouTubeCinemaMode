# YouTube Cinema Mode

Maximizes YouTube's video player to fill the entire browser viewport and fixes a few minor annoyances:

* Disables SPF (Structured Page Fragments), which also disables the thin red loading bar animation. This is required, in general, for the script to load reliably.
* Auto-hides the top bar on watch pages for even greater player size - will be automatically hidden when the page is scrolled to the top, though can be toggled with the escape key (which will also focus the search bar).
* Auto-pauses any existing playing YouTube video (in any tab) when playback is started/resumed (supports both watch pages and channel pages).
* Auto-focuses the video player to enable player keyboard controls whenever the watch page is scrolled to the top (also adds the additional shortcuts ctrl+left/ctrl+right to navigate to previous/next video).
* Auto-expands video description.

## Installation

1. Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (Chrome).
2. Click [this link](https://github.com/rotemdan/YouTubeCinemaMode/raw/master/YouTube_Cinema_Mode.user.js) and then the "install" button when it appears.

## New features and customization

The script is designed as a basic one-size-fits-all set of modifications to enhance the YouTube experience for some people (but possibly wouldn't fit everyone), originally made for my own personal use. There are no current plans to add major new features or any customization options.

## Running alongside other YouTube enhancements scripts

It may or may not work side-by-side with other YouTube scripts or extensions, conflicting behaviors may possibly be avoided by configuring the secondary script(s).

## Reusing the code

I tried to organize the code so other developers could learn and benefit from individual features for use in other scripts. Feel free to fork or simply copy/paste into your own work.

## Version history

* _0.2.x_: Added video autofocus. Fixed playlist positioning (for most cases). Changed top bar autohide behavior on watch pages (see description).
* _0.1.x_: Initial release.
