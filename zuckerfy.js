/*===========================================
* * *     I'm Mark Zuckerberg           * * * 
=============================================

"I'm Mark Zuckerberg" is a Chrome extension that customises your Facebook 
experience by replacing all your friends profile images and names with 
Mark Zuckerberg.

Aim:
    Try to replace the existance of all usernames and profile images with
    Mark Zuckerberg within the Facebook DOM, as to give the illusion that
    its just you and Mark there.

TODO:
    *   Refine selector locations to be more element specific and hunt out
        un-applied profile images and usernames.

    *   Correctly label with comments all the DOM selectors.

    *   Maybe Add with multiple images of Mark to spice it up a bit.

    * Publish: https://developer.chrome.com/webstore/publish
*/
"use strict";

function main() {
    var mark = new Mark();
    mark.zuckerfy();
}

const MarkZuckerberg = "Mark Zuckerberg",
      MarkImage128   = chrome.extension.getURL("mark_xoxo/mark128.png"),
      MarkImage512   = chrome.extension.getURL("mark_xoxo/mark512.png");


function Mark() {
    /* Mark's purpose is to zuckerfy everything. It has one public method 'zuckerfy'
    which ads MutationObserver functions to DOM elements that contain usernames or profile
    images. These functions will update the DOM dynamically whenever a new instance of any
    given selctions becomes ready (similar to an inital document ready function). */

    this.zuckerfy = function() { 
        // Intialise site-wide observers.
        addUsernameObservers(fbUserNames.allSite);
        addImageObservers(fbUserImg.globalThumbs, MarkImage128);
        // Are we at the homepage or somewhere else?
        // Find out and add page specific observers.
        if (window.location.pathname == '/') {
            console.log("Home.");
            addUsernameObservers(fbUserNames.home);
        } else {
            console.log("page.");
            addUsernameObservers(fbUserNames.page);
            addImageObservers(fbUserImg.pageThumbs, MarkImage128);
            addImageObservers(fbUserImg.mainProfile, MarkImage512);
        }
    }
    // addImageObservers : call with a list of selectors and
    // a specific size image to relplace with.
    function addImageObservers(locations, image) {
        for (var i = 0; i < locations.length; i++) {
            ready(locations[i], function(element) {
                element.src = image;
            });
        }
    }
    // addUsernameObservers : Usernames are allways replaced
    // with "Mark Zuckerberg". Call with different selectors
    // depending on page the location.
    function addUsernameObservers(locations) {
        for (var i = 0; i < locations.length; i++) {
            ready(locations[i], function(element) {
                element.textContent = MarkZuckerberg;
            });
        }
    }
    // TODO: data tooltip selectors so when elements are hovered
    // on they pop up with mark.
}

/* Selector locations. *
========================
These are probally going to change pretty often. 
*/
var fbUserNames = {
    allSite: [
        ".fwb.fcg a",                   // Feed post header.
        ".fwb a",                       // Feed post header.
        ".tickerFeedMessage span.fwb",  // top right side feed notifications.
        "a.profileLink",                // 
        "a.UFICommentActorName",        // Feed post comments.
        "._55lr",                       // Right sidebar contact.
        "._364g",                       // sidebar search result.
        ".titlebarText.fixemoji span",  //
        ".author.fixemoji span",        // Blue navigation messages drop-down.
        "div._4l_v span.fwb",           // notifications dropdown.
        "a._zci",                       // name on videos pictures ?
        ".tooltipText span"             // pop ups ? 
    ],
    home: [
        ".fbRemindersTitle strong",     // reminders like birthdays.
        "a.fwn",                        // when you click on birthday's and a list pops up.
        ".name span.nameText",          // little right name links.
        "._1fw3"                        // stories.
    ],
    page: [ 
        ".alternate_name",               // under main name.
        "#fb-timeline-cover-name",       //
        "._33vv a",                      // Page Name.
        "._50f3",                        // friends tiles (profile page).
        "a.nameButton span.uiButtonText" // secondary header.
    ]
};

var fbUserImg = {
    globalThumbs: [
        "img._s0._4ooo._5xib._5sq7._44ma._rw.img",  // Post thumbnail.
        "img._s0._4ooo._5xib._44ma._54ru.img",      // Sponsored link that others liked.
        "._38vo img._s0._4ooo._5xib._44ma.img",     // Shared post.
        "._3b-9 img.UFIActorImage._54ru.img",       // Comments.
        "._55lt img.img",                           //
        "._31o4._3njy img.img",                     //
        "img._s0._4ooo.tickerStoryImage._54ru.img", // Top right notifications.
        ".img._s0._rw.img"                          //
    ],
    pageThumbs: [
        "img._s0._4ooo._1ve7._3s6v._rv.img",        // Friends list.
        "img._s0._4ooo._1ve7._rv.img"               // friends list in friends list page.
    ],
    mainProfile: [
        "img.profilePic.img",                       // main profile image normal user.
        "img._4jhq.img"                             // Page profile pic on far left style.
    ]
};

/* 'ready' Utility. *
=====================
Creates MutationObservers so our selected elements will change to Mark when 
they are dynamically created by facebook.
Written by Ryan Morr.
http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/ 
*/
(function(win) {
    var listeners = [], 
        doc = win.document, 
        MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
        observer;
    
    function ready(selector, fn) {
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }
    function check() {
        // Check the DOM for elements matching a stored selector
        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                element = elements[j];
                // Make sure the callback isn't invoked with the 
                // same element more than once
                if (!element.ready) {
                    element.ready = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                }
            }
        }
    }
    // Expose `ready`
    win.ready = ready; 
})(this);

/* Run Main... */
main();