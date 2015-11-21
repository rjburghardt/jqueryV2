var $ = require('jquery')
var tmpl = require('./templates')
var api = require('./api')

var currentUser = {
  handle: '@bradwestfall',
  img: 'brad.png',
  id: 1
}

$(function() {

  var usersPromise = api.getUsers()

  usersPromise.then(api.processTweets);

  $('#main').on('click', 'textarea', function () {
    $(this).parent('.compose').addClass('expand');
  });

  $('#tweets').on('click', '.tweet', function () {
    $(this).parent('.thread').toggleClass('expand');
  });

  $('#main').on('submit', 'form.compose', function (event) {
    var message = $(this).find('textarea').val()
    var tweetId = $(this).parents('.thread').find('.tweet').attr('id')
    var $this = $(this)

    $(this).removeClass('expand');
    $(this).find('div').find('.count').text(140);
    $(this).find('textarea').val('');
    
    if ($(this).parents('header').length){
      $.post('http://localhost:3000/tweets', {
          userId: currentUser.id,
          message: message
      })

        .then(function (data) {
          data.img = currentUser.img,
          data.handle = currentUser.handle,
          $('#tweets').prepend(tmpl.renderThread(data))
        })

        .fail(function (xhr) {
          console.log(xhr.status);
        })
    } else {
      $.post('http://localhost:3000/replies', {
        userId: currentUser.id,
        tweetId: tweetId,
        message: message
      })
        .then(function (data) {
          data.img = currentUser.img
          data.handle = currentUser.handle
          data.id = null
          $this
            .parents('.replies')
            .append(tmpl.renderTweet(data))
        })
    }
    event.preventDefault()
  });

  $('#main').on('keyup', 'textarea', function () {
    var value = $(this).val().length;
    $(this).next('div').find('.count').text(140 - value);
  });
});