/**
 * Created by maiseries on 2018/3/7.
 */
$(() => {
    init();
});

const lineWidth = 60; //group 与 block 间距离
let jsonDepth = 0;

const init = () => {
    load(()=>{
        edit();
        drag();
    });
};
//todo 读取json并渲染
const load = (callback) => {
    const json = {
        blocks: {
            id: 0,
            content: 'root',
            group: {
                level: 0,
                parent: 0,
                children: [
                    {
                        id: 1,
                        content: 'block-1',
                        group: {
                            level: 1,
                            parent: 1,
                            children: [
                                {
                                    id: 3,
                                    content: 'block-3',
                                    group: {
                                        level: 2,
                                        parent: 3,
                                        children: []
                                    }
                                },{
                                    id: 4,
                                    content: 'block-4',
                                    group: {
                                        level: 2,
                                        parent: 4,
                                        children: []
                                    }
                                }
                            ]
                        }
                    },{
                        id: 2,
                        content: 'block-2',
                        group: {
                            level: 1,
                            parent: 2,
                            children: [
                                {
                                    id: 5,
                                    content: 'block-5',
                                    group: {
                                        level: 2,
                                        parent: 5,
                                        children: [
                                            {
                                                id: 7,
                                                content: 'block-7',
                                                group: {
                                                    level: 3,
                                                    parent: 7,
                                                    children: []
                                                }
                                            },{
                                                id: 8,
                                                content: 'block-8',
                                                group: {
                                                    level: 3,
                                                    parent: 8,
                                                    children: []
                                                }
                                            }
                                        ]
                                    }
                                },{
                                    id: 6,
                                    content: 'block-6',
                                    group: {
                                        level: 2,
                                        parent: 6,
                                        children: []
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    };
    console.error(new Date().getTime());
    let htmlArray = [];
    let depth = 0;
    const split = (group,hide) => {
        let htmlStr = '';
        depth = depth > group.level ? depth : group.level;
        htmlStr += `<div data-level="${group.level}" data-block-group="${group.parent}" class="mind-group ${hide? 'mind-group-hide' : ''}">`;
        for(let child of group.children) {
            htmlStr += `<div class="mind-shell">
                <div data-block-id="${child.id}" class="mind-block mind-color-primary">
                    <div class="mind-view">
                        <div class="mind-block-content">${child.content}</div>
                    </div>
                    <div class="mind-edit" contenteditable="true">${child.content}</div>
                    ${group.children.length > 0 ? '<div data-hide="'+group.hide+'" class="mind-block-branch">-</div>' : ''}
                </div>
            </div>`;
            split(child.group,hide);
        }
        htmlStr += `</div>`;
        htmlArray.push(htmlStr);
    };
    const rootSplit = (block) => {
        const root = $('.mind-first');
        root.data('block-id', block.id);
        root.find('.mind-block-content').html(block.content);
        root.find('.mind-edit').html(block.content);
        if(block.group.children.length > 0) root.addClass('mind-block-branch');
    };
    rootSplit(json.blocks);
    split(json.blocks.group, json.blocks.group.hide);
    jsonDepth = depth;
    $('.mind-panel .mind-group').remove();
    $('.mind-panel').append(htmlArray.join(''));
    callback();
    calc(jsonDepth);
};

//溯洄计算并添加高度等属性 - 递归
const calc = (length) => {
    //递归循环group节点
    $('.mind-group[data-level=' + length + ']').each(function () {
        if($(this).children('.mind-shell').length > 0){
            //获取group父级block
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
            //设置父级高度
            if ($(this).data('block-group') !== 0 && parentBlock.outerHeight() < $(this).outerHeight()) parentBlock.parent().css("height", $(this).outerHeight() + "px");
            $(this).data('parent-padding-left',parentBlock.outerWidth() / 2); //传递参数
        }
    });
    length--;
    if (length < 0) {
        draw();
        move(jsonDepth); //todo
    } else {
        calc(length);
    }
};
//移动group节点
const move = (length) => {
    for (let i = 0; i < length; i++) {
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
//绘制svg连线
const draw = () => {
    $('.mind-group').each(function () {
        const [basePointX, basePointY, basePointForWidth] = [0, $(this).outerHeight() / 2, $(this).data('parent-padding-left')];
        let linesStr = '';
        $(this).children('.mind-shell').each(function () {
            const [blockPointX, blockPointY] = [$(this).position().left + $(this).outerWidth() / 2, $(this).position().top + $(this).outerHeight() / 2];
            // linesStr += `<line x1="${basePointX >>> 0}" y1="${basePointY >>> 0}" x2="${blockPointX >>> 0}" y2="${blockPointY >>> 0}" style="stroke:rgb(255,0,0);stroke-width:2"/>`;
            // linesStr += `<path d="M${basePointForWidth} ${basePointY} C${basePointForWidth + 30} ${basePointY},${$(this).position().left - 30} ${blockPointY},${$(this).position().left} ${blockPointY}" fill="none" style="stroke:rgb(255,0,0);stroke-width:2"/>`;
            linesStr += `<path d="M${basePointX} ${basePointY} L${basePointForWidth} ${basePointY} C${basePointForWidth + 35} ${basePointY},${$(this).position().left - 35} ${blockPointY},${$(this).position().left} ${blockPointY} L${blockPointX} ${blockPointY}" fill="none" style="stroke:rgb(255,0,0);stroke-width:2"/>`;
        })
        $(this).children('svg').remove();
        $(this).prepend(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left: 0;top: 0;width: ${$(this).outerWidth()};height: ${$(this).height()};">${linesStr}</svg>`);
    });
    console.error(new Date().getTime());
}
//todo 村入json
const save = () => {

};

//事件 - 编辑
const edit = () => {
    $('.mind-block').off('click');
    $('.mind-block').off('blur');
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
};

//事件 - 拖拽
const drag = () => {
    let dragBlock = null;
    $('.mind-block').off('mousedown');
    $(document).off('mouseup');
    $('.mind-block').on('mousedown',function(ex){
        if($(this).hasClass('mind-first')){

        }else{
            if($(this).hasClass('mind-block-focus') && !$(this).hasClass('mind-edit-active')){
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