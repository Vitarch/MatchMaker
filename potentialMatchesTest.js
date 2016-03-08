//
// Copyright 2011-2012 Vitarch, LLC. All RIGHTS RESERVED.
// 
// TODO: Need to update 'relationship' table when button is pressed. 2.29.12
// TODO: Find all the fields in user that is eligible for narrowing down the searches (e.g., is_minor?)  This is an important feature. 2.15.2012
// TODO: Move over to Graph.api
// NOTE: That the multiquery queries have problems.
// NOTE: The following API methods are deprecated and will not be available after January 1, 2012:
//
//    FB.Data.query
//    FB.Data.waitOn
// https://developers.facebook.com/blog/
//http://developers.facebook.com/blog/post/561/
// FB.Data is replaced by FB.api
//
// TODO: Debug the matches by using console.log everywhere.  Need to find a better way to step through code for debugging. 1.10.2012
//
//TODO: Get only opposite sex users who made a comment.
// TODO: Fix map.
//
// TODO: Only select comments from others, not the page owner because it causes errors. Aug 16, 2011
//
// TODO: Note there are duplicate likes data showing up!!!  July 12, 2011
// TODO: Sometimes it works and sometimes it doesn't.  July 15, 2011
//
// Major revision to output
// TODO: Include comments and which stream in output.
// NOTE: alert test shows that it never enters comment section.
//
// TESTING: Why are there triplicates and duplicates depending on the limit set on the query templates commentQueryTemplate and userCommentQueryTemplate?
// Still duplicates with test on templates???
// Aug 10, 2011
// Major revision of structure. Aug 11, 2011
// TESTING: Array vs. Objects Aug 11, 2011 - Did not change the result.  The problem is elsewhere.
// Problem was in login.js by subscription calls.

// Bug: Duplicates Aug 12, 2011 select distinct doesn't work.  Found Bug: There can be many comments for one user.  Need to link comment with fromid and post_id
// Need to incorporate like in stream.  Even if someone doesn't have a comment, include users who like

      // no user, clear display
      function clearDisplay() {
console.log('Was in clearDisplay().  unknown response.status: ' + response.status);
        // document.getElementById('potential-matches').innerHTML = '';
        //document.getElementById('potential-matches-music').innerHTML = '';
        //document.getElementById('potential-matches-movies').innerHTML = '';
        //document.getElementById('potential-matches-likes').innerHTML = '';
      }

      function fqlQuery(response){
	// likes category of book, movie, public figure, and music

        // TODO: limit posts from the source_id Aug 14, 2011
        // TODO: Need to get posts from multiple threads. Oct 10, 2011
                // var streamQueryTemplate = 'select post_id, source_id, message, likes, permalink from stream where source_id= {0} and filter_key = \'others\' and is_hidden = 0 order by rand() limit 30';
var streamQueryTemplate = 'select post_id, source_id, message, likes, permalink from stream where source_id= {0} and is_hidden = 0 order by rand() limit 30';

                var commentQueryTemplate = 'select id, fromid, username, text, post_id from comment where post_id in (select post_id from {0}) order by rand() limit 6';
                // var userCommentQueryTemplate = 'select uid, sex, first_name, pic_square, profile_url from user where uid in (select fromid from {0}) limit 3';
// NOTE: gender in documentation for User table rather than sex but currently sex works and gender doesn't.  Facebook hasn't updated it yet.  11/13/2011
// BUG: The permission for user_relationships is not set.  Need to request additional permissions.
var userCommentQueryTemplate = 'select uid, sex, first_name, pic_square, profile_url from user where uid in (select fromid from {0}) and sex in (select interested_in from user where uid = me()) limit 3';

// Note: This test works Aug 1, 2012 TODO: delete this test
//FB.api('/me', function(response) {
//  alert('Your name is ' + response.name);
//});
// Test Aug 1, 2012


                FB.api('/me/friends', { limit: 10 }, function(response) {
                    var likeMusic = response.data[Math.floor(Math.random()*response.data.length)];

console.log("response in music: " + response.data.length);
//alert(response.data.length);

                 // TODO: Do this in Graph API 1.25.2012
                 // Note: sex is not working all the time.
                 getFQLQuery(likeMusic, "potential-matches-music");
		                    
                });
                
                FB.api('/me/movies', { limit: 10 }, function(response) {
                    var likeMovies = response.data[Math.floor(Math.random()*response.data.length)];
                    getFQLQuery(likeMovies, "potential-matches-movies");
                });
                
		// Graph API responses are JSON objects.  You can request either XML or JSON format in FQL query.
                FB.api('/me/likes', { limit: 30 }, function(response) {
		// alert(response.data[0].id);		

                var responseDataLength = response.data.length;

		var randNum = Math.floor(Math.random()*responseDataLength); // pick a random number between 0 and responseLength
                var likes = response.data[randNum];
                getFQLQuery(likes, "potential-matches-likes");
                }); // FB.api

                 // To debug: save this to a text then later database.  How to manipulate streamQuery? streamQuery is an array.  Note: No multi arrays in FB JS
	// var streamQuery = FB.Data.query('select post_id, actor_id, source_id, message, impressions from stream where target_id = {0} and source_id = {0} and is_hidden = 0', '146457222066414');
	// var streamQuery = FB.Data.query('select post_id, source_id, message, likes, permalink from stream where filter_key = \'others\' and source_id = {0} and is_hidden = 0', '219313031414196');

// 7/12/2011
// TODO: use temp tables and use where clauses after they are in the temp table.
// limit query results to 10,000 or less.  If it works then increase query results to more.
//
// put all user in a local table.
//

// BUG found and solved.  It was here.  Array assignment!!! Aug 9, 2011
// NOTE: Do not make assignments like this var var1 = var2 = {} unless you want them mapped together and you know what you are doing.
//

// TESTING: Mapping using Objects instead of arrays (i.e. user.uid {name, profile_url, user_pic_square}; user.uid.post_id {comment}
// var user = Object(); or var user = {name: , uid: , sex: , profile_url:, user_pic_square: }
// var post = {post_id: , comment: , stream_link: }                

            } // function fqlQuery


        function displayHTML(html, element) {
            var para = document.createElement("p");
            var txt1 = document.createTextNode(html);
            para.appendChild(txt1);

            var div1 = document.getElementById(element);

            div1.appendChild(para);

        }

        function displayHTML(html, element, uid) {
            var para = document.createElement("p");
            var txt1 = document.createTextNode(html);

            para.setAttribute("id", uid);
            para.appendChild(txt1);

            var div1 = document.getElementById(element);

            div1.appendChild(para);

        }


// Could the problem be the Node tree? Aug 9, 2011
        // TODO: onmouseover to display "show thread"
        function displayLink(html, element, url) {
            var para = document.createElement("p");

            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("target", "_blank");

            para.appendChild(link);

            var txt1 = document.createTextNode(html);
            link.appendChild(txt1);

            var div1 = document.getElementById(element);

            div1.appendChild(para);
        }

        function displayLink(html, element, url, uid, firstName, sex, commentText, fromIdEmail) {
            var para = document.createElement("p");
            para.setAttribute("id", uid);

            var link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("target", "_blank");

            para.appendChild(link);

            var txt1 = document.createTextNode(html);
            link.appendChild(txt1);

            
            // button
            var keepRelease = document.createElement("input");
            keepRelease.setAttribute("id", uid);
            keepRelease.setAttribute("value", "Keep");
            keepRelease.setAttribute("type", "button");
            // keepRelease.onclick = function(){ alert(keepRelease.id); };

            // get values to pass to function insert?
     
            keepRelease.onclick = function(){ $.post("insertUser.php", { facebook_uid: uid , first_name: firstName , link: url, email: fromIdEmail }, function(data) {
   alert("Data Loaded: " + data + " uid: " + uid);
 }); };              

// TODO: This is not working.  Database gets updated multiple times without any results.
//keepRelease.onclick = $.ajax({
//  type: "POST",
//  url: "insertUser.php",
//  data: "facebook_uid=uid&first_name=firstName&link=url&email=fromIdEmail"
//}).done(function( msg ) {
//  alert( "Data Saved: " + msg );
//});


            para.appendChild(keepRelease);


            var div1 = document.getElementById(element);
            div1.appendChild(para);

        }


	function displayImage(source, alternate, element, url) {
		
		var para = document.createElement("p");

                var link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("target", "_blank");

                 para.appendChild(link);

		var image = document.createElement("img");
		image.setAttribute("src", source);
		image.setAttribute("alt", alternate);
		
		link.appendChild(image);
		
		var div1 = document.getElementById(element);

            	div1.appendChild(para);
	
	}

	function getRandomNumber(count) {
   		count.wait(function(result) {
			var randomNumber = Math.floor(Math.random()*result); // pick a random number between 0 and Length of query result
    			return randomNumber;
   		});
	}



      function getFQLQuery(category, section) {

// TODO: Feb 7, 2012 Changed the query to not include friends (implementation of excluding 1st degree of separation).
// Note: NOT operator in FQL is not working.  Tried query:
// query2:'select uid, sex, first_name, pic_square, profile_url from user where uid in (select fromid from #query1) and sex in (select meeting_sex from user where uid = me()) and uid not in (SELECT uid2 FROM friend WHERE uid1 = me() and uid2 = uid)'
// DOES NOT WORK!!! so I reverted to usual.  Need to implement database query outside of FQL.
// May 15, 2012 There is a problem with query2.  Want to 
FB.api(
  {
    method: 'fql.multiquery',
    queries: {
       query0:'select post_id, source_id, message, likes, permalink from stream where source_id='+ category.id + ' and is_hidden = 0 order by rand() limit 30',
       query1:'select id, fromid, username, text, post_id from comment where post_id in (select post_id from #query0) order by rand() limit 6',
       query2:'select uid, sex, first_name, pic_square, profile_url from user where uid in (select fromid from #query1) limit 3'
    }
  },
  function(response){

 // build a map of post_id, fromid, uid to name
                    var comment = {};
                    var user = {};
                    var stream_link = {};

    FB.Array.forEach(response[1].fql_result_set, function(row) {
                         comment[row.id] = {text:row.text, post_id:row.post_id, fromid:row.fromid};
                         // alert(comment[row.id].text);
   });

   FB.Array.forEach(response[2].fql_result_set, function(row) {
                        user[row.uid] = {name:row.first_name,
                        sex:row.sex,
                        profile_url:row.profile_url,
                        pic_square:row.pic_square};
                    });

   FB.Array.forEach(response[0].fql_result_set, function(row) {
                        stream_link[row.post_id] = row.permalink;
                    });

var html = category.category + ": " + category.name;
                displayHTML(html, section);

                FB.Array.forEach(response[1].fql_result_set, function(row) {
                   if (user[row.fromid]) {
                    displayImage(user[row.fromid].pic_square, " ", section, user[row.fromid].profile_url);
                    html = user[row.fromid].name + '(' + user[row.fromid].sex + ')' + ' says ' + '"' + comment[row.id].text + '"';

                    // displayLink(html, section, stream_link[row.post_id]);
                    displayLink(html, section, stream_link[row.post_id], row.fromid, '"' + user[row.fromid].name + '"', '"' + user[row.fromid].sex + '"', '"' + comment[row.id].text + '"', '"' + user[row.fromid].email + '"');
                    }
                });
  });

      }



      // handle a session response from any of the auth related calls
      function handleUserLikesWithOthers(response) {
        // if we dont have a session, just hide the user info
        if (response.status == "connected") {
		fqlQuery(response); }
	else if (response.status == "not connected"){
		FB.login(response, {perms: 'user_about_me, email, user_interests, user_likes, user_location, user_relationships, user_relationship_details, friends_relationships, friends_relationship_details, user_education_history, user_hometown, offline_access', enable_profile_selector: 1});
	}
	else // "unknown"
	{
                console.log('unknown response.status: ' + response.status);
		clearDisplay();	}
      }

// run it once with the current status and also whenever the status changes
// FB.Event.subscribe('auth.login', handleSessionResponse);
//FB.Event.subscribe('auth.statusChange', handleSessionResponse);