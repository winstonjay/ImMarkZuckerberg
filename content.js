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
    *   Update selector lists to be more page specific, as to reduce the 
        number of active MutationObservers. This will require editing the
        Mark.zuckify method to filter out un-needed selections also.

    *   Refine selector locations to be more element specific and hunt out
        un-applied profile images and usernames.

    *   Correctly label with comments all the DOM selectors.

    *   Re-write without jQuery dependency.

    *   Maybe Add with multiple images of Mark to spice it up a bit.
*/
"use strict";

$(document).ready(function() {
    var mark = new Mark();
    mark.zuckify();
});


const MarkZuckerberg = "Mark Zuckerberg",
      MarkImage128   = chrome.extension.getURL("mark_xoxo/mark128.png"),
      MarkImage512   = chrome.extension.getURL("mark_xoxo/mark512.png");


function Mark() {
    /* Mark xoxoxoxo */
    this.pageurl = window.location.href;

    this.zuckify = function() {
        replaceUsernames(fbNameLocations);
        replaceImages(fbProfileThumbs, MarkImage128);
        // Are we at the homepage or somewhere else?
        if (!this.pageurl.endsWith(".com/")) {
            replaceImages(fbProfilePicture, MarkImage512);
        }
    }

    // replaceImages : call with a list of selectors and
    // a specific size image to relplace with.
    function replaceImages(locations, image) {
        for (var i = 0; i < locations.length; i++) {
            ready(locations[i], function(element) {
                $(element).attr('src', image);
            });
        }
    }

    // replaceUsernames : Usernames are allways replaced
    // with "Mark Zuckerberg". Call with different selectors
    // depending on page the location.
    function replaceUsernames(locations) {
        for (var i = 0; i < locations.length; i++) {
            ready(locations[i], function(element) {
                $(element).text(MarkZuckerberg);
            });
        }
    }
}

/* Selector locations. *
========================
These are probally going to change pretty often. 
*/

// fbNameLocations :
// Locations of text affected by replaceUsernames().
var fbNameLocations = [
    ".fwb.fcg a",                   // Feed post header.
    ".fwb a",                       // Feed post header.
    ".tickerFeedMessage span.fwb",  // top right side feed notifications.
    "a.profileLink",                // 
    "a.UFICommentActorName",        // Feed post comments.
    "._55lr",                       // Right sidebar contact.
    "#fb-timeline-cover-name",      //
    ".titlebarText.fixemoji span",  //
    ".author.fixemoji span",        // Blue navigation messages drop-down.
    ".fbRemindersTitle strong",     // reminders like birthdays.
    "div._4l_v span.fwb",           // notifications dropdown.
    "a._zci",                       // name on videos pictures ?
    ".tooltipText span",            // pop ups ?

    // Following items are forming the basis of a seperate list
    // that are not present in the hompage.
    "._33vv a",                      // Page Name.
    "._50f3",                        // friends tiles (profile page).
    "a.nameButton span.uiButtonText",// secondary header.

    // just on homepage
    "a.fwn"                         // when you click on birthday's and a list pops up.
];

// fbProfileThumbs : 
// Locations of images affected by replaceUserThumbnails().
var fbProfileThumbs = [
    "img._s0._4ooo._5xib._5sq7._44ma._rw.img",  // Post thumbnail.
    "img._s0._4ooo._5xib._44ma._54ru.img",      // Sponsored link that others liked.
    "._38vo img._s0._4ooo._5xib._44ma.img",     // Shared post.
    "._3b-9 img.UFIActorImage._54ru.img",       // Comments.
    "._55lt img.img",                           //
    "._31o4._3njy img.img",                     //
    "img._s0._4ooo.tickerStoryImage._54ru.img", // Top right notifications.
    ".img._s0._rw.img",                         //


    "img._s0._4ooo._1ve7._3s6v._rv.img"         // Friends list.
]; 

// fbProfilePicture : 
// Locations of images affected by replaceUserProfileImages().
var fbProfilePicture = [
    "img.profilePic.img",               // main profile image normal user.
    "img._4jhq.img",                    // Page profile pic on far left style.
];


/* 'ready' Utility. *
=====================
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

