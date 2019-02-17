let ballLeft = 340;
    let ballTop = 340;
    let ball = document.getElementsByClassName("ball")[0];
    let x = 0;
    let z = 0;
    window.addEventListener('deviceorientation', (e)=> {
        x = event.beta;  // In degree in the range [-180,180]
        z = event.gamma; // In degree in the range [-90,90]
    });
    let myInterval = setInterval(ballMove,16);
    function ballMove(e){
        ballLeft = ballLeft + z/4;
        if(ballLeft<=0||ballLeft>=660){
            gameOver();
        }
        ball.style.left = ballLeft + "px";
        ballTop = ballTop + x/4;
        if(ballTop<=0||ballTop>=660){
            gameOver();
        }
        ball.style.top = ballTop + "px";
    }
    function gameOver(){
        clearInterval(myInterval);

        ballLeft = 340;
        ballTop = 340;
        ball.style.left = ballLeft + "px";
        ball.style.top = ballTop + "px";

        if(confirm("Game Over\nPlay again?")){
            myInterval = setInterval(ballMove,16);
        }
    }