
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

  Session.setDefault('frequency', 100);
  Session.setDefault('table', 8000);

  Template.setFrequency.events({
    'keyup': function() {
      Session.set('frequency', $('.frequency')[0].value);
    }
  })

  Template.setTable.events({
    'keyup': function() {
      Session.set('table', $('.table-frequency')[0].value);
    }
  })

  setTimeout(function() {
    var synth = T("SynthDef").play();

    synth.def = function(opts) {

      var VCO = T("saw", {freq: parseInt(Session.get('frequency'))});

      var cutoff = T("env", {table:[parseInt(Session.get('table')), [parseInt(Session.get('frequency')), 500]]}).bang();
      var VCF    = T("lpf", {cutoff:cutoff, Q:5}, VCO);

      var EG  = T("adsr", {a:150, d:500, s:0.45, r:1500, lv:0.6});
      var VCA = EG.append(VCF).bang();

      return VCA;
    };

    var keydict = T("ndict.key");
    var midicps = T("midicps");
    T("keyboard").on("keydown", function(e) {
      var midi = keydict.at(e.keyCode);
      if (midi) {
        var freq = midicps.at(midi);
        synth.noteOnWithFreq(freq, 100);
      }
    }).on("keyup", function(e) {
      var midi = keydict.at(e.keyCode);
      if (midi) {
        synth.noteOff(midi, 100);
      }
    }).start();
  }, 500)

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
