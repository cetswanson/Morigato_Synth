if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.play_button.events({
    'click button': function() {
      var synth = T("OscGen", {wave:"saw", mul:0.25}).play();

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
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
