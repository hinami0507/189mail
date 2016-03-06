


var list = [{
    height: 640,
    width: 1136,
    img: "./img/BG.png"
}, {
    height: 640,
    width: 1136,
    img: "./img/2.png"
}, {
    height: 640,
    width: 1136,
    img: "./img/3.png"
}, {
    height: 640,
    width: 1136,
    img: "./img/4.png"
}, {
    height: 640,
    width: 1136,
    img: "./img/5.png"
}];
//构造函数
function Slider(opts) {
    //构造函数需要的参数
    this.wrap = opts.dom;
    this.list = opts.list;
    //构造三步奏
    this.init();
    this.renderDOM();
    this.bindDOM();
}

//第一步 -- 初始化
Slider.prototype.init = function() {
    //设定窗口比率
    this.radio = window.innerHeight / window.innerWidth;
    //设定一页的宽度
    this.scaleH = window.innerHeight;
    //设定初始的索引值
    this.idx = 0;
};

//第二步 -- 根据数据渲染DOM
Slider.prototype.renderDOM = function() {
    var wrap = this.wrap;
    var data = this.list;
    var len = data.length;

    this.outer = document.createElement('ul');
    this.outer.setAttribute("id", "gal")
        //创建导航
    this.nav = document.createElement('ul');
    this.nav.setAttribute("id", "nav");

    //根据元素的
    for (var i = 0; i < len; i++) {
        //设置索引灯的索引
        var navli = document.createElement('li');
        navli.setAttribute("navIdx", i);

        var li = document.createElement('li');

        var item = data[i];
        li.style.height = window.innerHeight + 'px';
        li.style.webkitTransform = 'translate3d(0,' + i * this.scaleH + 'px, 0)';

        if (item) {
            //根据窗口的比例与图片的比例来确定
            //图片是根据宽度来等比缩放还是根据高度来等比缩放
            //在第一第五页加上button
            //渲染head
            if (i == 0) {
                li.setAttribute("id", "galfirst");
                li.innerHTML += '<img id="galr" src="./img/pic_1.png" class="mainhead"  style="margin-top:' + window.innerHeight * 0.0567 + 'px"/>';
                li.innerHTML += '<button class="download" style="margin-top:' + window.innerHeight * 0.3112 + 'px"><img src="./img/button.png"/></button>';
            }
            if (i == 4) {
                li.innerHTML += '<button class="download" style="margin-top:' + window.innerHeight * 0.4824 + 'px"><img src="./img/button.png"/></button>';
            }
            //==============
            if (i != 0) {
                if (item['height'] / item['width'] > this.radio) {
                    li.innerHTML += '<img height="' + window.innerHeight + '" src="' + item['img'] + '">';
                } else {
                    li.innerHTML += '<img width="' + window.innerHeight * 0.561 + '" src="' + item['img'] + '">';
                }
            } else {

                if (item['height'] / item['width'] > this.radio) {
                    li.innerHTML += '<img height="' + window.innerHeight + '" src="' + item['img'] + '">';
                } else {
                    li.innerHTML += '<img width="' + window.innerWidth + '" src="' + item['img'] + '">';
                }
            }
        }

        this.outer.appendChild(li);
        this.nav.appendChild(navli);

    }

    //UL的宽度和画布宽度一致
    this.outer.style.cssText = 'height:' + this.scaleH + 'px';
    wrap.style.height = window.innerHeight + 'px';
    wrap.appendChild(this.outer);
    wrap.appendChild(this.nav);


};

Slider.prototype.goIndex = function(n) {
    var idx = this.idx; //当前索引
    var lis = this.outer.getElementsByTagName('li');
    var len = lis.length;
    var cidx;
    var Nav = document.getElementById("nav");
    var arrow = document.getElementById('downarrow').getElementsByTagName('img')[0];

    //如果传数字 2,3 之类可以使得直接滑动到该索引
    if (typeof n == 'number') {
        cidx = n;
        //如果是传字符则为索引的变化
    } else if (typeof n == 'string') {
        cidx = idx + n * 1;
    }

    //当索引右超出
    if (cidx > len - 1) {
        cidx = len - 1;
        //当索引左超出    
    } else if (cidx < 0) {
        cidx = 0;
    }

    //熄灭之前的索引灯
    Nav.childNodes[idx].style.background = "none";
    //保留当前索引值
    this.idx = cidx;
    //点亮当前的索引灯
    Nav.childNodes[cidx].style.background = "#C9C9C9";

    if (cidx > len - 2) {
        arrow.style.display = "none";
    } else {
        arrow.style.display = "block";
    }

    //改变过渡的方式，从无动画变为有动画
    lis[cidx].style.webkitTransition = '-webkit-transform 0.7s ease-out';
    lis[cidx - 1] && (lis[cidx - 1].style.webkitTransition = '-webkit-transform 0.7s ease-in');
    for (nex = cidx; nex < len; nex++)
        lis[nex + 1] && (lis[nex + 1].style.webkitTransition = '-webkit-transform 0.6s ease-in');

    //改变动画后所应该的位移值
    lis[cidx].style.webkitTransform = 'translate3d(0, 0, 0)';
    lis[cidx - 1] && (lis[cidx - 1].style.webkitTransform = 'translate3d(0,-' + this.scaleH + 'px,  0)');
    for (nex = cidx; nex < len; nex++)
        lis[nex + 1] && (lis[nex + 1].style.webkitTransform = 'translate3d(0,' + this.scaleH + 'px,  0)');

};

//第三步 -- 绑定 DOM 事件
Slider.prototype.bindDOM = function() {
    var self = this;
    var scaleH = self.scaleH;
    var outer = self.outer;
    var len = self.list.length;
    var Nav = document.getElementById("nav");
    Nav.firstChild.style.background = "#C9C9C9";
    var arrowbox =document.getElementById('downarrow')

    //手指按下的处理事件
    var startHandler = function(evt) {

        //记录刚刚开始按下的时间
        self.startTime = new Date() * 1;

        //记录手指按下的坐标
        self.startY = evt.touches[0].pageY;

        //清除偏移量
        self.offsetY = 0;

        //事件对象
        var target = evt.target;
        while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
            target = target.parentNode;
        }
        self.target = target;

    };

    //手指移动的处理事件
    var moveHandler = function(evt) {
        //兼容chrome android，阻止浏览器默认行为
        evt.preventDefault();

        //计算手指的偏移量
        self.offsetY = evt.targetTouches[0].pageY - self.startY;

        var lis = outer.getElementsByTagName('li');
        //起始索引
        var i = self.idx - 1;
        //结束索引
        var m = i + 3;

        //最小化改变DOM属性
        for (i; i < m; i++) {
            lis[i] && (lis[i].style.webkitTransition = '-webkit-transform 0.3s ease-in');
            lis[i] && (lis[i].style.webkitTransform = 'translate3d(0,' + ((i - self.idx) * self.scaleH + self.offsetY) + 'px, 0)');

        }
    };

    //手指抬起的处理事件
    var endHandler = function(evt) {
        evt.preventDefault();

        //边界就翻页值
        var boundary = scaleH / 6;

        //手指抬起的时间值
        var endTime = new Date() * 1;

        //所有列表项
        var lis = outer.getElementsByTagName('li');

        //当手指移动时间超过300ms 的时候，按位移算
        if (endTime - self.startTime > 300) {
            if (self.offsetY >= boundary) {
                self.goIndex('-1');
            } else if (self.offsetY < 0 && self.offsetY < -boundary) {
                self.goIndex('+1');
            } else {
                self.goIndex('0');
            }
        } else {
            //优化
            //快速移动也能使得翻页
            if (self.offsetY > 50) {
                self.goIndex('-1');
            } else if (self.offsetY < -50) {
                self.goIndex('+1');
            } else {
                self.goIndex('0');
            }
        }
    };
    var clickNav = function(evt) {
            if (evt.target.attributes["navIdx"]) {
                var tar = evt.target.attributes["navIdx"].nodeValue * 1;
                self.goIndex(tar);
            }
        }


    function handleMouseWheel(event) {
        var delta= event.wheelDelta;
        if(event.wheelDelta>0)
            {self.goIndex('-1');}
        else if(event.wheelDelta<0)
            {self.goIndex('+1');}
    }

    function clickdownarrow(){
        self.goIndex('+1');
    }

    
    document.addEventListener("mousewheel", handleMouseWheel);
    document.addEventListener("DOMMouseScroll", handleMouseWheel);
        //绑定事件
    outer.addEventListener('touchstart', startHandler);
    outer.addEventListener('touchmove', moveHandler);
    outer.addEventListener('touchend', endHandler);
    Nav.addEventListener('click', clickNav);
    arrowbox.addEventListener("click",clickdownarrow)
};

//初始化Slider实例
new Slider({
    dom: document.getElementById('canvas'),
    list: list
});


var navli = document.getElementById('nav');
var len = navli.children.length;
for (var i = 0; i < len; i++) {
    navli.children[i].style.height = navli.children[i].scrollWidth + 'px';
}
var gal = document.getElementById("gal");
gal.style.width = gal.offsetHeight * 0.561 + 'px';
var galr = document.getElementById("galr");
galr.style.width = gal.offsetHeight * 0.561 + 'px';

var canvas = document.getElementById("canvas");
var canWidth = canvas.offsetWidth;
var canHeight = canvas.offsetHeight;

galr.style.left = (canWidth - galr.offsetWidth) * 0.5 + 'px';
var galfirst = document.getElementById("galfirst");
galfirst.style.width = canWidth + 'px';

var download = document.getElementsByClassName('download');
var downlen = download.length;
for (var d = 0; d < downlen; d++) {
    download[d].style.height = canHeight * 0.0576 + 'px';
    download[d].style.width = canHeight * 0.2111 + 'px';
    download[d].style.left = (canWidth - download[d].offsetWidth) * 0.5 + 'px';
}








