
var Handlebars = require('hbsfy/runtime');
var composeTmpl = require('../templates/compose.handlebars');
var tweetTmpl = require('../templates/tweet.handlebars');
var threadTmpl = require('../templates/thread.handlebars');


var renderCompose = function () {
  return composeTmpl() 
}

var renderTweet = function (values) {
  

  return tweetTmpl({
      id: values.id,
      img: values.img, 
      handle: values.handle,
      message: values.message
    })

};

var renderThread = function (values) {
  return threadTmpl({
    tweetAdd: renderTweet(values),
    compose: renderCompose()
  });
}

module.exports = {
  renderThread: renderThread,
  renderTweet: renderTweet,
  renderCompose: renderCompose
}