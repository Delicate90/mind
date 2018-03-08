/**
 * Created by maiseries on 2018/3/7.
 */
$(() => {
    init();
});

const init = () => {
    $('.mind-block').on('click', function () {
        if ($(this).hasClass('mind-block-focus')) {
            $(this).find('.mind-edit').addClass('mind-edit-active');
            $(this).find('.mind-edit').focus();
        } else {
            $('.mind-block-focus').removeClass('mind-block-focus');
            $(this).addClass('mind-block-focus')
        }
    });
    $('.mind-edit').on('blur', function () {
        $(this).parent().find('.mind-block-content').html($(this).html());
        $(this).removeClass('mind-edit-active');
        calc(3);
    });
    calc(3);
    drag();
};
const load = () => {

};

const calc = (length) => {
    const lineWidth = 60;
    $('.mind-group[data-level=' + length + ']').each(function () {
        const parentBlock = $('.mind-block[data-block-id=' + $(this).data('block-group') + ']');
        const firstShellTop = $(this).children('.mind-shell').first().children().position().top;
        const lastShellTop = $(this).children('.mind-shell').last().children().position().top;
        if (firstShellTop > lastShellTop) {
            $(this).css({
                "padding-left": parentBlock.outerWidth() / 2 + lineWidth + "px",
                'padding-bottom': firstShellTop - lastShellTop + 'px'
            });
        } else {
            $(this).css({
                "padding-left": parentBlock.outerWidth() / 2 + lineWidth + "px",
                'padding-top': lastShellTop - firstShellTop + 'px'
            });
        }
        if ($(this).data('block-group') !== 0 && parentBlock.outerHeight() < $(this).outerHeight()) parentBlock.parent().css("height", $(this).outerHeight() + "px");
    });
    length--;
    if (length > 0) {
        calc(length);
    } else {
        draw();
        move(3);
    }
};
const move = (length) => {
    for (let i = 1; i < 4; i++) {
        $('.mind-group[data-level=' + i + ']').each(function () {
            const parentBlock = $('.mind-block[data-block-id=' + $(this).data('block-group') + ']');
            let leftPos = parentBlock.offset().left + parentBlock.outerWidth() / 2;
            let topPos = parentBlock.offset().top - ($(this).outerHeight() - parentBlock.outerHeight()) / 2;
            $(this).css({
                "left": leftPos + "px",
                "top": topPos + "px"
            });
        });
    }
};
const draw = () => {
    $('.mind-group').each(function () {
        const [basePointX, basePointY] = [0, $(this).outerHeight() / 2];
        let linesStr = '';
        $(this).children('.mind-shell').each(function () {
            const [blockPointX, blockPointY] = [$(this).position().left + $(this).outerWidth() / 2, $(this).position().top + $(this).outerHeight() / 2];
            linesStr += `<line x1="${basePointX >>> 0}" y1="${basePointY >>> 0}" x2="${blockPointX >>> 0}" y2="${blockPointY >>> 0}" style="stroke:rgb(255,0,0);stroke-width:2"/>`;
        })
        $(this).children('svg').remove();
        $(this).prepend(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left: 0;top: 0;width: ${$(this).outerWidth()};height: ${$(this).height()};">${linesStr}</svg>`);
    });
}
const save = () => {

};

const drag = () => {
    let dragBlock = null;
    $('.mind-block').on('mousedown',function(ex){
        if($(this).hasClass('mind-first')){

        }else{
            if($(this).hasClass('mind-block-focus') && !$(this).hasClass('mind-edit-active')){
                console.error('123');
                dragBlock = $(this);
                $('.mind-drag').html('').append($(this).clone());
                $('.mind-drag .mind-block').css({
                    'width': $(this).outerWidth() +'px',
                    'position': 'absolute',
                    'z-index': '12',
                    'opacity': '0.6'
                });
                $(document).on('mousemove',function(e){
                    const dragBlock = $('.mind-drag .mind-block');
                    if(dragBlock.length > 0){
                        dragBlock.css({
                            'left': e.pageX - ex.offsetX + 'px',
                            'top': e.pageY - ex.offsetY + 'px',
                        });
                    }
                });
                $('.mind-panel .mind-block').on('mouseover',function(){
                    $(this).addClass('mind-block-drag-over');
                });
                $('.mind-panel .mind-block').on('mouseleave',function(){
                    $(this).removeClass('mind-block-drag-over');
                });
            }
        }
    });
    $(document).on('mouseup',function(){
        if($('.mind-drag .mind-block').length > 0){
            dragBlock = null;
            $('.mind-drag').html('');
            $(document).off('mousemove');
            $('.mind-panel .mind-block').off('mouseover');
            $('.mind-panel .mind-block').off('mouseleave');
            $('.mind-block-drag-over').removeClass('mind-block-drag-over');
        }
    });
}