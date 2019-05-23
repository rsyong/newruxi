<style>
.memberTop{
	width:100%;
	height:80px;
	background-color:#ccc;
	position: relative;
	z-index:1;
}
.memberTop .topTitle{
	width:300px;
	height:80px;
	background-color:#fff;	
	position:absolute;
	z-index:2;
	top:40px;
	left:50%;
	margin-left:-150px;
	padding:10px 25px;
}
.memberTop .topTitle h1{
	font-size:18px;
	font-weight:bold;
}
.memberSearch{
	width:300px;
	margin:50px auto 0;
	height:35px;	
}
.memberSearch .ant-input-lg{
	font-size:12px;
}
.memberList{
 	width:300px;
	margin:0 auto;
}
.memberList ul{
	width: 100%;	
}
.memberList ul li{
	width:100%;	
	margin-top:20px;
}
.memberList ul li h1{
	width:100%;
	border-bottom:1px solid #d9d9d9;
	font-size:14px;
	padding:10px 25px;
	margin-bottom:0;
}
.memberList ul li span{
	float:right;
}
.memberList ul li ul{
	width:100%;	
}
.memberList ul li ul li{
	width:100%;
	padding:0 25px;
	display:table;
	padding:10px 5px;
	margin-top:0;
}
.memberList ul li ul li p{
	float: left;
	margin-bottom:0;
	color:#999;	
	line-height:30px;
	width:200px;
}
.memberList ul li ul li .ant-btn{
	font-size:12px;
	height:30px;
	color:#333;	
}
.memberList ul li ul li .spanSize{	
	text-align: center;
	width:80px;
}
.memberList ul li ul li a{
	font-size:12px;
	height:30px;
	color:#999999;	
	line-height:30px;
}
.memberList ul li ul li a:active{
	color:#40a9ff;
}
</style>
<template>  
  <div style="width:100%;height:100%">
  	<div class="memberTop" v-show="isShow">
		<div class="topTitle ant-popover-inner">
			<h1>{{userTop}}</h1>
			<p>{{userName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{userPhone}}</p>
		</div>		
	</div>
	<!--查询-->
	<div class="memberSearch">
		<a-input-search placeholder="你可以输入手机号/身份证/姓名进项查询" @search="onSearch" enterButton="查询" size="large"/>
	</div>
	<!--合同列表-->
	<div class="memberList">
		<ul>
			<li class="ant-popover-inner" v-for="(list,index) in contactList" :key="index">
				<h1>{{list.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{list.phone}}
					<span v-if="list.sign === '0'" style="color:#ff0000">未签署</span>
					<span v-if="list.sign === '1'" style="color:#0066cc">进行中</span>
					<span v-if="list.sign === '2'" style="color:#008000">已签署</span>
				</h1>
				<ul>
					<!--<li v-for="contact in list.contact">
						<p>{{contact.name}}</p>
						<span class="spanSize">
							<a-button v-if="contact.contactType === '0'" p-id="2" @click="htmlContact">签署合同</a-button>
							<a v-if="contact.contactType === '1'" p-id="2" @click="htmlContact">查看合同</a>
						</span>
					</li>-->
					<li>
						<p>美亚合同</p>
						<span class="spanSize">
							<a-button v-if="list.id > '0'" :p-id="list.employeeid" @click="htmlContact(1,list.id)">签署合同</a-button>
							<a v-if="list.id < '1'" :p-id="list.employeeid" @click="htmlContact(2,list.employeeid)">查看合同</a>
						</span>
					</li>
					<li>
						<p>职乐合同</p>
						<span class="spanSize">						
							<a @click="htmlContact(2,list.employeeid)">查看合同</a>
						</span>
					</li>
				</ul>
			</li>			
		</ul>
	</div>
	<!--加载动画-->
	<div class="infinite-scroll" v-show="loading" style="text-align: center;margin:20px auto">
		<a-spin :tip="(tips)"></a-spin>  
    </div>
  </div>
</template>

<script>
export default {  
  name: 'member', 
  data: function () {
	 return {
	   isShow:true,//用于显示头部
	   userTop:[],
	   userName:[],
	   userPhone:[],
	   //获取合同列表
	   contactList:[],
	   //底部加载数据
	   REQUIRE: true,
	   loading: false,
       tips: '往下拉加载更多...',
	   id:[],//用户ID
	   openId:[],//用户的微信openId
	   gid:[],//用户组ID	
	}
  },
  created:function(){
  	//页面加载开始
	  document.title='成员列表';	 
	  //获取用户opneId用以获取userId
			function getCookie(name) {			
		   var cookies = document.cookie.split(";");
		   for(var i=0;i<cookies.length;i++) {
			var cookie = cookies[i];
			var cookieStr = cookie.split("=");
			if(cookieStr && cookieStr[0].trim()==name) {
			 return  unescape(cookieStr[1]);
			}
		   }		  
 		}
		 //进行请求，获取用户的id		  
	 	var useInfo=JSON.parse(getCookie('user_info'));		
		this.openId=useInfo.openid;  
		//获取用户id,已经数据
		const http =  this.HOST + '/index.php/Home/Wx/user_info?openid='+useInfo.openid;
		var that = this;
		this.$axios.get(http,{
		}).then(function (res) {			
			if(res.data.data.code == 0){				
				that.id = res.data.data.id;
				that.gid = res.data.data.gid;				
	   			that.userName = res.data.data.name;
	   			that.userPhone = res.data.data.tel;
				that.getGroup(res.data.data.gid);
			}else{
				that.$message.info(res.data.data.msg);
			}

		}).catch(function (error) {

		});
  },
  mounted:function(){
  			//挂载结束状态
			//window.addEventListener('scroll', this.scrollBottom);
			
        },
  methods: { 
  	//获取组列表数据
	   getGroup(gid){
		const http =  this.HOST + '/index.php/Home/Wx/group_list?gid='+gid+'&openid='+this.openId;
		var that = this;
		this.$axios.get(http,{
		}).then(function (res) {
			that.userTop = res.data.groupname;
			if(res.data.code == 0){
				that.userTop = res.data.groupname;
				//插入数据	
				that.contactList = res.data.data;				;
			}else{
				that.$message.info(res.data.msg);
			}

		}).catch(function (error) {

		});
	},
  	//查询
	onSearch (value) {
      console.log(value);
	  var that = this;
	  //const http =  this.HOST + '/user/simple/add.htm';
	  const http = this.HOST + '/index.php/Home/Wx/check_code';
				this.$axios.post(http,{
					email: 52,
					nickName: 21,
					age: 1
				}).then(function (res) {
					that.scanwifiName = res.data.userId;
					//console.log(that.scanwifiName);
				}).catch(function (error) {

				});
    },
  	//查看，签署合同
	htmlContact(index,id){
		if(index==1){
			this.$router.push({name:'contact',query:{id:id}})
		}else{
			// const http =  this.HOST + '/index.php/Home/Wx/Gzlle_sign_link';
			// var that = this;
			// this.$axios.get(http,{
			// 	employeeId:id
			// }).then(function (res) {			
				
			// }).catch(function (error) {

			// });
			location.href=`${this.HOST}/index.php/Home/Wx/Gzlle_sign_link?employeeId=${id}`
			
		}
		// const id = e.target.getAttribute('p-id');		
		
	},
	//触底加载
	 scrollBottom() {	 
        // 滚动到页面底部时，请求数据		
        if (((window.screen.height + document.body.scrollTop) > (document.body.clientHeight)) || ((window.screen.height + document.body.scrollTop) == (document.body.clientHeight))&& this.REQUIRE) {		
          // 获取数据
          this.REQUIRE = false;
          this.loading = true;
          this.tips = '正在加载中...';
		  //执行请求
		  const http =  this.HOST + '/index.php/Home/Wx/group_list?gid='+this.gid+'&openid='+this.openId;
			var that = this;
		  this.$axios.get(http,{
		}).then(function (res) {
					for(var i=0;i<res.data.data.length;i++){
							that.contactList.push(res.data.data[i]);
						}						
						that.REQUIRE = true;
            			that.loading = false;
				}).catch(function (error) {
					that.REQUIRE = true;
            		that.loading = false;
				});
        }
      },
	
  }
  
}
</script>


// WEBPACK FOOTER //
// src/pages/member/Member.vue