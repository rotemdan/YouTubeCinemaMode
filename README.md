# YouTube Cinema Mode

Improves the YouTube experience by maximizing video player real-estate and fixing some common annoyances.

* Maximizes player to fit the entire viewport area.
* Auto-hides the top bar on watch pages for maximum space utilization (will be hidden when the page is scrolled to the top, and can also be toggled with escape key - which will also focus the search bar).
* Auto-pauses other playing videos (in any tab) when playback is started/resumed (supports both watch pages and channel pages).
* Disables SPF (Structured Page Fragments, AKA red loading bar).
* Auto-focuses the video player to allow keyboard controls to be immediately effective. This happens on load and whenever the top bar is invisible.
* Auto-expands video description.

Supports the HTML5 player only. Tested with both the latest Firefox and Chrome (using the latest Greasemonkey/Tampermonkey). Works with both the current (red/black) player and the newer, transparent one, which can be enabled [here](https://www.youtube.com/testtube) (recommended).

## Installation

* Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (Chrome).
* Click [this link](https://github.com/rotemdan/YouTubeCinemaMode/raw/master/YouTube_Cinema_Mode.user.js) and then the "install" button when it appears.

## Running alongside other YouTube scripts

Because of duplicate and conflicting behaviours, it doesn't seem to work well alongside [YouTube Center](https://github.com/YePpHa/YouTubeCenter) (depending on the particular YTC settings used). Other YouTube scripts may or may not work correctly in parallel.

## Reusing the code

I tried to organize the code so other developers could benefit from individual features for use in other scripts. Feel free to fork or simply copy/paste into your own work.

## New features and customization

The script is designed as a basic one-size-fits-all solution to improve the YouTube experience for some people. There are currently no plans to add major new features or customization (say, similarly to highly customizable scripts such as [YouTube Center](https://github.com/YePpHa/YouTubeCenter)) as it would be difficult and time-consuming to maintain in the long term. Improvements/expansions of the implementation of the current features and behaviours are planned and suggestions are welcome.

## Version history

* 0.2: Added video autofocus. Fixed playlist positioning (in most cases). Changed top bar autohide behavior on watch pages (see description). 
* 0.1: Initial release.
