let currentIndex = 0;
let allowAnimation = true;
let slides = document.getElementsByClassName("hero-img");

//animate function
function animate({
    duration,
    timing,
    render
}) {
    let start = performance.now();
    requestAnimationFrame(
        function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1
            let progress = timing(timeFraction);
            render(progress)
            if (timeFraction < 1) requestAnimationFrame(animate)
        }
    )

}

function slideJS(from, to, DOMobject, duration = 1000) {
    //from & to is 'number%'
    if (from === to) return 'Error you don\'t need move'
    DOMobject.style.left = `${from}%`
    animate({
        duration: duration,
        timing: powerEaseInOut,
        render: (progress) => DOMobject.style.left = `${from - (from - to) * progress}%`
    });
}

let powerEaseInOut = makeEaseInOut(powerOfN(3))


function powerOfN(n) {
    return function (timeFraction) {
        return Math.pow(timeFraction, n)
    }
}

function makeEaseInOut(timing) {
    return function (timeFraction) {
        if (timeFraction < .5)
            return timing(2 * timeFraction) / 2;
        else
            return (2 - timing(2 * (1 - timeFraction))) / 2;
    }
}



function slideController(currentIndex, goalIndex) {
    if (currentIndex === goalIndex) return 'Error currentIndex and goalIndex is same';
    if (currentIndex >= slides.length || goalIndex >= slides.length) return 'Error currentIndex and goalIndex number is too large'

    let rightSideIn = directionIndidcator(goalIndex);


    visibalize(currentIndex, goalIndex);

    if (rightSideIn) {

        slideJS(0, -100, slides[currentIndex]);
        slideJS(100, 0, slides[goalIndex]);
    }
    if (!rightSideIn) {
        slideJS(0, 100, slides[currentIndex]);
        slideJS(-100, 0, slides[goalIndex]);
    }
}

function visibalize(...index) {
    for (let i = 0; i < slides.length; i++) {
        if (index.includes(i)) {
            slides[i].style.display = 'block';
        } else {
            slides[i].style.display = 'none';
        }
    }
}


function directionIndidcator(goalIndex) {
    if (goalIndex > slides.length - 1) return "Error goalIndex is more than slides.length";
    let rightSideIn = true;
    if (goalIndex === 0 && currentIndex === slides.length - 1) return rightSideIn;
    let half = slides.length / 2;
    let dist = goalIndex - currentIndex;

    if (dist === 0) return "Error goalIndex as same as currentIndex";
    else if (dist < half && dist > 0) rightSideIn = true;
    else if (dist < 0 || dist > half) rightSideIn = false;
    else rightSideIn = true;
    return rightSideIn
}



function buttonGoalIndex(next) {
    let goalIndex = 0
    if (typeof next !== 'boolean') return;

    if (next) {
        goalIndex = (currentIndex + 1 >= slides.length - 1) ? 0 : currentIndex + 1;
    }
    if (!next) {
        goalIndex = (currentIndex - 1 <= 0) ? slides.length - 1 : currentIndex - 1;
    }
    return goalIndex
}





function doAnimation(goalIndex) {
    if (!allowAnimation) return
    allowAnimation = false;
    slideController(currentIndex, goalIndex);
    currentIndex = goalIndex;
    setTimeout(() => {
        visibalize(currentIndex);
        allowAnimation = true;
    }, 1001, );
    slides[currentIndex].cl
    // for ()
}



function buttonClick(next = true) {
    let goalIndex = 0
    if (typeof next !== "boolean") {
        return 'Error input not boolean'
    } else if (next) {
        goalIndex = (currentIndex + 1 >= slides.length) ? 0 : currentIndex + 1;
    } else if (!next) {
        goalIndex = (currentIndex - 1 < 0) ? slides.length - 1 : currentIndex - 1;
    }
    doAnimation(goalIndex)
}


(function initialize() {
    visibalize(0);
})()