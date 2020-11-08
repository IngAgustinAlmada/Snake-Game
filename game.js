/*jslint bitwise:true, es5: true */
(function (window, undefined) {
    'use strict';
//////////////////////////////--VARIABLES--///////////////////////////////////////

    var KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    canvas = undefined,
    ctx = undefined,
    lastPress = undefined,
    pause = true,
    gameover = true,
    dir = 0,
    score = 0,
    wall = [],
    body = [],
    food = undefined,
    iBody = new Image(),
    iFood = new Image(),
    aEat = new Audio(),
    aDie = new Audio(),
    lastUpdate = 0,
    FPS = 0,
    frames = 0,
    acumDelta = 0;

    //////////////////////////////--FUNCIONES--///////////////////////////////////////
    function resize(){
        var w = window.innerWidth / canvas.width;
        var h = window.innerHeight / canvas.height;
        var scale = Math.min(h, w);
        canvas.style.width = (canvas.width * scale) + 'px';
        canvas.style.height = (canvas.height * scale) + 'px';
    }
    function Rectangle(x, y, width, height) {//  esto se lo considera una clase.
        this.x = (x === undefined) ? 0 : x;/*En esta línea, asignamos a this.x uno de dos valores. Se comprueba mediante (x == null) ? si su valor es nulo o indefinido. Si es así, se
        asigna el valor antes de los dos puntos (0), y en caso contrario, se asigna el valor posterior a los dos puntos (x). */
        this.y = (y === undefined) ? 0 : y;
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height; /* De esta forma, si envío solo tres valores al rectángulo en lugar de 4, me creará un cuadrado perfecto cuyo ancho y alto será el tercer y último valor asignado: */
        this.intersects = function (rect) {
            if (rect === undefined) {
                window.console.warn('Missing parameters on function intersects');
            } else {
                return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
            }
        };
        this.fill = function (ctx) {//, es que este se dibuje automáticamente en nuestro lienzo.
        if (ctx === undefined) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        };
        this.drawImage = function (ctx, img) {
            if (img === undefined) {
                window.console.warn('Missing parameters on function drawImage');
            } else {
                if (img.width) {
                    ctx.drawImage(img, this.x, this.y);
                } else {
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            }
            };
    }
    /* Rectangle.prototype = {
        constructor: Rectangle,
        intersects: function (rect) {
            if (rect === undefined) {
                window.console.warn('Missing parameters on function intersects');
            } else {
                return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
            }
        },
        fill: function (ctx) {
        if (ctx === undefined) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        },
        drawImage: function (ctx, img) {
            if (img === undefined) {
                window.console.warn('Missing parameters on function drawImage');
            } else {
                if (img.width) {
                    ctx.drawImage(img, this.x, this.y);
                } else {
                    ctx.strokeRect(this.x, this.y, this.width, this.height);
                }
            }
        }
    }; */
    /*Rectangle.prototype.intersects = function (rect) {
        if (rect === undefined) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
        }
    };
    Rectangle.prototype.fill = function (ctx) {
        if (ctx === undefined) {
            window.console.warn('Missing parameters on function fill');
        } else {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    Rectangle.prototype.drawImage = function (ctx, img) {
        if (img === undefined) {
            window.console.warn('Missing parameters on function drawImage');
        } else {
            if (img.width) {
                ctx.drawImage(img, this.x, this.y);
            } else {
                ctx.strokeRect(this.x, this.y, this.width, this.height);
            }
        }
    };*/
    function random(max) {
        return ~~(Math.random() * max);
        //return Math.floor(Math.random() * max);
    }
    function reset() {
        score = 0;
        dir = 1;
        body.length = 0;
        body.push(new Rectangle(40, 40, 10, 10));
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
        gameover = false;
    }
    function canPlayOgg() {
        var aud = new Audio();
        if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
            return true;
        } else {
            return false;
        }
    }
    function paint(ctx) { // pinta el lienzo y el rectangulo
        var i = 0,
            l = 0;
        // Clean canvas
        ctx.fillStyle = '#000';//pinta el lienzo de negro
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw player
        //ctx.fillStyle = '#0f0';
        for (i = 0, l = body.length; i < l; i += 1) {
            //body[i].fill(ctx);
            ctx.drawImage(iBody, body[i].x, body[i].y);
        }
        // Draw food
        //ctx.fillStyle = '#f00';
        //food.fill(ctx);
        //ctx.drawImage(iFood, food.x, food.y); cambiado por lo de abajo
        food.drawImage(ctx, iFood);
        // Debug last key pressed and square position
        ctx.fillStyle = 'white';
        //ctx.fillText('Last Press: ' + lastPress, 340, 20);
        // Draw pause
        if (pause) {
            if (gameover) {
                ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            } else {
                ctx.fillText('PAUSE', canvas.width/2, canvas.height/2);
        }
        }
        // Draw score
        ctx.fillText('Score: ' + score, 0, 10);
        // Draw FPS
        ctx.fillText('FPS: ' + FPS, 0, 20);
        // Draw walls
        ctx.fillStyle = '#999';
        for (i = 0, l = wall.length; i < l; i += 1) {
            wall[i].fill(ctx);
        }
    }
    function act(){
        var i = 0,
            l = 0;
        if (!pause){//si el juego NO está en pausa... que haga el act.
            // GameOver Reset
            if (gameover) {
                reset();
            }
            // Move Body
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            // Change Direction
            if (lastPress === KEY_UP && dir != 2) {
                dir = 0;
            }
            if (lastPress === KEY_RIGHT && dir != 3) {
                dir = 1;
            }
            if (lastPress === KEY_DOWN && dir != 0) {
                dir = 2;
            }
            if (lastPress === KEY_LEFT && dir != 1) {
                dir = 3;
            }
            // Move Head
            if (dir === 0) {
                body[0].y -= 10;
            }
            if (dir === 1) {
                body[0].x += 10;
            }
            if (dir === 2) {
                body[0].y += 10;
            }
            if (dir === 3) {
                body[0].x -= 10;
            }
            // Out Screen
            if (body[0].x > canvas.width - body[0].width) {
                body[0].x = 0;
            }
            if (body[0].y > canvas.height - body[0].height) {
                body[0].y = 0;
            }
            if (body[0].x < 0) {
                body[0].x = canvas.width - body[0].width;
            }
            if (body[0].y < 0) {
                body[0].y = canvas.height - body[0].height;
            }
            // Wall Intersects
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (food.intersects(wall[i])) {
                    food.x = random(canvas.width / 10 - 1) * 10;
                    food.y = random(canvas.height / 10 - 1) * 10;
                }
                if (body[0].intersects(wall[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }
            // Body Intersects
            for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                }
            }
                // Food Intersects
            if (body[0].intersects(food)) {
                body.push(new Rectangle(food.x, food.y, 10, 10));
                score += 1;
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
                aEat.play();
            }
        }
        // Pause/Unpause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
            lastPress = undefined;
        }
    }
    function repaint() {
        window.requestAnimationFrame(repaint);
        paint(ctx);//para pintar en el lienzo
    }
    function run() {
        //window.requestAnimationFrame(run); // lo hace corer a 60fps
        setTimeout(run, 60);//llama a la funcon run cada 60 miliseg. = 35 fps
        var now = Date.now(),
        deltaTime = (now - lastUpdate) / 1000;
        if (deltaTime > 1) {
            deltaTime = 0;
        }
        lastUpdate = now;
        frames += 1;
        acumDelta += deltaTime;
        if (acumDelta > 1) {
            FPS = frames;
            frames = 0;
            acumDelta -= 1;
        }
        act();
        //paint(ctx);//llama a las acciones sobre el juego
    }
    function init() {
        // Get canvas and context
        canvas = document.getElementById('canvas');//llama al canvas del html.
        ctx = canvas.getContext('2d');//obtiene el contexto 2d, sería el pincel para pintar
        // Load assets
        iBody.src = 'body.png';
        iFood.src = 'fruit.png';
        if (canPlayOgg()) {
            aEat.src='chomp.oga';
            aDie.src = 'dies.oga';
            } else {
            aEat.src='chomp.m4a';
            aDie.src ='dies.m4a';
            }
        // Create food
        food = new Rectangle(80, 80, 10, 10);
        // Create walls
        wall.push(new Rectangle(100, 100, 10, 10));
        wall.push(new Rectangle(100, 250, 10, 10));
        wall.push(new Rectangle(100, 400, 10, 10));
        wall.push(new Rectangle(500, 100, 10, 10));
        wall.push(new Rectangle(500, 400, 10, 10));
        wall.push(new Rectangle(900, 100, 10, 10));
        wall.push(new Rectangle(900, 250, 10, 10));
        wall.push(new Rectangle(900, 400, 10, 10));
        // Start game
        run();//hace que se repita la funcion de pintar el lienzo
        repaint();
        resize();
    }
    setTimeout( function () {
        window.requestAnimationFrame(run)
        }, 75);

/////////////////////////////////--ESCUCHAS--///////////////////////////////////////

    window.addEventListener('load', init, false);
    window.addEventListener('resize', resize, false);
    document.addEventListener('keydown', function (evt) {//almacena la tecla presionada
    lastPress = evt.which;
    }, false);
}(window));
    