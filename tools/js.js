/// -----------------------------------------------------------------------
/// (c) 2009 Microsoft Corporation -- All rights reserved
/// This code is licensed under the MS-PL
/// http://www.opensource.org/licenses/ms-pl.html
/// Courtesy of the Open Source Techology Center: http://port25.technet.com
/// -----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright>
//     Copyright (c) 2010 Garrett Serack. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------


//-------------------------------------------------------------------------
// Scripting library

/* To include this library from any jscript script, you can use the 
following to search the PATH for the js.js script, and load it:

with( new ActiveXObject("Scripting.FileSystemObject")) 
    for (var each in paths = (".;js;scripts;"+WScript.scriptfullname.replace(/(.*\\)(.*)/g,"$1")+";"+new ActiveXObject("WScript.Shell").Environment("PROCESS")("PATH"))).split(";")) 
        if (FileExists(js = BuildPath(paths[each], "js.js"))) 
            { eval(OpenTextFile(js, 1, false).ReadAll()); break }

or, compressed down:

with(new ActiveXObject("Scripting.FileSystemObject"))for(var x in p=(".;js;scripts;"+WScript.scriptfullname.replace(/(.*\\)(.*)/g,"$1")+";"+new ActiveXObject("WScript.Shell").Environment("PROCESS")("PATH")).split(";"))if(FileExists(j=BuildPath(p[x],"js.js"))){eval(OpenTextFile(j).ReadAll());break}

or, you can use it from an .HTA with a <script> element.
*/

//------------------------------------------------------------------------
var $Globals=this;
var $LOGFILENAME = null;
var $ERRORLEVEL = 0;
var $LASTCMD = "";
var $StdOut= [];
var $StdOutString= "";
var $StdErr= [];
var $Children = [];
var WatchExpression = /error/i;
var FilterExpression = /XXXNOMATCH/i;

var KnownLibraries = {
    RestorePoints:0,
    Speech:0,
    JSON:0,
    MD5:0,
    VHD:0,
    CSharp:0
};

Function.prototype.Extend = function(fns){
    for(var each in fns) 
        this[each] = fns[each]; 
    return this;
}

function New( staticObject ) {
    return Function.prototype.Extend.call( {}, staticObject );
}

String.prototype.Format = function() {
    var args = (arguments.length == 1 && typeof (arguments[0]) == "object") ? arguments[0] : arguments;

    var result = this;
    var z;

    while( z = /\[FOR\:(.*?)\](.*)\[\/FOR\]/.exec(result) ) {
        var tmpString="";
        try {
            var collection = eval(z[1]);
            for(var iter=0;iter<collection.length;iter++)
                tmpString += z[2].replace(/\$iter/g, iter )+"\r\n";
        }
        catch(e) {}
        result = result.replace(z[0], tmpString );
    }

    while( z = /\[FOREACH\:(.*?)\](.*)\[\/FOREACH\]/.exec(result) ) {
        var tmpString="";
        try {
            var collection = eval(z[1]);
            for(var iter in collection)
                tmpString += z[2].replace(/\$iter/g, iter )+"\r\n";
        }
        catch(e) {}
        result = result.replace(z[0], tmpString );
    }
    
    while (z = /{(.*?)}/.exec(result)) { 
        try { result = result.replace(z[0], isNaN(z[1]) ? eval(z[1]) : (args[z[1]]||"??<" + z[1] + ">??" )); }
        catch (x) { result = result.replace(z[0], "??<" + z[1] + ">??"); }
    }
    return result.replace(/\?\?\</g, "{").replace(/\>\?\?/g, "}");
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/pad [rev. #1]
/// Returns the string with a substring padded on the left, right or both sides.
/// length: amount of characters that the string must have
/// substring: string that will be concatenated
/// type: specifies the side where the concatenation will happen, where: 0 = left, 1 = right and 2 = both sides
String.prototype.pad = function(l, s, t){
    return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
        + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
        + this + s.substr(0, l - t) : this;
};

String.prototype.Trim = function() {
    return (this || "").replace(/^\s+|\s+$/g, "");
}

function prefix( txt,  chr, sz ) {
    return  (""+txt).pad(sz,chr,0);
}

function IsNullOrEmpty(str) {
    return (str || "").length === 0;
}

function Set(array) {
    var result = {};
    for(each in array)
        result[each[array]] = each;
}

function $$(cmdline) {
    cmdline = FormatArguments(arguments);
    try 
    {
    Environment.Set();
    $StdOut = [];
    $StdErr = [];
    
    $LASTCMD = cmdline;
    Log(cmdline);
    
    var proc = $$.WSHShell.Exec(cmdline);
    
    $Children.push( { "process":proc, "cmdline":cmdline });
    
    while (proc.Status == 0 || !proc.StdOut.AtEndOfStream || !proc.StdErr.AtEndOfStream) {
    
        if (!proc.StdOut.AtEndOfStream) {
            x = proc.StdOut.ReadLine();
            $StdOut.push(x);
            if (WatchExpression.test(x) && !FilterExpression.test(x)) {
                Print(x);
            }
            Log(x);
        }
        else if (!proc.StdErr.AtEndOfStream) {
            x = proc.StdErr.ReadLine();
            $StdErr.push(x);
            if (WatchExpression.test(x) && !FilterExpression.test(x)) {
                Print(x);
            }  
                
        }
        $$.WScript.Sleep(10);
    }
    
    $ERRORLEVEL = proc.ExitCode;
    }
    catch(exc) {
        print ("Error Message: " + exc.message);
        print ("Error Code: " + (exc.number & 0xFFFF))
        print ("Error Name: " + exc.name);
    }
    return $StdOutString = $StdOut.join("\r\n");
}
// function $$.ExtendObject (obj, fns) {  for(var each in fns)  obj[each] = fns[each]; };

$$.Extend( {
    IsWSH : typeof(WScript) != 'undefined',
    IsHTA : ( typeof(location) == 'object' && /\.hta$/i.exec(""+location) ),
    WScript: typeof(WScript) == 'undefined' ? { echo:function(){} , Sleep:function(){} } :WScript,
    WSHShell : new ActiveXObject("WScript.Shell"),
    WinShell : new ActiveXObject("Shell.Application"),
    fso : new ActiveXObject("Scripting.FileSystemObject"),
    procEnvironment : new ActiveXObject("WScript.Shell").Environment("PROCESS"),
    logfile:null,
    folderStack:[],
    
    Run : function(){
        return $$(FormatArguments(arguments));
    },

    RunWithoutStreams : function(){
        $$.WSHShell.Run(FormatArguments(arguments),10,false);
    },
    
    RunWithoutStreamsAndWait : function(){
        $$.WSHShell.Run(FormatArguments(arguments),10,true);
    },

	cmd:function(){ 
		// Call in CMD sub-process ( Wrap in CMD /C ). No call to String.Format() because of recursion.
		return $$( FormatArguments( ( 'CMD /C "' + $A(arguments).shift() + '"' ) , arguments ) );
	},

    RunQuiet : function(){
        $Globals.FilterExpression = /.*/i;
        var result = $$(FormatArguments(arguments));
        $Globals.FilterExpression = /XXXNOMATCH/i;
        return result;
    },
    
    RunCaptured : function(cmdline) {
        cmdline = FormatArguments(arguments);
        
        try 
        {
            Environment.Set();
            $StdOut = [];
            $StdErr = [];
            $LASTCMD = cmdline;
            
            var proc = $$.WSHShell.Exec(cmdline);
            
            $Children.push( { "process":proc, "cmdline":cmdline }); 
            while (proc.Status == 0 || !proc.StdOut.AtEndOfStream || !proc.StdErr.AtEndOfStream) {
                if (!proc.StdOut.AtEndOfStream) 
                    $StdOut.push(proc.StdOut.ReadLine());
                else if (!proc.StdErr.AtEndOfStream)
                    $StdErr.push(proc.StdErr.ReadLine()); 
                $$.WScript.Sleep(10);
            }
            
            $ERRORLEVEL = proc.ExitCode;
        }
        catch(exc) {
            print ("Error Message: " + exc.message);
            print ("Error Code: " + (exc.number & 0xFFFF))
            print ("Error Name: " + exc.name);
        }
        return $StdOutString = $StdOut.join("\r\n");
    
    },
    
    RunAsync : function(cmdline) {
        cmdline = FormatArguments(arguments);

        Environment.Set();
        $LASTCMD = cmdline;
        Log(cmdline);
        var proc = $$.WSHShell.Exec(cmdline);
        $Children.push( { "process":proc, "cmdline":cmdline });
        return proc;
    },
    
    ExecCommandLine: function() {
        if( $$.IsWSH ) {
            with($$.WScript) {
                var cmdline = Collection.ToString(Arguments);
                if( IsNullOrEmpty(cmdline) )
                    return;
                if(cmdline.indexOf('$StdIn') >-1)
                    $StdIn=StdIn.ReadAll(); 
                if( folderExists(cmdline) || exists(cmdline))
                    return $$('explorer {0}',cmdline);
                cmdline = cmdline.replace(/`/g,'"');
                cmdline = cmdline.replace(/\\/g,'\\\\');
                for(var each in KnownLibraries )
                    if( cmdline.indexOf(each) > -1 ) { 
                        Use(each);
                    }
                echo(eval(cmdline));
            }
        }
    },
    GetSysNativeFolder : function() {
        if( folderExists("{$WINDIR}\\sysnative") )
            return "{$WINDIR}\\sysnative".Format();
        else 
            return "{$WINDIR}\\system32".Format();
    },
    Init : function() { 
        $$.Init = true;
        
        Environment.Load();
        // automatically execute the command line contents as jscript if 
        // this script is called by name, instead of being included.
        if( $$.IsWSH ) {
            $Globals.$ScriptName = $$.WScript.ScriptName;
            $Globals.$ScriptPath = WSH.scriptfullname.replace( /(.*\\)(.*)/g, "$1");
            $Globals.$ScriptFullPath = WSH.scriptfullname;
            
            $Globals.$Arguments = [];
            
            if( $$.IsWSH ) 
                with($$.WScript) 
                    $Globals.$Arguments = Collection.ToArray(Arguments);    
                    
            for(var i=0;i<$Globals.$Arguments.length;i++)
                $Globals["$"+(1+i)] = $Globals.$Arguments[i];
            $Globals.$0 = $Globals.$ScriptFullPath;
            if( $$.WScript.ScriptName == "js.js" ) {
                $$.ExecCommandLine();
            }
        }
        
        if( $$.IsHTA ) {
            print = Print = function(text) {
                text = FormatArguments(arguments);
                document.write(text);
                document.write("<br>");
            }
        }
        
        for(var each in $Globals) 
            if( typeof( $Globals[each] ) == 'object' && $Globals[each] != null )
                $$.InitObject($Globals[each],each)
    },
    
    InitObject : function(obj,name) {
        if( typeof( obj['Init'] ) == 'function' ) {
            obj.Init();
            obj.Init = function(){};
    }
        
        for(var each in obj) {
            if( each.charAt(0) == "_" )
                $Globals[name+each] = obj[each];
        }
        // obj.Init = null;
    }
    
});
//---------------------------
/* Sample usage of $Children 
for(var each in $Children) {
    Print( $Children[each].cmdline+"::"+$Children[each].process.Status );
} 
*/

//------------------------------------------------------------------------
// Functions

// FormatArguments must be passed either:
//     one argument: 
//          containing the arguments object from the caller
//          where the first argument of that should be the format string.
//          == or ==
//          just the format string.
//
//     two arguments:
//          the first argument is the format string
//          the second argument is the argument collection from the caller.
function FormatArguments(args, moreargs) {
    var result = "";

    if (arguments.length == 1) {
        if (typeof (args) == "object") {
            args = Array.prototype.slice.call(args);
            result = "" + (args.shift());

            if (args.length == 1 && arguments[0].length > 0)
                args = arguments[0];

            return result.Format(args);
        } else return ("" + args).Format();
    } else if (arguments.length == 2) {
        if (typeof (args) == "string" && typeof (moreargs) == "object") {
            result = args;
            args = Array.prototype.slice.call(moreargs);
            args.shift();

            return result.Format(args);
        }
    }
    Assert.Fail( "Invalid Argument passed to FormatArguments" ); 
}

var BinaryFile = {
    _streamTextToBinaryData: function(streamText) {
        var result = [];
        var tmp = '';
        var pos = 0;
        var len = streamText.length;
        var charCode;

        for (var i = 0; i < len; ++i) {
            if (pos++ == 1024) {
                result.push(tmp);
                tmp = "";
                pos = 0;
            }
            charCode = streamText.charCodeAt(i);
            tmp += String.fromCharCode(charCode < 128 ? charCode : BinaryFile.STBDMap[charCode]);
        }
        if (!IsNullOrEmpty(tmp))
            result.push(tmp);

        while ((len = result.length) > 1) {
            var tmpArr = [];
            for (var pos = 0; pos < len; pos += 2)
                tmpArr.push(pos + 1 == len ? result[pos] : '' + result[pos] + result[pos + 1]);
            result = tmpArr;
        }
        return result[0];
    },
    
    Write: function(filename,binaryData) {
        filename = FormatArguments(arguments);
        with (new ActiveXObject("ADODB.Stream")) { 
                type = 1; 
                open(); 
                Write(binaryData); 
                saveToFile(filename, 2); 
                close(); 
            }
    },

    WriteHexData: function(filename,hexData) {
        filename = FormatArguments(arguments);
        with (new ActiveXObject("Microsoft.XMLDOM").createElement("x")) {
            dataType = "bin.hex"; 
            text = hexData;
            BinaryFile.Write(filename, nodeTypedValue);
        }    
    },

    Read: function(filename,maxSize) {
        filename = FormatArguments(arguments);
        Assert.File(filename);
        maxSize = maxSize || -1;
        
        var binaryData;
        with (new ActiveXObject("ADODB.Stream")) {
            Type = 2;
            CharSet = 437;
            Open();
            LoadFromFile(filename);
            binaryData = maxSize > 0 ? BinaryFile._streamTextToBinaryData(ReadText(maxSize)) : BinaryFile._streamTextToBinaryData(ReadText());
            Close();
        }
        return binaryData;    
    },

    STBDMap:{   0xc7:0x80,  0xfc:0x81,  0xe9:0x82,  0xe2:0x83,  0xe4:0x84,  0xe0:0x85,  0xe5:0x86,  0xe7:0x87,
                0xea:0x88,  0xeb:0x89,  0xe8:0x8a,  0xef:0x8b,  0xee:0x8c,  0xec:0x8d,  0xc4:0x8e,  0xc5:0x8f,
                0xc9:0x90,  0xe6:0x91,  0xc6:0x92,  0xf4:0x93,  0xf6:0x94,  0xf2:0x95,  0xfb:0x96,  0xf9:0x97,
                0xff:0x98,  0xd6:0x99,  0xdc:0x9a,  0xa2:0x9b,  0xa3:0x9c,  0xa5:0x9d,0x20a7:0x9e, 0x192:0x9f,
                0xe1:0xa0,  0xed:0xa1,  0xf3:0xa2,  0xfa:0xa3,  0xf1:0xa4,  0xd1:0xa5,  0xaa:0xa6,  0xba:0xa7,
                0xbf:0xa8,0x2310:0xa9,  0xac:0xaa,  0xbd:0xab,  0xbc:0xac,  0xa1:0xad,  0xab:0xae,  0xbb:0xaf,
              0x2591:0xb0,0x2592:0xb1,0x2593:0xb2,0x2502:0xb3,0x2524:0xb4,0x2561:0xb5,0x2562:0xb6,0x2556:0xb7,
              0x2555:0xb8,0x2563:0xb9,0x2551:0xba,0x2557:0xbb,0x255d:0xbc,0x255c:0xbd,0x255b:0xbe,0x2510:0xbf,
              0x2514:0xc0,0x2534:0xc1,0x252c:0xc2,0x251c:0xc3,0x2500:0xc4,0x253c:0xc5,0x255e:0xc6,0x255f:0xc7,
              0x255a:0xc8,0x2554:0xc9,0x2569:0xca,0x2566:0xcb,0x2560:0xcc,0x2550:0xcd,0x256c:0xce,0x2567:0xcf,
              0x2568:0xd0,0x2564:0xd1,0x2565:0xd2,0x2559:0xd3,0x2558:0xd4,0x2552:0xd5,0x2553:0xd6,0x256b:0xd7,
              0x256a:0xd8,0x2518:0xd9,0x250c:0xda,0x2588:0xdb,0x2584:0xdc,0x258c:0xdd,0x2590:0xde,0x2580:0xdf,
               0x3b1:0xe0,  0xdf:0xe1, 0x393:0xe2, 0x3c0:0xe3, 0x3a3:0xe4, 0x3c3:0xe5,  0xb5:0xe6, 0x3c4:0xe7,
               0x3a6:0xe8, 0x398:0xe9, 0x3a9:0xea, 0x3b4:0xeb,0x221e:0xec, 0x3c6:0xed, 0x3b5:0xee,0x2229:0xef,
              0x2261:0xf0,  0xb1:0xf1,0x2265:0xf2,0x2264:0xf3,0x2320:0xf4,0x2321:0xf5,  0xf7:0xf6,0x2248:0xf7,
                0xb0:0xf8,0x2219:0xf9,  0xb7:0xfa,0x221a:0xfb,0x207f:0xfc,  0xb2:0xfd,0x25a0:0xfe,  0xa0:0xff}
};

var Environment = {
    Load : function() {
        var env = Collection.ToStringArray($$.procEnvironment);
        var p;
        for (var each in env) {
            var v = env[each];
            if (typeof (v) == 'string')
                if ((p = v.indexOf('=')) == 0)
                continue;
            else
                $Globals['$' + v.substring(0, p).toUpperCase()] = v.substring(p + 1);
        }
    },
    Set : function() {
        for (var each in $Globals) {
            var t = typeof ($Globals[each]);
            if (t == 'string' || t == 'number') {
                if (each.indexOf("$") == 0) {
                    if (IsNullOrEmpty($Globals[each])) try {
                        $$.procEnvironment.Remove(each.substring(1));
                        } catch( exc ) {} 
                    else
                        $$.procEnvironment(each.substring(1)) = $Globals[each];
                }
            }
        }
    
    }
};

var Collection =  {
    ToArray : function (collection) {
        var result = [];
        for (var e = new Enumerator(collection); !e.atEnd(); e.moveNext())
            result.push(e.item());
        return result;
    },
    ToStringArray : function (collection) {
        var result = [];
        for (var e = new Enumerator(collection); !e.atEnd(); e.moveNext())
            result.push("" + e.item());
        return result;
    },
    ToString : function( collection ) {
        with([]){
            for (var e = new Enumerator(collection); !e.atEnd(); e.moveNext())
                push(e.item());
            return join(' ');
        }    
    },
    
    ToQuotedString : function( collection ) {
    with([]){
        for (var e = new Enumerator(collection); !e.atEnd(); e.moveNext()) {
            var eitem=e.item();
            push(eitem.indexOf(' ') > -1 ? '"'+eitem+'"': eitem);
        }
        return join(' ');
        }
    }
};

var Assert = {
    Folder: function(folder) {
        folder = $$.fso.GetAbsolutePathName(FormatArguments(arguments));
        if (folderExists(folder))
            return folder;

        return Assert.Fail("Folder [{0}] does not exist", folder);
    },
    File: function(file) {
        file = $$.fso.GetAbsolutePathName(FormatArguments(arguments));
        if (exists(file))
            return file;

        return Assert.Fail("File [{0}] does not exist", file);
    },
    Executable: function(exe) {
        findExe = which(FormatArguments(arguments));
        if (IsNullOrEmpty(findExe))
            return Assert.Fail("Unable to find executable [{0}]", arguments[0])
        return findExe;
    },
    ExecutableEx: function(arrayofpaths, exe) {
        /// <summary> This searches the $PATH and the array of paths to find the executable.
        /// if the app is in one the given paths, it adds that to the $PATH</summary> 
        exe= FormatArguments( exe, arguments);
        try{
            return Assert.Executable(exe);
        }
        catch(e1) {
        }
        var orig_path = $PATH; 
        for(var i=0;i<arrayofpaths.length;i++) {
            try {
                $PATH = orig_path+";"+FormatArguments( arrayofpaths[i], arguments);
                var result = Assert.Executable(exe)
                return result;
            } catch(e2) {
            }
        }
        $PATH = orig_path;
        return Assert.Fail("Unable to find executable [{0}]", exe)
    },
    Value: function(val, message) {
        if(!val) 
            return Assert.Fail(message)
            
        return;
    },
    IsConsole: function() {
        if( !/CScript/i.exec(WScript.FullName) ) {
            WScript.echo("This script must be run from the console script processor\r\n\r\nYou can either type\r\n\r\n   cscript "+WScript.ScriptName+" \r\n\r\nat the command line, or type \r\n\r\n   cscript /H:CScript \r\n\r\nto set the default to the console script processor (recommended)")
            WScript.Quit();
        }
    },
    Fail: function() {
        var text = FormatArguments(arguments);
        var fn = arguments.callee;
        
        
        while( fn ) {
            var found = false;
            for(var each in Assert) {
                if( fn == Assert[each] ) {
                    fn = fn.caller;
                    found = true;
                    break;
                }
            }
            if( !found )
                break;
        }
        
        while( fn ) {
            var s= "[";
            for (var i = 0; i < fn.arguments.length ; i++)  {
                var arg = fn.arguments[i];
                var type = typeof(arg);
                if( i !== 0 )
                    s+=',';
                    
                switch( type ) {
                    case "object":
                        if( arg == null )
                            s+= "<object:null>"; 
                        else {
                            
                            if( typeof(arg.length)  === 'number'  )
                                s+="<array:{0} elements>".Format(""+(0+arg.length));
                            else
                                s+= "<object>";
                        }
                        break;
                    case "string": s += "string:'{0}'".Format(arg); break;
                    default: 
                        s += "{0}:{1}".Format(type,""+arg);
                }
                
            }
            
            var stackTrace = (fn+"").match( /function.*/ ) + "";
            stackTrace = stackTrace.replace(/\{.*/,"").replace(/^\s+|\s+$/g, "").replace("function(","function <anonymous>(") + s + "]";
            text += "\r\n\t"+stackTrace;
            fn = fn.caller;
        }
        throw new Error(-1, text);;
    }
}

var Http = {
    DownloadURL : function ( url, destinationFilename ) {
        url = FormatArguments(url, arguments);
        destinationFilename = FormatArguments(destinationFilename , arguments);
        
        var obj = new ActiveXObject("MSXML2.XMLHTTP");
        
        obj.open("GET", url, false);
        obj.send();
        
        if(obj.Status == 200){
            var stream = new ActiveXObject("ADODB.Stream");
            stream.Open();
            stream.Type = 1 //adTypeBinary
            stream.Write(obj.ResponseBody);
            stream.Position = 0;
     
            stream.SaveToFile(destinationFilename);
            stream.Close();
            
        }
        return obj.Status;
    }
}

function Log(text) {
    text = FormatArguments(arguments);

    if ($$.logfile == null) {
        if (IsNullOrEmpty($LOGFILENAME))
            return;
        $$.logfile = $$.fso.OpenTextFile($LOGFILENAME.Format(), 8, true);
    }

    $$.logfile.WriteLine(text);
}

Log.Extend( {
    Print : function(text) {
        text = FormatArguments(arguments);
        Print(text);
        Log(text);
    },

    Close: function() {
        if ($$.logfile != null) {
            $$.logfile.Close();
            $$.logfile = null;
        }    
    },

    Copy : function(filename) {
        filename = FormatArguments(filename);
        Log.Close();

        if (filename != "")
            $$.fso.CopyFile($LOGFILENAME.Format(), filename);
    },
    
    Clear: function() {
        try {
        Log.Close();
        $$.fso.DeleteFile($LOGFILENAME.Format());
    }
        catch(e) {}
    }
});


function ExecutablePlatformType(filename) {
    filename = FormatArguments(arguments);
    Assert.File(filename);

    var binaryData = BinaryFile.Read(filename, 1024);
    var PE_Signature = [0x50, 0x45, 0x00, 0x00];
    var n = 0;
    for (var x = 0; x < 1024; x++) {
        if (binaryData.charCodeAt(x) == PE_Signature[n]) {
            n++;
            if (n == PE_Signature.length) {
                if (binaryData.charCodeAt(x + 1) == 0x4c && binaryData.charCodeAt(x + 2) == 0x01)
                    return ("x86");
                if (binaryData.charCodeAt(x + 1) == 0x64 && binaryData.charCodeAt(x + 2) == 0x86)
                    return ("x64");
                // could check for others, but who needs to?
                break;
            }
        }
    }
    return "unknown";
}

function Print() {
    $$.WScript.echo(FormatArguments(arguments));
} var print=Print;


function GetTimeStamp(filename) {
    return "" + ($$.fso.GetFile(FormatArguments(arguments)).DateLastModified);
}

var Tasks = {
    List : function (rxFilter) {
        rxFilter = rxFilter || /.*/i
        var result = [];

        for (var e = new Enumerator(GetObject("winmgmts:").InstancesOf("Win32_process")); !e.atEnd(); e.moveNext()) {
            var process = e.item();
            var txt = process.name;
            if (rxFilter.exec(txt))
                result[txt] = process; // index is process name.
        }
        return result;
    },
    
    Terminate : function (rxFilter) {
        rxFilter = rxFilter || /NOTHING/i
        if (typeof (rxFilter) == "string")
            rxFilter = new RegExp(rxFilter);
    
        for (var each in tasks = Tasks.List(rxFilter))
            tasks[each].Terminate();
    }
};



function cd(folder) {
    folder = FormatArguments(arguments)
    Assert.Folder( folder );
    $$.WSHShell.CurrentDirectory = folder;
    return folder;
}

function pushd(folder) {
    $$.folderStack.push(pwd());
    cd(folder);
}

function popd() {
    cd( $$.folderStack.pop() );
}

function pwd() {
    return $$.WSHShell.CurrentDirectory;
}

function include(filename) {
    filename = FormatArguments(arguments);
    filename = Assert.Executable(filename);
    
    return $$.fso.OpenTextFile(filename, 1, false).ReadAll();
}

function tryInclude(filename) {
    filename = FormatArguments(arguments);
    try { 
        Assert.Executable(filename); 
        return OpenTextFile(filename, 1, false).ReadAll();
    } catch(ignore) {
    }
    return "";
}

function Use(objNames) {
    for(var i=0;i<arguments.length;i++) {
        var objName = arguments[i];
        $Globals[objName] = {};
        $Globals[objName] = eval(include(objName));
        $$.InitObject($Globals[objName],objName);
    }
}

function erase(file) {
    file = FormatArguments(arguments);
    if (exists(file))
        $$.fso.DeleteFile(file);
}

function rmdir(folder) {
    folder = FormatArguments(arguments);
    if (folderExists(folder)) 
        try {
            $$.fso.DeleteFolder(folder, true);
        }
        catch(e) {
        Assert.Fail("Unable to delete folder {0}",folder);
        }
}

function exists(file) {
    return $$.fso.FileExists(FormatArguments(arguments));
}

function folderExists(folder) {
    return $$.fso.FolderExists(FormatArguments(arguments));
}

function folderIsEmpty(folder) {
	var fol = $$.fso.GetFolder(FormatArguments(arguments))
	,	contents = 0
	;
	for( var fc = new Enumerator(fol.Files); !fc.atEnd(); fc.moveNext() ) contents++;
	for( var fc = new Enumerator(fol.SubFolders); !fc.atEnd(); fc.moveNext() ) contents++;
	
	return (!contents);
}

function RenameFolder( srcFolderName, destFolderName ) {
    return $$.fso.MoveFolder(FormatArguments(arguments), FormatArguments(destFolderName, arguments));
}

function mkdir(folder) {
    folder = FormatArguments(arguments);
    if (!folderExists(folder))
        $$.fso.CreateFolder(folder);
    return folder;
}

mkdir.Extend({
	recursive: function mkdir_recursive(folder){
		folder = $$.fso.GetAbsolutePathName( FormatArguments( arguments ) );
		if(!folderExists( parentFolder = $$.fso.GetParentFolderName( folder ) ) )
			mkdir_recursive( parentFolder );
		mkdir( folder );
	}
});

function rename(srcfile, destfile) {
    srcfile = FormatArguments(srcfile, arguments);
    Assert.File(srcfile);
    
    destfile = FormatArguments(destfile, arguments);

    $$.fso.MoveFile(srcfile, destfile);
}

function copy(srcfile, destfile) {
    srcfile = FormatArguments(srcfile, arguments);
    Assert.File(srcfile);
    
    destfile = FormatArguments(destfile, arguments);

    if (folderExists(destfile))
        destfile += "\\";

    Log("Copying from {0}  to {1} ", srcfile, destfile);
    $$.fso.CopyFile(srcfile, destfile, true);
}

function xcopy(srcDir, destDir) {
    srcDir = Assert.Folder( FormatArguments(srcDir, arguments) );
    destDir = FormatArguments(destDir, arguments);
    if( exists( destDir ) ) // should not be file.. only dir or nothing.
        Fail("File {0} is in the way of an xcopy", destDir);
    mkdir( destDir );
    $$('xcopy /s /e /Y "{0}" "{1}"' , srcDir, destDir );
}

function fullpath(path){
    return  $$.fso.GetAbsolutePathName(FormatArguments(arguments));
}

// sample usage
// for(var each in set = dir( 'PGO\\test\\scripts', /php$/ ) )
//  Print(set[each].Size);
function dir(path, rxFilter) {
    path = path || ".";
    if( path.constructor == RegExp )  {
        rxFilter = path;
        path = ".";
    }
    rxFilter = rxFilter || /.*/i
    if (typeof (rxFilter) == "string")
        rxFilter = new RegExp(rxFilter);

    var f = $$.fso.GetFolder(FormatArguments(path, arguments));
    if (f) {
        var result = [];
        for (var e = new Enumerator(f.Files); !e.atEnd(); e.moveNext()) {
            var txt = "" + e.item();
            if (rxFilter.exec(txt))
                result[txt] = $$.fso.GetFile(txt); // index is filename, 
        }
        
        for( var e = new Enumerator(f.SubFolders); !e.atEnd(); e.moveNext()) {
            for(var each in set = dir( ""+e.item(), rxFilter ) )
                result[each] = set[each];
        }
        return result;
    }
    return null;
}

function files(path, rxFilter) {
    path = path || ".";
    if( path.constructor == RegExp )  {
        rxFilter = path;
        path = ".";
    }
    rxFilter = rxFilter || /.*/i
    if (typeof (rxFilter) == "string")
        rxFilter = new RegExp(rxFilter);

    var f = $$.fso.GetFolder(FormatArguments(path, arguments));
    if (f) {
        var result = [];
        for (var e = new Enumerator(f.Files); !e.atEnd(); e.moveNext()) {
            var txt = "" + e.item();
            if (rxFilter.exec(txt))
                result[txt] = $$.fso.GetFile(txt); // index is filename, 
        }
        return result;
    }
    return null;
}

function tree(path, rxFilter) {
    path = path || ".";
    if( path.constructor == RegExp )  {
        rxFilter = path;
        path = ".";
    }
    rxFilter = rxFilter || /.*/i
    if (typeof (rxFilter) == "string")
        rxFilter = new RegExp(rxFilter);

    var f = $$.fso.GetFolder(FormatArguments(path, arguments));
    
    if (f) {
        var result = [];
        
        for( var e = new Enumerator(f.SubFolders); !e.atEnd(); e.moveNext()) {
            var txt = "" + e.item();
            if (rxFilter.exec(txt))
                result[txt] = $$.fso.GetFolder(txt);
                    
            for(var each in set = tree( txt, rxFilter ) )
                result[each] = set[each];
        }
        return result;
    }
    return null;
}

function directories(path, rxFilter) {
    path = path || ".";
    if( path.constructor == RegExp )  {
        rxFilter = path;
        path = ".";
    }
    rxFilter = rxFilter || /.*/i
    if (typeof (rxFilter) == "string")
        rxFilter = new RegExp(rxFilter);

    var f = $$.fso.GetFolder(FormatArguments(path, arguments));
    
    if (f) {
        var result = [];
        
        for( var e = new Enumerator(f.SubFolders); !e.atEnd(); e.moveNext()) {
            var txt = "" + e.item();
            if (rxFilter.exec(txt))
                result[txt] = $$.fso.GetFolder(txt);
        }
        return result;
    }
    return null;
}


function which(filenameToFind) {
    filenameToFind = FormatArguments(arguments);
    if( exists(filenameToFind) )
        return filenameToFind;
        
    if (!/\.\s*/.exec(filenameToFind)) {
        for (var e in exts = (".js;"+$PATHEXT).split(";")) {
            result = which(filenameToFind + exts[e]);
            if (!IsNullOrEmpty(result))
                return result;
        }
    }

    for (var each in paths = (".;"+ WScript.scriptfullname.replace( /(.*\\)(.*)/g, "$1")+";" + $PATH).split(";")) {
        var testPath = $$.fso.BuildPath(paths[each], filenameToFind);
        if (exists(testPath)) {
            return $$.fso.GetAbsolutePathName(testPath);
        }
    }

    return "";
}

function unzip(zipFile, targetFolder) {
    zipFile = Assert.File(FormatArguments(zipFile, arguments));
    targetFolder = fullpath(FormatArguments(targetFolder, arguments));
    var exe = Assert.Executable("unzip.exe");
    $$('unzip -o "{0}" -d "{1}"', zipFile, targetFolder );
}

function zip(zipFile, sourceFolder, excludeFiles ) {
    zipFile = fullpath(FormatArguments(zipFile, arguments));
    sourceFolder = Assert.Folder( FormatArguments(sourceFolder, arguments) );
    excludeFiles = FormatArguments(excludeFiles || "", arguments);
    if( !IsNullOrEmpty(excludeFiles) ) {
        excludeFiles = "-x "+excludeFiles;
    }
    var exe = Assert.Executable("zip.exe");
    pushd(sourceFolder);
    $$('zip -r "{0}" "*" {1} ', zipFile, excludeFiles);
    popd();
}

function addFileToZip(zipFile, fileToAdd ) {
    zipFile = fullpath(FormatArguments(zipFile, arguments));
    fileToAdd = FormatArguments(fileToAdd, arguments) 
    Assert.File( fileToAdd );
    
    var exe = Assert.Executable("zip.exe");
    
    $$('zip "{0}" "{1}"', zipFile, fileToAdd);
}

function ReadAll(filename) {
    filename = Assert.File(FormatArguments(arguments));
    return $$.fso.OpenTextFile(filename, 1, false).ReadAll();
}

function ReadThisFile() {
    var txt = ReadAll($ScriptFullPath);
    txt = txt.substring(txt.indexOf('//@cc_on//@if(!@_jscript)')+25);
    txt = txt.substring(0,txt.indexOf('//@end'));
    return txt.Trim();
}

function FormatFile(filename) {
    filename = Assert.File(FormatArguments(arguments));
    return ReadAll(filename).Format();
}

function FormatThisFile() {
    return ReadThisFile().Format();
}

function WriteAll(filename, text) {
    filename = FormatArguments(arguments);
    text = FormatArguments(text, arguments);
    var f = $$.fso.OpenTextFile(filename, 2, true);
    f.WriteLine(text);
    f.Close();
}
 
function copyAsSymlink(src, dest) {
    src = FormatArguments(src, arguments);
    dest = FormatArguments(dest, arguments);
    if( exists(dest) || folderExists(dest) ) 
        Assert.Fail("Target {0} exists", dest );
        
    if( folderExists(src) ) {
        $$('cmd /c mklink /d "{0}" "{1}" ', dest, src );
        return;
    }
        
    if( exists(src) )  {
        $$('cmd /c mklink "{0}" "{1}" ', dest, src );
        return;
    }
    
    Assert.Fail("Cannot find source [{0}]" , src );
}

function copyAsHardlink(src, dest) {
    src = FormatArguments(src, arguments);
    dest = FormatArguments(dest, arguments);
    if( exists(dest) || folderExists(dest) ) 
        Assert.Fail("Target {0} exists", dest );
        
    if( exists(src) ) {
        $$('cmd /c mklink /H "{0}" "{1}" ', dest, src );
        return;
    }
    
    Assert.Fail("Cannot find source file [{0}]" , src );
}

function getRelativePath( fromDir, toFileOrDir ) {
	var fromDir = ( $$.fso.GetAbsolutePathName( fromDir ) ).split( '\\' );
	var toFileOrDir = ( $$.fso.GetAbsolutePathName( toFileOrDir ) ).split( '\\' );
	
	// find out how much they have in common
	var commonDepth = 0;
	for( var depth in fromDir ) {
		if( fromDir[depth] == toFileOrDir[depth] ) commonDepth++;
		else break;
	}
	
	return ( new Array( fromDir.length - commonDepth + 1 ) ).join( '..\\' ) + toFileOrDir.slice( commonDepth ).join( '\\' );
}

function md5(filename) {
    filename = FormatArguments(arguments);
    Assert.File(filename);
    Assert.Executable("md5");
    /(.*) (.*)/ig.exec($$('md5 "{0}" ', filename ));
    return RegExp.$1.Trim();
}

function ReplaceInFile( filename , searchForRx , replaceWith ) {
    filename = FormatArguments(filename , arguments);
    if (typeof (searchForRx) == "string")
        searchForRx = FormatArguments(searchForRx , arguments);
    replaceWith = FormatArguments( replaceWith , arguments );
    
    var text = ReadAll(filename);
        text = text.replace(searchForRx,replaceWith);
    WriteAll(filename, text);  
}

function ProcessCommandLineArguments() {
    
    while( $Arguments.length > 0 && $Arguments[0].indexOf("--") == 0 ) {
        var arg = $Arguments.shift().substring(2).split("=");
        $Globals["$"+arg[0]] = arg.length > 1 ? arg[1] : true;
    }
    
}

function GUID(seed) {
    return MD5(FormatArguments(arguments)).replace( /(........)(....)(....)(....)(............)/,"$1-$2-$3-$4-$5");
}

function SetClipboard(text) {
    with (new ActiveXObject("Word.Application")) {
        Visible = false;
        Documents.Add();
        Selection.TypeText(text);
        Selection.WholeStory();
        Selection.Copy();
        Quit(false);            
    }
}

$$.Init();

/* Some command line hints:
Doskey this:
    .=js $* 

That lets you do this at the command line:

    . 10+10 
    20
    
*/
