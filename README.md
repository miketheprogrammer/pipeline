pipeline
========

Efficient way of connecting disparate streams


When you want to connect several disparate pipes in a configuration driven way use this tool.
Disparate here means pipes that at the end should buffer completely.

a => b => c   wait for c to end then  c => d => e  wait for e to end then e => f => g


How to.
======
Create a config and pass it in to pipline.

````javascript
    var pipeline = new Pipeline(
        [
            { 
                pipes: [
                    through(function(d) {
                      d.newData = 1;//Math.random();
                      this.queue(d);
                      }),
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

````

Pipeline exposes the 'in' stream and 'out' stream through two properties.
````javascript
process.stdout.pipe(pipeline.out);
pipeline.in.write("hello");
````
The above will break because pipeline.out in the above example is objects. but add in another JSONStream.stringify
and you will have a working pipeline.


Pipelines are executed in the array order they are provided.


Please look at the Test file for examples.



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/miketheprogrammer/pipeline/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

