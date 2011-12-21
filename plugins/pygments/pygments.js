var querystring = require("querystring");
var markdown = require('github-flavored-markdown')
var md5 = require('MD5');
var http = require('http');
var util= require('util');
var enumerabl=require("enumerable"); 
var spawn = require('child_process').spawn;
var cms = require("coappcms"); 

// Since I can't write in coffee-script, I created this in javascript, and 
// just pass the work along to it.

var Pygments= {};
    
var options = {
  host: "pygments.appspot.com",
  port: 80,
  path: '',
  method: 'POST'
};
    
//
// Export the Pygments object
//
if (typeof exports === "object") {
    Pygments = exports;
    
    Pygments.render = function (inExtension,outExtension,templateData,file, next) {
        if( inExtension != 'md' && inExtension != 'markdown' )  {
          return next();
        }
        
        var piggybacks = {};
        
        var match = null;
        
        
        if( (match = /^```\s*(.*)\s*$([\s|\S]*?)^```$/img.exec(file.content)) != null ) { 
            do {
                var lang = RegExp.$1;
                var src = RegExp.$2;
                var key = "«--CODE:"+md5(src)+"--»";
                
                file.content = file.content.replace( match[0], key );
            
                var pb_match = null;
                while((pb_match = /«(.*?)«(.*?)»/ig.exec(src)) != null)  {
                    var a_code = RegExp.$1;
                    var a_href = RegExp.$2;
                    var hash = md5(a_href);
                    src = src.replace(pb_match[0] , "«"+a_code+"»"+hash+"»" );
                    piggybacks[hash] = a_href;
                }
                
                // piggyback ««» handling into the source
                // «--nologo                    don't display the logo«#nologo»
                // «--nologo                    don't display the logo«md5»
                // <a href="$2">$1</a>
                
                
                completeHighlight( file,key, lang, src, next, piggybacks);
            } while( (match = /^```\s*(.*)\s*$([\s|\S]*?)^```$/img.exec(file.content)) != null )
        } else { 
            // console.log(file.content);
            file.content = cms.markdown(file.content);
            next();
        }
    };
  
    function completeHighlight(file, key, language, src, next, piggybacks) {
        var text = '';

        var req = http.request(options, function(response) {
            response.setEncoding('utf8');
            
            response.on('data', function (chunk) {
                text += chunk;
            });
            
            response.on('end', function() {
                // find our piggybacks in text and restore them as links
                for(ndx in piggybacks) { 
                    text = text.replace( new RegExp("«([\\s|\\S]*?)»"+ndx+"»", "ig" ), '<a class="lnk" href="'+piggybacks[ndx]+'">$1</a>' );
                }
                
                file.content = file.content.replace(key , text );
                if( /«--CODE:.{32}--»/.exec(file.content) == null) {
                    file.content = cms.markdown(file.content);
                    next();
                }
            });
        });
    req.write(querystring.stringify({lang:language, code:src}));
    req.end();
}
    
    Pygments.renderBefore = function(templateData, next) {
        var docs = enumerabl.create( templateData.documents );
        docs.each( function(e) { 
            var d =/^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(e.filename);
            if( d ) {
                e.date = new Date( RegExp.$1, --(RegExp.$2), RegExp.$3);
            }   
            e.order = e.order || 0;
        });
        next();
    };
  
    Pygments.generateBefore = function(next) {
      // console.log("generateBefore");
      next();
    };
    Pygments.generateAfter = function(next) {
      // console.log("generateAfter");
      next();
    };
    Pygments.cleanBefore = function(next) {
      // console.log("cleanBefore");
      next();
    };
    Pygments.cleanAfter = function(next) {
      // console.log("cleanAfter");
      next();
    };
    Pygments.parseBefore = function(next) {
      // console.log("parseBefore");
      next();
    };
    Pygments.generateBefore = function(next) {
      // console.log("generateBefore");
      next();
    };
    Pygments.parseAfter = function(next) {
      // console.log("parseAfter");
      next();
    };
    Pygments.renderAfter = function(next) {
    //  console.log("renderAfter");
      next();
    };
    Pygments.writeBefore = function(next) {
    //console.log("writeBefore");
      next();
    };
    Pygments.writeAfter = function(config, next) {
    //  console.log("writeAfter");
        //console.log(util.inspect(config) );
        if( config.docpad.config.sound == 'true' ) {
            grep  = spawn('cscript', ["//e:jscript","tools\\js.js","Speech.PlaySound('"+config.docpad.config.rootPath+"\\tools\\sound2.wav');"]);
        }
      next();
    };
    Pygments.serverBefore = function(next) {
    //  console.log("serverBefore");
      next();
    };
    Pygments.serverAfter = function(next) {
    //  console.log("serverAfter");
      next();
    };
}




