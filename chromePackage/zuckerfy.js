/*
"I'm Mark Zuckerberg" is a Chrome extension that customises your Facebook 
experience by replacing all your friends profile images and names with 
Mark Zuckerberg.

Aim:
    Try to replace the existance of all usernames and profile images with
    Mark Zuckerberg within the Facebook DOM, as to give the illusion that
    its just you and Mark online.

TODO:
    *   Refine selector locations to be more element specific and hunt out
        un-applied profile images and usernames. 

    *   Correctly label with comments all the DOM selectors.

    *   Publish: https://developer.chrome.com/webstore/publish
*/
"use strict";

// Main called at the end of the file.
function imMarkZuckerbergMain() {
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
        // Intialise site-wide observers. Inital tried to seperate 
        // selectors of different page types. no refresh reloads 
        // were messing this up, instead of a work-around just 
        // add all mutation observers.
        addUsernameObservers(fbUserNameLocations);
        addImageObservers(fbUserThumbLocations, MarkImage128);
        addImageObservers(fbUserProfileLocations, MarkImage512);
    }


    function addImageObservers(locations, image) {
        // Call with a list of selectors and a specific 
        // size image to relplace with
        for (var i = 0; i < locations.length; i++) {
            ready(locations[i], function(element) {
                if (element.alt.includes("your Profile Photo")) {
                    return
                }
                element.src = image;
            });
        }
    }

    function addUsernameObservers(locations) {
        // Usernames are allways replaced with "Mark Zuckerberg". 
        // Call with different selectors depending on page the location.
        for (var i = 0; i < locations.length; i++) {
            ready(locations[i], function(element) {
                // Js counts everything including whitespace as a child-node.
                if (!element.hasChildNodes()) {
                    return
                }
                // We dont want to overite an element.
                if (element.childNodes[0].nodeType === Node.ELEMENT_NODE) {
                    return
                }
                element.textContent = MarkZuckerberg;
            });
        }
    }
    // TODO (maybe): data tooltip selectors so when elements 
    // are hovered on they pop up with mark.
}

/* Username locations */
var fbUserNameLocations = [
    ".fwb.fcg a",                    // Feed post header.
    ".fwb a",                        // Feed post header.
    ".tickerFeedMessage span.fwb",   // top right side feed notifications.
    "a.profileLink",                 // 
    "a.UFICommentActorName",         // Feed post comments.
    "._55lr",                        // Right sidebar contact.
    "._364g",                        // sidebar search result.
    ".titlebarText.fixemoji span",   //
    ".author.fixemoji span",         // Blue navigation messages drop-down.
    "div._4l_v span.fwb",            // notifications dropdown.
    "a._zci",                        // name on videos pictures ?
    ".tooltipText span",             // pop ups ? 
    "._3q34 span",                   // messages notifications. ???
    "._5v0s._5my8",                  // trending list.

    ".fbRemindersTitle strong",      // reminders like birthdays.
    "a.fwn",                         // when you click on birthday's and a list pops up.
    ".name span.nameText",           // little right name links.
    "._1fw3",                        // stories.
    
    "._1qt5._5l-3 span._1ht6",       // In messenger page ajax.
    "h2._17w2 span._3oh-",           // messenger page header.

    ".alternate_name",               // under main name.
    "#fb-timeline-cover-name",       //
    "._33vv a",                      // Page Name.
    "._50f3",                        // friends tiles (profile page).
    "a.nameButton span.uiButtonText" // secondary header.
];

/* User image locations */
var fbUserThumbLocations = [
    "img._s0._4ooo._5xib._5sq7._44ma._rw.img",  // Post thumbnail.
    "img._s0._4ooo._5xib._44ma._54ru.img",      // Sponsored link that others liked.
    "._38vo img._s0._4ooo._5xib._44ma.img",     // Shared post.
    "._3b-9 img.UFIActorImage._54ru.img",       // Comments.
    "._55lt img.img",                           //
    "._31o4._3njy img.img",                     //
    "img._s0._4ooo.tickerStoryImage._54ru.img", // Top right notifications.
    ".img._s0._rw.img",                         //
    "._4ld- img.img",                           // chat contact search results.
    "img._62bh.img._8o._8r._2qgu.img",          // notififications dropdown..
    "._1fw9._1fw0._1fwa img._1fwb.img",         // stories.
    "._2ar2 img._s0._4ooo.img",                 // post reactions popup.

    "img._s0._4ooo._1ve7._3s6v._rv.img",        // Friends list.
    "img._s0._4ooo._1ve7._rv.img",              // friends list in friends list page.

    "img._62bi.img._8o._8r._2qgu.img",          // list in /notifications page.
];

var fbUserProfileLocations = [
    "img.profilePic.img",                       // main profile image normal user.
    "img._4jhq.img",                            // Page profile pic on far left style.
];

/* 
'ready' Utility.

Creates MutationObservers so our selected elements will change to Mark when 
they are dynamically created by facebook. Written by Ryan Morr. Link/source:
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

/* Finally run main... */
imMarkZuckerbergMain();