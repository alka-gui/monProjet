window.onload = function() {
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 1000;
    var snaky;


    init();



    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snaky = new Snake([
            [6, 4],
            [5, 4],
            [4, 4]
        ]);
        refreshCanvas();

    }

    function refreshCanvas() {

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        setTimeout(refreshCanvas, delay);
    }

    function Snake(body) {
        this.body = body;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (i = 0; i)
        }
    }





}