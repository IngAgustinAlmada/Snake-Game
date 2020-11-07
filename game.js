//////////////////////////////--VARIABLES--///////////////////////////////////////

var KEY_ENTER = 13,
    KEY_LEFT = 37,
    KEY_UP = 38,
    KEY_RIGHT = 39,
    KEY_DOWN = 40,
    canvas = null,
    ctx = null,
    lastPress = null,
    pause = true,
    gameover = true,
    dir = 0,
    score = 0,
    wall = new Array(),
    body = new Array(),
    food = null,
    iBody = new Image(),
    iFood = new Image(),
    aEat = new Audio(),
    aDie = new Audio();

//////////////////////////////--FUNCIONES--///////////////////////////////////////

function Rectangle(x, y, width, height) {
    this.x = (x == null) ? 0 : x;
    this.y = (y == null) ? 0 : y;
    this.width = (width == null) ? 0 : width;
    this.height = (height == null) ? this.width : height;
    this.intersects = function (rect) {
        if (rect == null) {
            window.console.warn('Missing parameters on function intersects');
        } else {
            return (this.x < rect.x + rect.width &&
                this.x + this.width > rect.x &&
                this.y < rect.y + rect.height &&
                this.y + this.height > rect.y);
        }
    };
    this.fill = function (ctx) {
        if (ctx == null) {
            window.console.warn('Missing parameters on function fill');
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
}
function random(max) {
    return Math.floor(Math.random() * max);
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
    ctx.drawImage(iFood, food.x, food.y);
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
        if (lastPress == KEY_UP && dir != 2) {
            dir = 0;
        }
        if (lastPress == KEY_RIGHT && dir != 3) {
            dir = 1;
        }
        if (lastPress == KEY_DOWN && dir != 0) {
            dir = 2;
        }
        if (lastPress == KEY_LEFT && dir != 1) {
            dir = 3;
        }
        // Move Head
        if (dir == 0) {
            body[0].y -= 10;
        }
        if (dir == 1) {
            body[0].x += 10;
        }
        if (dir == 2) {
            body[0].y += 10;
        }
        if (dir == 3) {
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
    if (lastPress == KEY_ENTER) {
        pause = !pause;
        lastPress = null;
    }
}
function repaint() {
    window.requestAnimationFrame(repaint);
    paint(ctx);//para pintar en el lienzo
}
function run() {
    //window.requestAnimationFrame(run); // lo hace corer a 60fps
    setTimeout(run, 50);//llama a la funcon run cada 50 miliseg. = 60 fps
    act();//llama a las acciones sobre el juego
}

function init() {
    // Get canvas and context
    canvas = document.getElementById('canvas');//llama al canvas del html.
    ctx = canvas.getContext('2d');//obtiene el contexto 2d, sería el pincel para pintar
    // Load assets
    iBody.src = 'body.png';
    iFood.src = 'fruit.png';
    aEat.src = 'chomp.oga';
    aDie.src = 'dies.oga';
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
}

//////////////////////////////--ESCUCHAS--///////////////////////////////////////

window.addEventListener('load', init, false);
document.addEventListener('keydown', function (evt) {//almacena la tecla presionada
    lastPress = evt.which;
    }, false);


