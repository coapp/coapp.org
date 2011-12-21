//-----------------------------------------------------------------------
// <copyright>
//     Copyright (c) 2010 Garrett Serack. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

var Speech = {
    IsSpeaking : false,
    Started : false,
    SVSFlagsAsync:1,
    SVSFPurgeBeforeSpeak:2,
    Voice : WScript.CreateObject("SAPI.SpVoice", "Speech_"),
    Speak : function(text) {
        text = FormatArguments(arguments);
        this.Voice.Speak( text , this.SVSFPurgeBeforeSpeak );
    },
    SpeakAsync : function(text) {
        text = FormatArguments(arguments);
        Speech.Started = false;
        this.Voice.Speak( text , this.SVSFlagsAsync );
        while( !Speech.Started ) WScript.Sleep(1);
    },
    Stop : function () {
        this.Voice.Speak("", this.SVSFPurgeBeforeSpeak);
    },
    _EndStream: function () {
        Speech.IsSpeaking = false;
    },
    _StartStream: function () {
        Speech.Started = Speech.IsSpeaking = true;
    },
    PlaySound: function(filename) {
        var stream = WScript.CreateObject("SAPI.SpFileStream");
        stream.Open(filename);
        this.Voice.SpeakStream(stream);
        stream.Close();
    }
    
};
Speech;