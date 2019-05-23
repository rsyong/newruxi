<style>
    .signContact {
        position: fixed;
        width: 100%;
        height: 40px;
        background-color: #1890ff;
        left: 0;
        bottom: 0;
        color: #fff;
        text-align: center;
        line-height: 40px;
    }
    
    #myCanvas {
        width: calc(100% - 40px);
        margin: 0 20px;
        border: 1px solid #6699cc
    }
    
    .signTitle {
        width: 100%;
        font-size: 20px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #999;
    }
</style>
<template>  
	<div style="padding-bottom:50px;">
		<div class="signTitle"><i class="anticon anticon-edit"></i>请在下方区域签上您的姓名</div>
		<div align="center">
			<canvas id="myCanvas"></canvas>

			<div class="control-ops control" style="display:none">

				<button type="button" class="btn btn-primary" onclick="javascript:clearArea();return false;">清空画板</button>

				Line width : <select id="selWidth" onchange="aaa()">

				<option value="1">1</option>

				<option value="3" selected="selected">3</option>

				<option value="5">5</option>

				<option value="7">7</option>

				<option value="9">9</option>

				<option value="11">11</option>

			</select>

				Color : <select id="selColor" onchange="aaa2()">

				<option value="black" selected="selected">black</option>

				<option value="blue">blue</option>

				<option value="red">red</option>

				<option value="green">green</option>

				<option value="yellow">yellow</option>

				<option value="gray">gray</option>

			</select>

				<button type="button" class="saveimg">保存</button>

			</div>

			<div class="saveimgs" style="display:none"></div>

		</div>	
		<div style="text-align: center;">
			<button class="ant-btn ant-btn-primary" style="margin:20px auto 0" @click="empty()"><i class="anticon anticon-delete"></i>清空画板</button>
		</div>	
		<div class="signContact" id="btn">使用签名</div>
		<!--提示-->
		<a-modal title="确认签名" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
		  <p>{{ModalText}}</p>
		</a-modal>
	</div> 	
</template>

<script>
    import qs from 'Qs'
    export default {
        name: 'index',
        data() {
            return {
                ModalText: '是否确认使用该签名签署合同？',
                visible: false,
                confirmLoading: false,
                image: [],
                meyaId: [], //合同ID
            }
        },
        created: function() {
            document.title = '签署合同';
        },
        mounted() {
            this.meyaId = this.$route.query.id;
            console.log(this.$route.query.id);
            var that = this;
            var mousePressed = false;
            var lastX, lastY;
            var ctx = document.getElementById('myCanvas').getContext("2d");
            var c = document.getElementById("myCanvas");
            var control = document.getElementsByClassName("control")[0];
            var saveimgs = document.getElementsByClassName("saveimgs")[0];
            InitThis();

            function saveImageInfo() {
                var image = c.toDataURL("image/png");
                var ctximg = document.createElement("span");
                ctximg.innerHTML = "<img src='" + image + "'/>";
                if (saveimgs.getElementsByTagName('span').length >= 1) {
                    var span_old = saveimgs.getElementsByTagName("span")[0];
                    saveimgs.replaceChild(ctximg, span_old);
                } else {
                    saveimgs.appendChild(ctximg);
                }
                //使用前面image
                var num = document.getElementById('btn').getAttribute('p-num');
                console.log(num)
                if (num == 1) {
                    console.log(image);
                    that.showModal();
                    that.image = image;
                } else {
                    that.$message.error('请输入有效签名！');
                }
            }
            var selected1, selected2;

            function aaa() {
                var sel = document.getElementById('selWidth');
                var value = sel.selectedIndex;
                return selected1 = sel[value].value;
            }

            function aaa2() {
                var sel2 = document.getElementById('selColor');
                var value = sel2.selectedIndex;
                return selected2 = sel2[value].value;

            }

            function InitThis() {
                c.addEventListener('touchstart', function(event) {
                    document.getElementById('btn').setAttribute('p-num', 1);
                    if (event.targetTouches.length == 1) {
                        event.preventDefault(); // 阻止浏览器默认事件，重要
                        var touch = event.targetTouches[0];
                        mousePressed = true;
                        Draw(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, false);
                    }
                }, false);
                c.addEventListener('touchmove', function(event) {
                    if (event.targetTouches.length == 1) {
                        event.preventDefault(); // 阻止浏览器默认事件，重要
                        var touch = event.targetTouches[0];
                        if (mousePressed) {
                            Draw(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop, true);
                        }
                    }
                }, false);
                c.addEventListener('touchend', function(event) {
                    if (event.targetTouches.length == 1) {
                        event.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
                        //      			var touch = event.targetTouches[0];
                        mousePressed = false;
                    }
                }, false);
                c.onmousedown = function(event) {
                    mousePressed = true;
                    Draw(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, false);
                };
                c.onmousemove = function(event) {
                    if (mousePressed) {
                        Draw(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, true);
                    }
                };
                c.onmouseup = function(event) {
                    mousePressed = false;
                };
            }

            function Draw(x, y, isDown) {
                if (isDown) {
                    ctx.beginPath();
                    ctx.strokeStyle = selected2;
                    ctx.lineWidth = selected1;
                    ctx.lineJoin = "round";
                    ctx.moveTo(lastX, lastY);
                    ctx.lineTo(x, y);
                    ctx.closePath();
                    ctx.stroke();
                }
                lastX = x;
                lastY = y;
            }

            function writeObj(obj) {
                var description = "";
                for (var i in obj) {
                    var property = obj[i];
                    description += "<b>" + i + "</b>=" + property + "<br>";
                }
                return description;
            }

            function clearArea() {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (saveimgs.getElementsByTagName('span').length >= 1) {
                    var clearImg = saveimgs.getElementsByTagName('span')[0];
                    saveimgs.removeChild(clearImg);
                }
            }
            // 获取文本框
            var inp = document.getElementById('btn');
            // 绑定事件
            inp.onclick = function() {
                saveImageInfo();
            }

        },
        methods: {
            //合同
            setName() {
                const http2 = this.HOST + '/index.php/Home/Wx/meiya_creat_signature';
                var that = this;
                console.log(that.image, 666666)
                this.$axios.post(http2, qs.stringify({
                    id: that.meyaId,
                    card: '350204197910304010',
                    name: '82',
                    base64: that.image.split(",")[1]
                })).then(function(res) {
                    that.$message.info(res.data.msg);
                }).catch(function(error) {});

            },
            empty() {
                var ctx = document.getElementById('myCanvas').getContext("2d");
                var saveimgs = document.getElementsByClassName("saveimgs")[0];
                // Use the identity matrix while clearing the canvas
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (saveimgs.getElementsByTagName('span').length >= 1) {
                    var clearImg = saveimgs.getElementsByTagName('span')[0];
                    saveimgs.removeChild(clearImg);
                }
                document.getElementById('btn').setAttribute('p-num', 0);
            },
            //提示
            showModal() {
                this.visible = true
            },
            handleOk(e) {
                //this.ModalText = '是否确认使用该签名签署合同？';
                this.confirmLoading = true;
                //关闭
                this.visible = false;
                this.confirmLoading = false;
                this.setName();
            },
            handleCancel(e) {
                console.log('Clicked cancel button');
                this.visible = false
            }
        }
    }
</script>


// WEBPACK FOOTER // // src/pages/signContact/Index.vue