function scrollTo(params) {
    return new Promise ((res,rej)=>{
    const {
        element,
        to,
        duration,
        scrollDirection,
        callBack, 
        context
    } = params;
    var start = element[scrollDirection],
    change = to - start,
    increment = 20;
//for smooth animation
    var animateScroll = function(elapsedTime) {
        elapsedTime +=increment;
        var position = easeInOut(elapsedTime,start,change,duration);
        element[scrollDirection] = position;
        if(elapsedTime < duration) {
           // window.requestAnimationFrame(animateScroll(null,elapsedTime));
            setTimeout(function(){
                animateScroll(elapsedTime)
            },increment);
        }
        else {
        
            callBack.call(context);
            res();
        }
    };
     animateScroll(0);
   // window.requestAnimationFrame(animateScroll(null,0));
});
}
//interpolation
function easeInOut(currentTime, start, change, duration) { 
    currentTime/= duration/2;
    if(currentTime < 1){
        return change/2 * currentTime * currentTime + start;
    }
    currentTime -=1;
    return -change/2 * (currentTime * (currentTime - 2) - 1) + start;

}

export default scrollTo;