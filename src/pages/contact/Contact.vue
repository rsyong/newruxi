<style>
.signContact{
	position: fixed;
	width:100%;
	height:40px;
	background-color:#1890ff;
	left:0;
	bottom:0;
	color:#fff;
	text-align: center;
	line-height:40px;
}
</style>
<template>  
	<div style="padding-bottom:50px;">
		<div id="canvs"  style="margin:0px auto">
			<canvas id="the-canvas" ></canvas>	
			<div style="width:100%;text-align: center;">
				<a-button-group>
				  <a-button type="primary" id="up" style="float:left">
					<a-icon type="left" />上一页
				  </a-button>
				  <span style="line-height:32px;margin:0 40px;"> <span id="page_num"></span> / <span id="page_count"></span></span>
				  <a-button type="primary" id="down" style="float:right">
					下一页<a-icon type="right" />
				  </a-button>
				</a-button-group>				
				
			</div>
		</div>
		<div class="signContact" @click="sign">签署合同</div>	
	</div>  
</template>

<script>
import '../../../static/pdf/jquery.min.js';
import '../../../static/pdf/pdf.js';
export default {
  name: 'contact',
 data () {
    return {
		url:[],//合同路径	
		meyaId:[],//合同ID
		
     
    }
  },
  created:function(){	 
	  document.title='登录';	
	  const id=this.$route.query.id;
	  this.meyaId=this.$route.query.id;
	  if(id == 'ruxi'){
	  	//入戏合同
	  }else{
	  	//美亚合同
		const http =  this.HOST + '/index.php/Home/Wx/meiya_getcontract?id='+id;
		var that = this;
		this.$axios.get(http,{
		}).then(function (res) {			
			if(res.data.code == 0){				
				that.url = res.data.src;				
			}else{
				that.$message.info(res.data.msg);
			}

		}).catch(function (error) {

		});
	  }
  },
   mounted:function(){
			 console.log(this.url)
			 this.meyaId=this.$route.query.id;
   		//合同
   		//$(".ewb-details-bd").css("width","400px");
		$("#the-canvas").css("width","100%");  		
		var url = 'http://no1.ybinu.cn/ruxi/test.pdf';//展示的pdf路径
		//var url = this.url;//展示的pdf路径
		PDFJS.workerSrc = '../../../static/pdf/pdf.worker.js';
		var pdfDoc = null,
			pageNum = 1,//页码
			pageRendering = false,//据我观察，是用来应对一时间多次点击下一页按钮的情况的,你可以试试。
			pageNumPending = null,//取得最新的页码
			scale = 2.5,//缩放倍数
			canvas = document.getElementById('the-canvas'),
			ctx = canvas.getContext('2d');
		    PDFJS.getDocument(url).then(function(pdfDoc_) {
		    pdfDoc = pdfDoc_;
		    document.getElementById('page_count').textContent = pdfDoc.numPages;			
		    renderPage(pageNum);			 
		});
		
		function renderPage(num) {
		  pageRendering = true;
		  pdfDoc.getPage(num).then(function(page) {
			var viewport = page.getViewport(scale);
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			var renderContext = {
			  canvasContext: ctx,
			  viewport: viewport
			};
			var renderTask = page.render(renderContext);

			renderTask.promise.then(function() {
			  pageRendering = false;
			  if (pageNumPending !== null) {
				renderPage(pageNumPending);
				pageNumPending = null;
			  }
			});
		  });
		  document.getElementById('page_num').textContent = num;
		}
		function queueRenderPage(num) {
		  if (pageRendering) {
			pageNumPending = num;
		  } else {
			renderPage(num);
		  }
		}
	
        var inp = document.getElementById('up');
        // 绑定事件
        inp.onclick = function(){
             onPrevPage()        
        }
		/**
		 *上一页
		 */
		function onPrevPage() {		
		  if (pageNum <= 1) {
			return;
		  }
		  pageNum--;
		  queueRenderPage(pageNum);
		}
		var inp2 = document.getElementById('down');
        // 绑定事件
        inp2.onclick = function(){
            onNextPage();        
        }

		/**
		 *下一页
		 */
		function onNextPage() {
		  if (pageNum >= pdfDoc.numPages) {
			return;
		  }
		  pageNum++;
		  queueRenderPage(pageNum);
		}

	},
	methods: {	
		//跳转签署合同页面
		sign () {		
			this.$router.push({name:'signContact',query:{id:this.meyaId}})
		}		
	}
}
</script>


// WEBPACK FOOTER //
// src/pages/contact/Contact.vue