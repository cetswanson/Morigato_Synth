if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('frequency', 100);
  Session.setDefault('table', 8000);
  Session.setDefault('attack', 150);
  Session.setDefault('delay', 500);
  Session.setDefault('sustain', 0.45);
  Session.setDefault('release', 1500);

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

  Template.setAttack.events({
    'keyup': function() {
      Session.set('attack', $('.attack')[0].value);
    }
  })

  Template.setDelay.events({
    'keyup': function() {
      Session.set('delay', $('.delay')[0].value);
    }
  })

  Template.setSustain.events({
    'keyup': function() {
      Session.set('sustain', $('.sustain')[0].value);
    }
  })

  Template.setRelease.events({
    'keyup': function() {
      Session.set('release', $('.release')[0].value);
    }
  })

  setTimeout(function() {
    var synth = T("SynthDef").play();

    synth.def = function(opts) {

      var VCO = T("saw", {freq: parseInt(Session.get('frequency'))});

      var cutoff = T("env", {table:[parseInt(Session.get('table')), [parseInt(Session.get('frequency')), 500]]}).bang();
      var VCF    = T("lpf", {cutoff:cutoff, Q:5}, VCO);

      var EG  = T("adsr", {a:parseInt(Session.get('attack')), d:parseInt(Session.get('delay')), s:parseFloat(Session.get('sustain')), r:parseInt(Session.get('release')), lv:0.6});
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

  // setTimeout(function() {
  //   var synth = T("SynthDef").play();

  //   synth.def = function(opts) {
  //     var VCO = T("saw", {freq: Session.get('frequency')});

  //     var cutoff = T("env", {table:[8000, [Session.get('frequency'), 500]]}).bang();
  //     var VCF    = T("lpf", {cutoff:cutoff, Q:5}, VCO);

  //     var EG  = T("adsr", {a:150, d:500, s:0.45, r:1500, lv:0.6});
  //     var VCA = EG.append(VCF).bang();

  //     return VCA;
  //   };

  //   var keydict = T("ndict.key");
  //   var midicps = T("midicps");
  //   T("keyboard").on("keydown", function(e) {
  //     var midi = keydict.at(e.keyCode);
  //     if (midi) {
  //       var freq = midicps.at(midi);
  //       synth.noteOnWithFreq(freq, 100);
  //     }
  //   }).on("keyup", function(e) {
  //     var midi = keydict.at(e.keyCode);
  //     if (midi) {
  //       synth.noteOff(midi, 100);
  //     }
  //   }).start();
  // }, 500);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
