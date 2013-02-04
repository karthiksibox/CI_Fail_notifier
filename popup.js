// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// var req = new XMLHttpRequest();
// req.open(
//     "GET",
//     "http://api.flickr.com/services/rest/?" +
//         "method=flickr.photos.search&" +
//         "api_key=90485e931f687a9b9c2a66bf58a3861a&" +
//         "text=hello%20world&" +
//         "safe_search=1&" +  // 1 is "safe"
//         "content_type=1&" +  // 1 is "photos only"
//         "sort=relevance&" +  // another good one is "interestingness-desc"
//         "per_page=20",
//     true);
// req.onload = showPhotos;
// req.send(null);
// 
// function showPhotos() {
//   var photos = req.responseXML.getElementsByTagName("photo");
// 
//   for (var i = 0, photo; photo = photos[i]; i++) {
//     var img = document.createElement("image");
//     img.src = constructImageURL(photo);
//     document.body.appendChild(img);
//   }
// }
// 
// // See: http://www.flickr.com/services/api/misc.urls.html
// function constructImageURL(photo) {
//   return "http://farm" + photo.getAttribute("farm") +
//       ".static.flickr.com/" + photo.getAttribute("server") +
//       "/" + photo.getAttribute("id") +
//       "_" + photo.getAttribute("secret") +
//       "_s.jpg";
// }
//
//

// 
// (function ($) {
// 
// /**
// * @function
// * @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
// * @param {function} handler A function to execute at the time when the element is inserted
// * @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
// * @example $(selector).waitUntilExists(function);
// */
// 
// $.fn.waitUntilExists    = function (handler, shouldRunHandlerOnce, isChild) {
//     var found       = 'found';
//     var $this       = $(this.selector);
//     var $elements   = $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
// 
//     if (!isChild)
//     {
//         (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
//             window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
//         ;
//     }
//     else if (shouldRunHandlerOnce && $elements.length)
//     {
//         window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
//     }
// 
//     return $this;
// }
// 
// }(jQuery));
var lastbuild;
function get_last_build()
{
xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","/job/Regression",false);
xmlhttp.send();
resp=xmlhttp.responseText;
resp=resp.substring(resp.indexOf("Build History")+13);
if(-1==resp.indexOf("transitive") && resp.indexOf("transitive")<=100)
  {
resp=resp.substring(resp.indexOf("Regression/")+11,resp.indexOf("console")-1)
  }
  if(-1!=resp.indexOf("transitive"))
     {
       resp=resp.substring(resp.indexOf("transitive")+11);
       resp=resp.substring(resp.indexOf("<tr>"));
resp=resp.substring(resp.indexOf("Regression/")+11,resp.indexOf("console")-1);
       
     }

lastbuild=resp;
}
get_last_build();

function reg_appender()
{
  get_last_build();
fail_div=document.createElement("div");
xmlhhtp2 = new XMLHttpRequest();
xmlhhtp2.open("GET","/job/Regression/"+lastbuild+"/artifact/tmp/rspec_output.html",false);
xmlhhtp2.send();
result_text=xmlhhtp2.responseText;
fail_count=0;
if(result_text.indexOf("failures")!=-1)
  {
fail_count=result_text.substring(result_text.indexOf("examples,")+10,result_text.indexOf("failures"));
  }
  if(result_text.indexOf("failures")==-1)
    {
fail_count=result_text.substring(result_text.indexOf("examples,")+10,result_text.indexOf("failure,"));
      
    }
fail_div.innerHTML=fail_count + "failed.";
fail_div.align="right"
fail_div.style.fontWeight=100
var rehome=document.getElementById("Regression");
function appendfailure(){rehome=document.getElementById("Regression");rehome.appendChild(fail_div)}
setInterval(function(){appendfailure()},1)
}

/* $("div#Regression").waitUntilExists */
reg_appender();
