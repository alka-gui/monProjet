window.onload = function() {
    var canvas;
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 1000;
    var snakee;
    var pomme;
    var widthInblocks = canvasWidth / blockSize;
    var heightInblocks = canvasHeight / blockSize;
    var score;
    var timeOut;


    init();



    function init() {
        score = 0;
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.display = "block";
        canvas.style.margin = "50px auto";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], "right");
        pomme = new Apple([10, 10]);

        refreshCanvas();

    }

    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {

            if (snakee.isEatingApple(pomme)) {
                //augmentVolume();
                if (delay > 100)
                    delay -= 100;
                else
                    delay = 100;
                score++;
                snakee.ateApple = true;
                do {
                    pomme.setPosition();
                } while (pomme.isOnSnake(snakee))


            }

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            pomme.draw();

            timeOut = setTimeout(refreshCanvas, delay);
        }

    }

    function augmentVolume() {
        if (score > 5) {
            delay = 300;
        }

    }


    function gameOver() {
        ctx.save;
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = "5";
        ctx.strokeText("Game Over", canvasWidth / 2, (canvasHeight / 2) - 180);
        ctx.fillText("Game Over", canvasWidth / 2, (canvasHeight / 2) - 180);

        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("appuyer sur Espace pour rejouer", canvasWidth / 2, (canvasHeight / 2) - 150);
        ctx.fillText("appuyer sur Espace pour rejouer", canvasWidth / 2, (canvasHeight / 2) - 150);
        ctx.restore;
    }

    function restart() {
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], "right");
        pomme = new Apple([10, 10]);
        score = 0;
        delay = 1000;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save;

        ctx.fillText(score.toString(), canvasWidth / 2, (canvasHeight / 2));
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        ctx.fillText(score.toString(), canvasWidth / 2, (canvasHeight / 2));
        ctx.restore;
    }

    function drawBlock(ctx, position) {

        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);

    }



    function Snake(body, direction) {
        this.body = body;
        this.ateApple = false;
        this.direction = direction;

        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            };
            ctx.restore();
        };

        this.advance = function() {
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw ("invalid direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };

        this.setDirection = function(newDirection) {
            var allowDirection;
            switch (this.direction) {
                case "left":
                case "right":
                    allowDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowDirection = ["left", "right"];
                    break;
                default:
                    throw ("invalid direction");
            }
            if (allowDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function() {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInblocks - 1;
            var maxY = heightInblocks - 1;
            var isNotbetweenHorizontalWall = snakeX < minX || snakeX > maxX;
            var isNotbetweenVerticalWall = snakeY < minY || snakeY > maxY;
            if (isNotbetweenHorizontalWall || isNotbetweenVerticalWall) {
                wallCollision = true;
            }
            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;

        };
        this.isEatingApple = function(appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;

        };
    }

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setPosition = function() {
            var newX = Math.round(Math.random() * (widthInblocks - 1));
            var newY = Math.round(Math.random() * (heightInblocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }

            }
            return isOnSnake;

        };
    }

    document.onkeydown = function handleKeyDown(e) {
        var clef = e.keyCode;
        var newDirection;
        console.log(newDirection);
        switch (clef) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
            default:
                return;
        }
        snakee.setDirection(newDirection);

    }
}