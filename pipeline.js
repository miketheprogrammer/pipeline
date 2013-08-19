var Stream = require('stream');
var util = require('util');
var through = require('through');
var events = require('events');
var EventEmitter = events.EventEmitter || events.EventEmitter2;
var pipeline = function (config) {
    this._stream = through();
    EventEmitter.call(this);

    Object.defineProperties(this, {
        'out': {
            'get': function() { return this._out; }
        },
        'in' : {
            'get': function() { return this._stream; }
        }
    });

    this._pipes = [];
    this._buffers = new Array(config.length);
    for ( var i in config ) {
        var pipe = config[i];
        for ( var j in pipe.pipes ) {
            if ( j != 0 )
                pipe.pipes[j-1].pipe(pipe.pipes[j]);
            this._out = pipe.pipes[j];
        }
        this._pipes.push(pipe.pipes[0]);
    }
    for ( i=0; i<this._pipes.length; i++ ) {
        var pipe = config[i].pipes[config[i].pipes.length-1];
        if ( i != 0 ) {
            var _pipe = config[i-1].pipes[config[i-1].pipes.length-1];
            var _buffer = '';
            _pipe.on('data', function(d) {
                _buffer += (d);
            });
            _pipe.on('end', function(d) {
                try {
                    pipe.write(_buffer);
                } catch ( e ) {}
            });
        }
    }
    this.in.pipe(this._pipes[0]);
}
util.inherits(pipeline, EventEmitter);


pipeline.prototype.pipe = function( dst ) {
    this._stream.pipe(dst);
}

module.exports = pipeline
