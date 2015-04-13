function setHeights(){
        var ew = $('.innerdial').css("width");
        var partWidth = $('li.part').css('width');
        var fontSize = parseInt(partWidth)*.75; 
        console.log(partWidth);
        var buttonWidth = $('button.parts-btn').css('width');
        $('.innerdial, .meter-outer, #meter-inner').css({'height':ew}); //makes height = fluid width
        $('dial span.fa').css({'line-height':ew, 'font-size': fontSize}); //makes icon in dial responsive to dial size change
        $('li.part').css({'line-height':partWidth});
        $('.nav-logo, .nav-menu').css({'height': partWidth});
        $('button.parts-btn').css({'height': buttonWidth}); 
        $('.nav-menu').css({'font-size': fontSize});
    }

$(document).ready(function(){
    setHeights();
    $(window).resize(function () {
        setHeights();
        $('.innerdial_knob').css({'width':'40%', 'height': '40%'});
    });
});