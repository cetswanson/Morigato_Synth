if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('frequency', 0);

  Template.getFrequency.helpers({
    frequency: function () {
      return Session.get('frequency');
    }
  });

  Template.setFrequency.events({
    'keyup': function() {
      console.log($('input')[0].value);
      Session.set('frequency', $('input')[0].value);
    }
  })

  setTimeout(function() {
    var synth = T("SynthDef").play();

    synth.def = function(opts) {
      var VCO = T("saw", {freq:opts.freq});

      var cutoff = T("env", {table:[8000, [opts.freq, 500]]}).bang();
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
  }, 500);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
