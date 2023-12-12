var canvas;
var index = 0;
let x = 0,
    y = 0,
    z = 0;
var grid;
var o = 0;
var dA = 1;
var dB = 0.5;
var feed = 0.055;
var k = 0.062;


function setup() {

    can = createCanvas($("#canvas").width(), $("#canvas").height());
    can.parent("#canvas")
    noLoop();
    // grid = new Array(width * height).fill("a")
    const height = 200;
    const width = 200;
    grid = new Array(width).fill(new Array(height).fill({a:1,b:0}))
    for (var i = 100; i < 110; i++) {
        for (var j = 100; j < 110; j++) {
          grid[i][j].b = 1;
        }
      }
    console.log(grid)
}

function Getneightbours(i) {
    //returns up right down left 
    // i = x+y*width
    return [grid[i - width], grid[i + width], i % width == width - 1 ? -1 : grid[i + 1], i % width == 0 ? -1 : grid[i + 1]]
}

function draw() {
    // for (let index = 0; index < 200; index++) {


        background(0)
        loadPixels();

        // for (let i = 0; i < grid.length; i++) {
        //     off = i
        //     const element = grid[i];
        //     c = color("red")//color("hsl(" + Math.floor(map(i/width, 0, grid.length, 0, 360)) + ", 100%, 50%)")

        //     //if (element == "a") { // ? color("pink") : color("green")
        //     pixels[off] = c.levels[off++]
        //     pixels[off] = c.levels[off++]
        //     pixels[off] = c.levels[off++]
        //     pixels[off] = c.levels[off]

        //     //}
        // }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pix = x+y*width *4
                if (grid[x][y].a = 1)
                    c = color("white")
                else
                    c = color("red")
                pixels[pix + 0] = c.levels[0];

                pixels[pix + 1] = c.levels[1];
                pixels[pix + 2] = c.levels[2];

                pixels[pix + 3] = c.levels[3];


                n = Getneightbours(pix)
                //rule 1, if two or more surrounding then change
                if (n.filter(x => x == "b").length > 2) {
                    grid[pix] == "b"
                }
            
        }
        updatePixels();
        $("#fps").text("Interation " + o++)
    }
}