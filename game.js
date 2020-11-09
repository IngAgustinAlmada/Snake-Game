/*jslint bitwise:true, es5: true */
(function (window, undefined) {
    'use strict';
    //////////////////////////////--VARIABLES--///////////////////////////////////////

    var acumDelta = 0,
        aDie = new Audio(),
        aEat = new Audio(),
        body = [],
        buffer = null,
        buffer = null,
        bufferCtx = null,
        bufferCtx = null,
        canvas = null,
        ctx = null,
        currentScene = 0,
        dir = 0,
        food = null,
        foodBonus = null,
        FPS = 0,
        frames = 0,
        gameover = false,
        gameScene = null,
        highscores = [], //contiene los mayores puntajes
        highscoresScene = null,
        iBody = new Image(),
        iWall = new Image(),
        iFood = new Image(),
        iFoodBonus = new Image(),
        iHeadL = new Image(),
        iHeadR = new Image(),
        KEY_DOWN = 40,
        KEY_ENTER = 13,
        KEY_LEFT = 37,
        KEY_RIGHT = 39,
        KEY_UP = 38,
        lastPress = null,
        lastUpdate = 0,
        mainScene = null,
        pause = false,
        posHighscore = 10, //contiene la posicion del nuevo mejor puntaje.
        scenes = [],
        score = 0,
        wall = [];

    //////////////////////////////--FUNCIONES--///////////////////////////////////////

    function Rectangle(x, y, width, height) { //  esto se lo considera una clase.
        this.x = (x === undefined) ? 0 : x;
        /*En esta línea, asignamos a this.x uno de dos valores. Se comprueba mediante (x == null) ? si su valor es nulo o indefinido. Si es así, se
                asigna el valor antes de los dos puntos (0), y en caso contrario, se asigna el valor posterior a los dos puntos (x). */
        this.y = (y === undefined) ? 0 : y;
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height; /* De esta forma, si envío solo tres valores al rectángulo en lugar de 4, me creará un cuadrado perfecto cuyo ancho y alto será el tercer y último valor asignado: */
        // this.intersects = function (rect) {
        //     if (rect === undefined) {
        //         window.console.warn('Missing parameters on function intersects');
        //     } else {
        //         return (this.x < rect.x + rect.width &&
        //         this.x + this.width > rect.x &&
        //         this.y < rect.y + rect.height &&
        //         this.y + this.height > rect.y);
        //     }
        // };
        // this.fill = function (ctx) {//, es que este se dibuje automáticamente en nuestro lienzo.
        // if (ctx === undefined) {
        //     window.console.warn('Missing parameters on function fill');
        // } else {
        //     ctx.fillRect(this.x, this.y, this.width, this.height);
        // }
        // };
        // this.drawImage = function (ctx, img) {
        //     if (img === undefined) {
        //         window.console.warn('Missing parameters on function drawImage');
        //     } else {
        //         if (img.width) {
        //             ctx.drawImage(img, this.x, this.y);
        //         } else {
        //             ctx.strokeRect(this.x, this.y, this.width, this.height);
        //         }
        //     }
        //     };
    }
    Rectangle.prototype = {
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
    };
    Rectangle.prototype.intersects = function (rect) {
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
    };

    function Scene() {
        this.id = scenes.length;
        scenes.push(this);
    }
    Scene.prototype = {
        constructor: Scene,
        load: function () {},
        paint: function (ctx) {},
        act: function () {}
    };

    function loadScene(scene) {
        currentScene = scene.id;
        scenes[currentScene].load();
    }

    function random(max) {
        return ~~(Math.random() * max);
        //return Math.floor(Math.random() * max);
    }

    function addHighscore(score) {
        posHighscore = 0;
        while (highscores[posHighscore] > score && posHighscore < highscores.length) {
            posHighscore += 1;
        }
        highscores.splice(posHighscore, 0, score);
        if (highscores.length > 10) {
            highscores.length = 10;
        }
        localStorage.highscores = highscores.join(',');
    }

    function repaint() {
        window.requestAnimationFrame(repaint);
        if (scenes.length) {
            scenes[currentScene].paint(ctx);
        }
        // ctx.imageSmoothingEnabled = false;
        // paint(bufferCtx);
        // ctx.fillStyle = '#000';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
    }

    function run() {
        //window.requestAnimationFrame(run); // lo hace corer a 60fps
        setTimeout(run, 60); //llama a la funcon run cada 60 miliseg. = 35 fps
        if (scenes.length) {
            scenes[currentScene].act();
        }
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
        //act();
        //paint(ctx);//llama a las acciones sobre el juego
    }

    function init() {
        // Get canvas and context
        canvas = document.getElementById('canvas'); //llama al canvas del html.
        ctx = canvas.getContext('2d'); //obtiene el contexto 2d, sería el pincel para pintar
        // Load assets
        iHeadR.src = './skins/headR.png';
        iHeadL.src = './skins/headL.png';
        iBody.src = './skins/body.png';
        iFood.src = './skins/apple.png';
        iFoodBonus.src = './skins/cherry.png';
        iWall.src = './skins/wall.png';
        if (canPlayOgg()) {
            aEat.src = './sounds/chomp.oga';
            aDie.src = './sounds/dies.oga';
        } else {
            aEat.src = './sounds/chomp.m4a';
            aDie.src = './sounds/dies.m4a';
        }
        // Create food
        food = new Rectangle(80, 80, 10, 10);
        foodBonus = new Rectangle(100, 100, 10, 10);
        // Create walls
        for (var i = 0; i < 15; i++) {
            wall.push(new Rectangle(200 + i * 10, 300 - i * 10, 10, 10));
            wall.push(new Rectangle(125 + i * 10, 225 - i * 10, 10, 10));
        }

        // Load saved highscores
        if (localStorage.highscores) {
            highscores = localStorage.highscores.split(',');
        }
        // Load buffer
        buffer = document.createElement('canvas');
        bufferCtx = buffer.getContext('2d');
        buffer.width = 1200;
        buffer.height = 600;
        // Start game
        drawcherry();
        run(); //hace que se repita la funcion de pintar el lienzo
        repaint();
        //resize();
    }
    // Main Scene
    mainScene = new Scene();
    mainScene.paint = function (ctx) {
        // Clean canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw title
        ctx.fillStyle = '#fff';
        ctx.fillText('SNAKE', canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillText('Press Enter', canvas.width / 2, canvas.height / 2 + 20);
    };
    mainScene.act = function () {
        // Load next scene
        if (lastPress === KEY_ENTER) {
            loadScene(highscoresScene);
            lastPress = null;
        }
    };
    // Game Scene
    gameScene = new Scene();
    gameScene.load = function () {
        score = 0;
        dir = 1;
        body.length = 0;
        body.push(new Rectangle(40, 40, 10, 10));
        food.x = random(canvas.width / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
        var interval = setInterval(function () {
            drawcherry();
        }, 5000);
        gameover = false;
    };
    gameScene.paint = function (ctx) {
        var i = 0,
            l = 0;
        // Clean canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw player
        ctx.strokeStyle = '#0f0';
        if (lastPress === KEY_RIGHT || lastPress === KEY_UP || lastPress === KEY_DOWN || lastPress !== KEY_ENTER) {
            body[0].drawImage(ctx, iHeadR);
        }
        if (lastPress === KEY_LEFT || lastPress === KEY_UP || lastPress === KEY_DOWN) {
            body[0].drawImage(ctx, iHeadL);
        }
        //body[0].drawImage(ctx, iHead);
        for (i = 1, l = body.length; i < l; i += 1) {
            body[i].drawImage(ctx, iBody);
        }
        // Draw walls
        for (i = 0, l = wall.length; i < l; i += 1) {
            wall[i].drawImage(ctx, iWall);
        }
        // Draw food
        food.drawImage(ctx, iFood);
        // Draw Bonus
        foodBonus.drawImage(ctx, iFoodBonus);
        // Draw score
        ctx.fillStyle = 'white';
        ctx.fillText('Score: ' + score, 50, 10);
        // Draw FPS
        ctx.fillText('FPS: ' + FPS, 50, 20);
        // Debug last key pressed
        //ctx.fillText('Last Press: '+ lastPress, 10, 30);
        // Draw pause / Game Over
        if (pause) {
            if (gameover) {
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            } else {
                ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
            }
        }
    };
    gameScene.act = function () {
        var i = 0,
            l = 0;
        if (!pause) {
            // GameOver Reset
            if (gameover) {
                loadScene(highscoresScene);
            }
            // Move Body
            for (i = body.length - 1; i > 0; i -= 1) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            // Change Direction
            if (lastPress === KEY_UP && dir !== 2) {
                dir = 0;
            }
            if (lastPress === KEY_RIGHT && dir !== 3) {
                dir = 1;
            }
            if (lastPress === KEY_DOWN && dir !== 0) {
                dir = 2;
            }
            if (lastPress === KEY_LEFT && dir !== 1) {
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
            // Food Intersects
            if (body[0].intersects(food)) {
                body.push(new Rectangle(0, 0, 10, 10));
                score += 1;
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
                aEat.play();
            }
            // FoodBonus Intersects
            if (body[0].intersects(foodBonus)) {
                score += 5;
                drawcherry();
                callBackend();
                aEat.play();
            }
            // Wall Intersects
            for (i = 0, l = wall.length; i < l; i += 1) {
                if (food.intersects(wall[i])) {
                    food.x = random(canvas.width / 10 - 1) * 10;
                    food.y = random(canvas.height / 10 - 1) * 10;
                }
                if (foodBonus.intersects(wall[i])) {
                    foodBonus.x = random(canvas.width / 10 - 1) * 10;
                    foodBonus.y = random(canvas.height / 10 - 1) * 10;
                }
                if (body[0].intersects(wall[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                    addHighscore(score);
                }
            }
            // Body Intersects
            for (i = 2, l = body.length; i < l; i += 1) {
                if (body[0].intersects(body[i])) {
                    gameover = true;
                    pause = true;
                    aDie.play();
                    addHighscore(score);
                }
            }
            // Food and FoodBonus Intersects
            if (food.intersects(foodBonus)) {
                food.x = random(canvas.width / 10 - 1) * 10;
                food.y = random(canvas.height / 10 - 1) * 10;
            }
        }
        // Pause/Unpause
        if (lastPress === KEY_ENTER) {
            pause = !pause;
            lastPress = null;
        }
    };
    // Highscore Scene
    highscoresScene = new Scene();
    highscoresScene.paint = function (ctx) {
        var i = 0,
            l = 0;
        // Clean canvas
        ctx.fillStyle = '#030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw title
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('HIGH SCORES', canvas.width / 2, 50);
        // Draw high scores
        ctx.textAlign = 'right';
        for (i = 0, l = highscores.length; i < l; i += 1) {
            ctx.fillText(highscores[i], canvas.width / 2, 100 + i * 10);
        }
    };
    highscoresScene.act = function () {
        // Load next scene
        if (lastPress === KEY_ENTER) {
            loadScene(gameScene);
            lastPress = null;
        }
    };

    function callBackend() {
        return fetch('https://jsonplaceholder.typicode.com/?score=10')
            .then(function (response) {
                console.log('Score sent successfully');
                console.log('Score: ' + score);
                console.log('HighScores: ' + highscores);
            })
            .catch(function (error) {
                console.log('Error trying to send the score');
            });
    }

    function drawcherry() {
        foodBonus.x = random(canvas.width / 10 - 1) * 10;
        foodBonus.y = random(canvas.height / 10 - 1) * 10;
    }

    function canPlayOgg() {
        var aud = new Audio();
        if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
            return true;
        } else {
            return false;
        }
    }
    /////////////////////////////////--ESCUCHAS--///////////////////////////////////////

    window.addEventListener('load', init, false);
    //window.addEventListener('resize', resize, false);
    document.addEventListener('keydown', function (evt) {
        if (evt.which >= 37 && evt.which <= 40) {
            evt.preventDefault();
        }
        lastPress = evt.which;
    }, false);
}(window));