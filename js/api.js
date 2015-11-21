var $ = require('jquery')
var tmpl = require('./templates')

var getUsers = function () {
  return $.get('http://localhost:3000/users')
  
  .fail(function() {
    console.log('Failure users');
  })
}

var getTweets = function () {
  return $.get('http://localhost:3000/tweets')

  .fail(function() {
    console.log('Failure tweets');
  })
}

var getReplies = function () {
  return $.get('http://localhost:3000/replies')

  .fail(function() {
    console.log('Failure replies');
  })

}

var processTweets = function (users) {
  
  users.forEach(function (user) {
    $.get('http://localhost:3000/users/' + user.id + '/tweets')
      .then(function (userTweets) {
        
        userTweets.forEach(function (userTweet) {
          
          userTweet.handle = user.handle
          userTweet.img = user.img
          
          $.get('http://localhost:3000/tweets/' + userTweet.id + '/replies')
            .then(function (replies) {
              
              $('#tweets').append(tmpl.renderThread(userTweet))
              
              replies.forEach(function (reply) {
                $.get('http://localhost:3000/users/' + reply.userId)
                  .then(function (userReply) {
                    
                    userReply.id = null;
                    userReply.message = reply.message;
                    $('#' + userTweet.id)
                      .parent('.thread')
                      .find('.replies')
                      .append(tmpl.renderTweet(userReply))
                  })
              })
            })
            .fail(function (xhr) {
              console.log(xhr.status);
            })
        })
      })
      .fail(function (xhr) {
        console.log(xhr.status);
      })
  })
}

module.exports = {
  getUsers: getUsers,
  getTweets: getTweets,
  getReplies: getReplies,
  processTweets: processTweets,
}