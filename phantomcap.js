var system = require('system');
var page = require('webpage').create();

// screen capture is written to this file
var OUTFILE = "capture.png";

// set phantomjs viewport size
page.viewportSize = {
  width: 1920,
  height: 1024
}

page.onLoadFinished = function(status){
  if (status !== 'success') {
    console.err('Failed to load the url. ('+status+')');
    phantom.exit();
  } else {
  
    console.log('Page loaded, waiting '+WAIT+'ms before screen capture');
    window.setTimeout(function(){
      var width = page.viewportSize.width;
      
      // retrieve real page height in order to crop result image. Has to be done inside page.evaluate to get real values.
      var realHeight = page.evaluate(function(){
        var body = document.body,
        html = document.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight );
        return height;
      });
  
      //page.clipRect = {top: 0, left: 0, width: width, heigth: realHeight};
      //console.log('Cropping to: '+width+'x'+realHeight);
      
      page.render('capture.png');
      console.log('Wrote captured image to '+OUTFILE);
      return phantom.exit();
    }, WAIT);
  }
};

if (system.args.length !== 3){
  system.stderr.write('Usage: phantomjs '+system.args[0] + ' <url> <wait_ms_before_capture>\n');
  phantom.exit();
}

var URL = system.args[1];
var WAIT = system.args[2];

console.log('Loading page ...');
page.open(URL);
