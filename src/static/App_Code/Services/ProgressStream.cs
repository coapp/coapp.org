//-----------------------------------------------------------------------
// <copyright company="CoApp Project">
//     Copyright (c) 2010-2012 Garrett Serack and CoApp Contributors. 
//     Contributors can be discovered using the 'git log' command.
//     All rights reserved.
// </copyright>
// <license>
//     The software is licensed under the Apache 2.0 License (the "License")
//     You may not use the software except in compliance with the License. 
// </license>
//-----------------------------------------------------------------------

namespace Services {
#if unused
    using System;
    using System.IO;

    internal class ProgressStream : Stream {
        private readonly Stream _innerStream;
        private long _bytesProcessed;
        private readonly Action<long> _progressCallback;
        private readonly long _length;

        public ProgressStream(Stream inner, Action<long> callback) {
            _innerStream = inner;
            _length = inner.Length;
            _progressCallback = callback;
        }

        public ProgressStream(Stream inner, long length, Action<long> callback) {
            _innerStream = inner;
            _length = length;
            _progressCallback = callback;
        }

        protected override void Dispose(bool disposing) {
            _innerStream.Dispose();
            base.Dispose(disposing);
        }

        public override bool CanRead {
            get { return _innerStream.CanRead; }
        }

        public override bool CanSeek {

            get { return _innerStream.CanSeek; }
        }

        public override bool CanWrite {
            get { return _innerStream.CanWrite; }
        }

        public override long Length {
            get { return _innerStream.Length; }
        }

        public override long Position {
            get { return _innerStream.Position; }
            set { _innerStream.Position = value; }
        }

        public override void Flush() {
            _innerStream.Flush();
        }

        public override long Seek(long offset, SeekOrigin origin) {
            return _innerStream.Seek(offset, origin);
        }

        public override void SetLength(long value) {
            _innerStream.SetLength(value);
        }

        public override int Read(byte[] buffer, int offset, int count) {
            var bytesRead = _innerStream.Read(buffer, offset, count);

            // assume that this stream is only being read to (but not written to)...
            if (_progressCallback != null)
                _progressCallback((_bytesProcessed += bytesRead) * 100 / _length);

            return bytesRead;
        }

        public override void Write(byte[] buffer, int offset, int count) {
            _innerStream.Write(buffer, offset, count);

            if (_progressCallback != null)
                _progressCallback((_bytesProcessed += count) * 100 / _length);
        }
    }
#endif
}