
stream = new Meteor.Stream('c2c');
var RADIX = 10;

if (Meteor.isClient) {

  sendChat = function(message) {
    stream.emit('message', message);
    $('#message-board').prepend('<li>me: ' + message + '</li>');
  };

  stream.on('message', function(message) {
    $('#message-board').prepend('<li>user: ' + message + '</li>');
    var synth = T("OscGen", {wave:"saw", mul:0.25}).play();

    var keydict = T("ndict.key");
    var midicps = T("midicps");
    var midi = keydict.at(parseInt(message, RADIX));
    if (midi) {
      var freq = midicps.at(midi);
      synth.noteOnWithFreq(freq, 100);
    }
  });

  $(document).on('keydown', function (e) {
    sendChat(e.keyCode);
  });
}

if (Meteor.isServer) {

  stream.permissions.write(function(eventName) {
    return true;
  });

  stream.permissions.read(function(eventName) {
    return true;
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
