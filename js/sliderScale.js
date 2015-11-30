$("#sliderDouble")
    .slider({
        max: 2011,
        min: 1992,
        values: [ax, ay],
        range: true
    })
    .slider("pips", {
        rest: "label"
    });



placeSlider();