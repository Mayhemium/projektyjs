let ballLeft = 340;
    let ballTop = 340;
    let ball = document.getElementsByClassName("ball")[0];
    let holes = document.getElementsByClassName("hole");
    let winHole = document.getElementsByClassName("win")[0];
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

        check(ballLeft+10,ballTop+10);
    }

    function check(x,y){
        for (let i=0; i<holes.length; i++) {
            let top = parseInt(holes[i].style.top.split("px")[0])+10;
            let left = parseInt(holes[i].style.left.split("px")[0])+10;

            var a = x - left;
            var b = y - top;

            var c = Math.sqrt( a*a + b*b );

            if(c<=10)
                gameOver();
        }


        let top = parseInt(winHole.style.top.split("px")[0])+10;
        let left = parseInt(winHole.style.left.split("px")[0])+10;

        var a = x - left;
        var b = y - top;

        var c = Math.sqrt( a*a + b*b );

        if(c<=10)
            won();
    }

    function won(){
        clearInterval(myInterval);

        ballLeft = 340;
        ballTop = 340;
        ball.style.left = ballLeft + "px";
        ball.style.top = ballTop + "px";

        if(confirm("You won\nPlay again?")){
            myInterval = setInterval(ballMove,16);
        }
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