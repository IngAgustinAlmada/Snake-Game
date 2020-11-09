{//ver en old.js
// function resize(){
    //     var w = window.innerWidth / canvas.width;
    //     var h = window.innerHeight / canvas.height;
    //     var scale = Math.min(h, w);
    //     canvas.style.width = (canvas.width * scale) + 'px';
    //     canvas.style.height = (canvas.height * scale) + 'px';
    // }
    // function reset() {
    //     score = 0;
    //     dir = 1;
    //     body.length = 0;
    //     body.push(new Rectangle(40, 40, 10, 10));
    //     food.x = random(canvas.width / 10 - 1) * 10;
    //     food.y = random(canvas.height / 10 - 1) * 10;
    //     gameover = false;
    // }
// function paint(ctx) {
//     var i = 0,
//         l = 0;
//     // Clean canvas
//     ctx.fillStyle = '#000';//pinta el lienzo de negro
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     // Draw player
//     //ctx.fillStyle = '#0f0';
//     for (i = 0, l = body.length; i < l; i += 1) {
//         //body[i].fill(ctx);
//         ctx.drawImage(iBody, body[i].x, body[i].y);
//     }
//     // Draw food
//     //ctx.fillStyle = '#f00';
//     //food.fill(ctx);
//     //ctx.drawImage(iFood, food.x, food.y); cambiado por lo de abajo
//     food.drawImage(ctx, iFood);
//     // Debug last key pressed and square position
//     ctx.fillStyle = 'white';
//     //ctx.fillText('Last Press: ' + lastPress, 340, 20);
//     // Draw pause
//     if (pause) {
//         if (gameover) {
//             ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
//         } else {
//             ctx.fillText('PAUSE', canvas.width/2, canvas.height/2);
//     }
//     }
//     // Draw score
//     ctx.fillText('Score: ' + score, 0, 10);
//     // Draw FPS
//     ctx.fillText('FPS: ' + FPS, 0, 20);
//     // Draw walls
//     ctx.fillStyle = '#999';
//     for (i = 0, l = wall.length; i < l; i += 1) {
//         wall[i].fill(ctx);
//     }
// }

// function act(){
//     var i = 0,
//         l = 0;
//     // if (!pause){//si el juego NO está en pausa... que haga el act.
//     //     // GameOver Reset
//     //     if (gameover) {
//     //         reset();
//     //     }
//     //     // Move Body
//     //     for (i = body.length - 1; i > 0; i -= 1) {
//     //         body[i].x = body[i - 1].x;
//     //         body[i].y = body[i - 1].y;
//     //     }
//     //     // Change Direction
//     //     if (lastPress === KEY_UP && dir != 2) {
//     //         dir = 0;
//     //     }
//     //     if (lastPress === KEY_RIGHT && dir != 3) {
//     //         dir = 1;
//     //     }
//     //     if (lastPress === KEY_DOWN && dir != 0) {
//     //         dir = 2;
//     //     }
//     //     if (lastPress === KEY_LEFT && dir != 1) {
//     //         dir = 3;
//     //     }
//     //     // Move Head
//     //     if (dir === 0) {
//     //         body[0].y -= 10;
//     //     }
//     //     if (dir === 1) {
//     //         body[0].x += 10;
//     //     }
//     //     if (dir === 2) {
//     //         body[0].y += 10;
//     //     }
//     //     if (dir === 3) {
//     //         body[0].x -= 10;
//     //     }
//     //     // Out Screen
//     //     if (body[0].x > canvas.width - body[0].width) {
//     //         body[0].x = 0;
//     //     }
//     //     if (body[0].y > canvas.height - body[0].height) {
//     //         body[0].y = 0;
//     //     }
//     //     if (body[0].x < 0) {
//     //         body[0].x = canvas.width - body[0].width;
//     //     }
//     //     if (body[0].y < 0) {
//     //         body[0].y = canvas.height - body[0].height;
//     //     }
//     //     // Wall Intersects
//     //     for (i = 0, l = wall.length; i < l; i += 1) {
//     //         if (food.intersects(wall[i])) {
//     //             food.x = random(canvas.width / 10 - 1) * 10;
//     //             food.y = random(canvas.height / 10 - 1) * 10;
//     //         }
//     //         if (body[0].intersects(wall[i])) {
//     //             gameover = true;
//     //             pause = true;
//     //             aDie.play();
//     //         }
//     //     }
//     //     // Body Intersects
//     //     for (i = 2, l = body.length; i < l; i += 1) {
//     //         if (body[0].intersects(body[i])) {
//     //             gameover = true;
//     //             pause = true;
//     //             aDie.play();
//     //         }
//     //     }
//     //     // Food Intersects
//     //     if (body[0].intersects(food)) {
//     //         body.push(new Rectangle(food.x, food.y, 10, 10));
//     //         score += 1;
//     //         food.x = random(canvas.width / 10 - 1) * 10;
//     //         food.y = random(canvas.height / 10 - 1) * 10;
//     //         aEat.play();
//     //     }
//     // }
//     // Pause/Unpause
//     if (lastPress === KEY_ENTER) {
//         pause = !pause;
//         lastPress = undefined;
//     }
// }

/* setTimeout( function () {
    window.requestAnimationFrame(run)
    }, 75); */
}