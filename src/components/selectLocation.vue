<template>
    <list class="location"><!-- @scroll="scrollContent" ref="locationWrapper"-->
        <cell>
            <!--头部-->
            <div class="title">
                <div class="back" @click="selectLocationPop">
                    <text :style="{fontFamily:'detail',fontSize:'32px',color:'#333'}">回</text>
                </div>
                <div class="wrapper">
                    <text class="title-name">选择地区</text>
                </div>
            </div>

            <!--地区搜索-->
            <div :class="['search-location',searching?'searching':'']">
                <div class="search-box">
                    <div class="search-icon">
                        <text :style="{fontFamily:'detail',color:'#d8d8d8'}" class="search-icon-text">&#xe60c;</text>
                    </div>
                    <input type="text" class="search-text" @input="searchLocation" @focus="onSearchFocus" ref="searchBox"/>
                </div>
                <div class="cancel-search" v-if="searching" @click="cancelSearch">
                    <text class="cancel-search-text">取消</text>
                </div>
            </div>
            <!--定位/常用地区-->
            <div v-if="!searching" class="content">
                <div class="hot-location">
                    <div class="hot-title">
                        <text class="hot-title-text">定位/常用</text>
                    </div>
                    <div class="hot-content">
                        <div v-for="(ele,index) in hotLocation" class="hot-location-list" @click="shortcutSelectLocation(ele)">
                            <text class="hot-location-text">{{ele.cityName}}</text>
                        </div>
                    </div>
                </div>
                <div v-for="(ele,index) in locationData.list">
                    <div class="list-title" :ref="'indexNav' + index">
                        <text class="list-title-text">{{locationData.indexNav[index]}}</text>
                    </div>
                    <div class="location-list">
                        <div v-for="res in ele" class="location-model" @click="selectProvince(res.F_ProvinceName,res.F_ProvinceId)">
                            <text :class="[res.F_ProvinceName==locationInfo.provinceName?'result-list-text-visible':'']">{{res.F_ProvinceName}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <!--搜索结果列表-->
            <list v-else class="search-result">
                <cell>
                    <div class="search-result-wrapper">
                        <div v-for="ele in searchResult" class="result-list"  @click="shortcutSelectLocation(ele)">
                            <text class="result-list-text">{{ele.cityName}}</text>
                        </div>
                    </div>
                </cell>
            </list>
            <!--索引导航-->
            <div v-if="!searching" class="location-nav">
                <div v-for="(ele,index) in locationData.indexNav" class="index-nav" @click="anchor(index)">
                    <text :class="['index-nav-text',indexNav == ele?'index-nav-visible':'']">{{ele}}</text>
                </div>
            </div>
            <!--侧边栏内容-->
            <list class="sidebar-content" style="flex: 1" ref="side">
                <cell class="sidebar-header" v-if="showSidebar">
                    <div class="back" @click="sidebarHide">
                        <text class="back-text">关闭</text>
                    </div>
                    <text class="sidebar-header-text">{{locationInfo.provinceName}}</text>
                </cell>
                <cell v-if="sidebarContent.length > 0" v-for="(data,index) in sidebarContent" class="sidebar-module" @click="selectCity(data.F_CityName,data.F_Id)">
                    <div class="city-name">
                        <text :class="['city-name-text',locationInfo.cityName==data.F_CityName?'city-name-text-visible':'']">{{data.F_CityName}}</text>
                    </div>
                </cell>
                <cell v-if="sidebarContent.length == 0" class="empty-history">
                    <text :style="{fontFamily:'detail',fontSize:'100px',color:'#a1c6f5'}">&#x65e0;</text>
                    <text class="empty-history-text">很遗憾~ 没有相关内容~</text>
                </cell>
            </list>
        </cell>
    </list>
</template>

<script type="text/babel">
    let modal = weex.requireModule('modal');
    let dom = weex.requireModule('dom');
    let stream = weex.requireModule('stream');
    let animation = weex.requireModule('animation');
    let storage = weex.requireModule('storage');
    export default {
        props:['locationData'],
        data(){
            return {
                //是否搜索中
                searching:false,
                //常用地区列表
                hotLocation:[],
                //已经选中的nav导航
                indexNav:'',
                //搜索列表结果
                searchResult:[],
                //搜索结果列表的高度
                searchResultHeight:'',
                //sidebar显示与隐藏
                showSidebar: false,
                //sidebar侧边栏内容
                sidebarContent:[],
                //空列表
                emptyList:false,
                locationInfo:{
                    provinceName:'',
                    provinceId:'',
                    cityName:'',
                    cityId:'',
                },

            }
        },
        methods:{
            //滚动取消选择城市选择框
//            scrollContent(){
//                let locationWrapper = this.$refs.locationWrapper;
//                this.alert(locationWrapper.scrollTop.reachTop)
////                this.alert(1)
//            },
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            //关闭选地区弹层
            selectLocationPop(){
                this.$emit('selectLocationPop')
            },
            //搜索输入框获取焦点
            onSearchFocus(){
                this.searching  =  true;
            },
            //点击取消搜索
            cancelSearch(){
                let searchBox = this.$refs.searchBox;
                searchBox.blur();
                this.searching = false;
            },
            //点击城市索引导航
            anchor(index){
                this.indexNav = this.locationData.indexNav[index];
                dom.scrollToElement(this.$refs['indexNav' + index][0], {offset: 0})
            },
            //输入框搜索
            searchLocation(event){
                this.getData('/index.php?r=app/series/get-search-province&value=' + event.value,(ele) => {
                    if(ele.ok && ele.data.info == 'ok'){
                        this.searchResult = ele.data.data;
//                        ele.data.data.forEach((res,index) => {
//                            this.$set(this.searchResult,index,ele.data.data[index]);
//                        })
//
                    }
                })
            },
            //发送请求
            getData(repo,callback){
                return stream.fetch({
                    method:'GET',
                    type:'json',
                    url:'http://product-yufabu.m.360che.com' + repo,
                },callback)
            },
            //点击定位 常用地区列表
            shortcutSelectLocation(ele){
                console.log(ele)
                this.locationInfo = ele;
                //将已选择城市数据传递给父元素
                this.getLocationInfo();
                //关闭选地区弹层
                this.selectLocationPop();
            },
            //选择省份
            selectProvince(provinceName,provinceId){
                //显示侧边栏
                this.showSidebar = true;
                //设置当前选择省份数据
                this.locationInfo.provinceName = provinceName;
                this.locationInfo.provinceId = provinceId;
                this.locationInfo.cityName = '';
                this.locationInfo.cityId = '';

                //弹出侧边栏动画
                var side = this.$refs.side;
                animation.transition(side, {
                    styles: {
                        transform: 'translate(0,0)'
                    },
                    duration: 300, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                });

                //请求城市数据
                this.getData('/index.php?r=app/series/city-list&provinceId=' + provinceId,(ele) => {
                   if(ele.ok && ele.data && ele.data.status == 1){
                       this.sidebarContent = ele.data.data;
                   }else{
                       this.sidebarContent = [];
                   }
                });
                //将已选择城市数据传递给父元素
                this.getLocationInfo();
            },
            //选择城市
            selectCity(cityName,cityId){
                console.log(cityId)
                //设置当前选择城市数据
                this.locationInfo.provinceName = this.locationInfo.provinceName;
                this.locationInfo.provinceId = this.locationInfo.provinceId;
                this.locationInfo.cityName = cityName;
                this.locationInfo.cityId = cityId;
                //关闭sidebar
                this.sidebarHide();

                //将已选择城市数据传递给父元素
                this.getLocationInfo();

                //关闭选地区弹层
                this.selectLocationPop();

                //保存已选择城市信息

                //保存常用地理位置
                storage.getItem('hotLocation',(ele) => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        let ishave = true;
                        data.forEach((res,index) => {
                            if(res.cityName == cityName && ishave){
                                ishave = false;
                            }
                        });
                        if(ishave){
                            if(data.length > 5){
                                data.splice(1,1)
                            }
                            data.push(this.locationInfo);

                            storage.setItem('hotLocation',JSON.stringify(data))
                        }
                    }else{
                       let hotLocation = [];
                        hotLocation.push(this.locationInfo);
                        storage.setItem('hotLocation',JSON.stringify(hotLocation))
                    }
                })
            },
            //隐藏sidebar
            sidebarHide(){
                var side = this.$refs.side;
                animation.transition(side, {
                    styles: {
                        transform: 'translate(750px,0)'
                    },
                    duration: 300, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                })
            },
            //发送以选择城市信息
            getLocationInfo(){
                this.$emit('getLocationInfo',this.locationInfo);
            }
        },
        created(){
            //获取常用地区列表
            storage.getItem('hotLocation',(ele) => {
                if(ele.result == 'success'){
                    this.hotLocation = JSON.parse(ele.data)
                }
            })
        },
        components:{

        }
    }
</script>

<style scoped>
    .location{
        flex: 1;
        position:fixed;
        top:0;
        right:0;
        bottom:0;
        left:0;
        background-color:#fff;
    }
    .title{
        position:relative;
        width:750px;
        height: 90px;
        justify-content: center;
        align-items: center;
        padding-left:120px;
        padding-right:120px;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
        background-color: #fff;
    }
    .wrapper{
        flex: 1;
        height:90px;
        justify-content: center;
        align-items:center;
    }
    .title-name{
        padding-left:20px;
        padding-right:20px;
        color:#333;
        font-size:36px;
    }
    .back{
        position:absolute;
        left:0;
        top:0;
        width:54px;
        height:90px;
        justify-content: center;
        align-items: center;
    }
    .search-location{
        position:relative;
        flex-direction: row;
        padding-top:20px;
        padding-right:30px;
        padding-left:30px;
        background-color:#f5f5f5;
    }
    .searching{
        padding-right:110px;
    }
    .search-box{
        flex: 1;
        flex-direction: row;
        align-items:center;
        justify-content:flex-start;
        background-color:#fff;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#eee;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#eee;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    .search-icon{
        width:70px;
        align-items: center;
        justify-content:center;
    }
    .search-text{
        flex: 1;
        height:70px;
        padding-top:20px;
        padding-bottom:20px;
        background-color:rgba(0,0,0,0);
        border-top-width:0;
        border-right-width:0;
        border-bottom-width:0;
        border-left-width:0;
    }
    .cancel-search{
        position:absolute;
        top:20px;
        right:0;
        width:110px;
        height:70px;
        align-items: center;
        justify-content: center;
    }
    .cancel-search-text{
        color:#999;
        font-size:28px;
    }
    /*.content{*/
        /*flex: 1;*/
    /*}*/
    .search-result{
        position:fixed;
        left:0;
        right:0;
        top:183px;
        bottom:0;
    }
    .search-result-wrapper{
        padding-left:30px;
        padding-right:30px;
    }
    .result-list{
        height:90px;
        align-items: flex-start;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
    }
    .result-list-text{
        color:#333;
        font-size:32px;
    }
    .result-list-text-visible{
        color:#f60;
    }
    .hot-title{
        height:60px;
        padding-left:30px;
        align-items: flex-start;
        justify-content: center;
        background-color:#f5f5f5;
    }
    .hot-title-text{
        color:#999;
        font-size: 24px;
    }
    .hot-content{
        flex-direction: row;
        flex-wrap:wrap;
        padding-top:20px;
        padding-right:20px;
        padding-bottom:20px;
        padding-left:20px;
    }
    .hot-location-list{
        width:216px;
        height:60px;
        margin-top:10px;
        margin-right:10px;
        margin-bottom:10px;
        margin-left:10px;
        align-items:center;
        justify-content: center;
        border-top-width:1px;
        border-top-style: solid;
        border-top-color:#eee;
        border-right-width:1px;
        border-right-style: solid;
        border-right-color:#eee;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
        border-left-width:1px;
        border-left-style: solid;
        border-left-color:#eee;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .hot-location-text{
        color:#333;
        font-size:28px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .list-title{
        height:60px;
        padding-left:30px;
        align-items: flex-start;
        justify-content: center;
        background-color:#f5f5f5;
    }
    .list-title-text{
        color:#999;
        font-size:24px;
    }
    .location-list{
        padding-left:30px;
    }
    .location-model{
        height:90px;
        align-items: flex-start;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
    }
    .location-nav{
        position:fixed;
        top:0;
        right:0;
        bottom:0;
        align-items: center;
        justify-content: center;
    }
    .index-nav{
        padding-left:20px;
        padding-right:20px;
        height:44px;
        align-items: center;
        justify-content: center;
    }
    .index-nav-text{
        color:#666;
        font-size:28px;
    }
    .index-nav-visible{
        color:#1571e5;
    }

    .sidebar-content {
        position: fixed;
        width:600px;
        top: 0;
        right: 0;
        bottom: 0;
        left: 150px;
        transform: translate(750px,0);
        background-color: #f5f5f5;
        box-shadow: -2px 2px 2px 2px #d6d6d6;
    }

    .back {
        position: absolute;
        left: 0;
        top: 0;
        width: 88px;
        height: 90px;
        align-items: center;
        justify-content: center;
    }
    .back-text {
        font-size: 28px;
        color: #999;
    }

    .sidebar-header {
        position: relative;
        padding-left: 88px;
        padding-right: 88px;
        height: 90px;
        align-items: center;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
        background-color: #fff;
    }

    .sidebar-header-text {
        color: #333;
        font-size: 36px;
    }
    .sidebar-module{
        padding-left:30px;
        padding-right:30px;
    }
    .city-name{
        height:90px;
        align-items:flex-start;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .city-name-text{
        color:#333;
        font-size:32px;
    }
    .city-name-text-visible{
        color:#f60;
    }
    .empty-history{
        padding-top:50px;
        justify-content: center;
        align-items: center;
    }
    .empty-history-text{
        color:#999;
        font-size:32px;
        padding-top:20px;
    }
</style>