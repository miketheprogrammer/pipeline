var Pipeline = require("../pipeline");
var Stream = require("stream");
var through = require('through');
var JSONStream = require('JSONStream');
var test = require('tap').test;



function write(buf){
    this.emit('data',buf);
}
test('instances of objects Should be returned', function(t) {
    t.plan(3);

    var stream1 = through(write);

    var pipeline = new Pipeline(
        [
            { 
                pipes: [
                    /*through(function(d) {
                      d.newData = 1;//Math.random();
                      this.queue(d);
                      }),*/
                    JSONStream.stringify(),
                ]
            },
            {
                pipes: [
                    JSONStream.parse(),
                    JSONStream.stringify()
                ]
            },
            {
                pipes: [
                    JSONStream.parse()
                ]
            }
            
        ]
    );




    var stream2 = through(write);

    t.ok(pipeline.in);
    t.ok(pipeline.out);

    stream1.pipe(pipeline.in);
    pipeline.out.pipe(stream2);


    var numWrites = 100;
    stream2.on('data', function (d ) {
        console.log(numWrites, d.length);
        t.same(numWrites, d.length);
        
        
    });


    for (i = 0; i < numWrites; i++) {
        stream1.write({x:1});
    }

    

    stream1.end();
});
