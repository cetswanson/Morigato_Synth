
stream = new Meteor.Stream('c2c');
var RADIX = 10;

function playSound(keyCode) {
  var synth = T("OscGen", {wave:"saw", mul:0.25}).play();
  var keydict = T("ndict.key");
  var midicps = T("midicps");
  var midi = keydict.at(keyCode);
  if (midi) {
    var freq = midicps.at(midi);
    synth.noteOnWithFreq(freq, 100);
  }
}

if (Meteor.isClient) {
  sendNote = function(message) {
    stream.emit('message', message);
    $('#message-board').prepend('<li>me: ' + message + '</li>');
  };

  stream.on('message', function(message) {
    $('#message-board').prepend('<li>user: ' + message + '</li>');
    playSound(parseInt(message, RADIX));
  });

  $(document).on('keydown', function (e) {
    sendNote(e.keyCode);
    playSound(e.keyCode);
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
