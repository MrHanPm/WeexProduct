<template>
    <div class="series">
        <list style="flex: 1">
            <cell>
                <!--标题-->
                <title :titleName="titleName"></title>
                <!--nav导航-->
                <nav :navList="navList" :navInfo="navInfo"></nav>
                <!--卡车图片信息-->
                <truck-image :truckImageData="truckImageData"></truck-image>
                <!--车型列表-->
                <model-type-list v-if="seriesInfo.F_SubCategoryId" :seriesInfo="seriesInfo" :locationInfo="locationInfo"></model-type-list>
                <!--经销商-->
                <dealer :locationInfo="locationInfo" :dealerData="dealerData" @selectLocationPop="selectLocationPop"></dealer>
                <!--文章-->
                <articles v-if="articlesList != null" :articlesList="articlesList" :titleName="titleName" :moreArticleUrl="moreArticleUrl"></articles>
                <!--口碑-->
                <reputation :reputation="reputation" :titleName="titleName"></reputation>
                <!--论坛-->
                <bbs-list :bbsList="bbsList" :titleName="titleName" :morePostUrl="morePostUrl"></bbs-list>
                <!--其他人还关注-->
                <other-concerns :otherData="otherData"></other-concerns>
                <!--二手车推荐-->
                <second-hand v-if="secondHandData.data" :secondHandData="secondHandData"></second-hand>
            </cell>
        </list>
        <!--<footer-price></footer-price>-->
        <!--<keep-alive>-->
        <!--选地区弹层-->
        <select-location v-if="LocationPop" :locationData="locationData" @selectLocationPop="selectLocationPop" @getLocationInfo="getLocationInfo"></select-location>
        <!--</keep-alive>-->
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import truckImage from '../components/truckImage.vue'
    import modelTypeList from '../components/series/modelTypeList.vue'
    import footerPrice from '../components/series/footerPrice.vue'
    import dealer from '../components/dealer.vue'
    import articles from '../components/series/articles.vue'
    import reputation from '../components/series/reputation.vue'
    import bbsList from '../components/series/bbsList.vue'
    import otherConcerns from '../components/series/otherConcerns.vue'
    import selectLocation from '../components/selectLocation.vue'
    import secondHand from '../components/series/secondHand.vue'
//    import store from '../store'

    let domModule = weex.requireModule('dom')
    let stream = weex.requireModule('stream')
    let modal = weex.requireModule('modal')
    let storage = weex.requireModule('storage')
    let thaw = weex.requireModule('THAW')
    export default {
        data(){
            return {
                //车系标题名称
                titleName:'',
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //导航列表
                navInfo:'series',
                navList:[
                    {
                        name:'综述',
                        url:'',
                        selected:true
                    },
                    {
                        name:'配置',
                        url:'',
                        selected:false
                    },
                    {
                        name:'图片',
                        url:'seriesPhoto.weex.js',
                        selected:false
                    },
                    {
                        name:'经销商',
                        url:'',
                        selected:false
                    },
                    {
                        name:'文章',
                        url:'',
                        selected:false
                    },
                    {
                        name:'口碑',
                        url:'',
                        selected:false
                    },
                    {
                        name:'论坛',
                        url:'',
                        selected:false
                    },
                    {
                        name:'服务站',
                        url:'',
                        selected:false
                    }
                ],
                //卡车图片信息
                truckImageData:{
                    //图片地址
                    imgSrc:'',
                    //图片跳转链接
                    imgUrl:'',
                    //图片总数量
                    imgTotal:'',
                    //价格
                    priceScope:'',
                    //排行
                    rank:''
                },
                //车型列表
//                modelList:[],
                //选择的城市信息
                locationInfo:{
                    provinceName:'全国',
                    provinceId:'',
                    cityName:'',
                    cityId:'',
                },
                //经销商数据
                dealerData:{},
                //选择城市弹层显示与隐藏
                LocationPop:false,
                //选择地区列表数据
                locationData:{},

                //文章列表
                articlesList:[],
                //查看更多文章url
                moreArticleUrl:'',
                //口碑数据
                reputation:{

                },
                //论坛数据
                bbsList:[],
                //论坛更多url
                morePostUrl:'',
                //其他人还关注列表
                otherData:[],
                //二手车数据
                secondHandData:{
                    data:[],
                    moreUrl:'',
                },
            }
        },
        methods:{
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            //选择城市弹层显示与隐藏
            selectLocationPop(){
                this.LocationPop = !this.LocationPop;
            },
//            //发送请求
//            getData(url,callback){
//                return stream.fetch({
//                    method:'GET',
//                    type:'json',
//                    url:url
//                },callback)
//            },
            //选择城市后保存已选择城市信息
            getLocationInfo(locationInfo){
                this.locationInfo = locationInfo;
                //请求经销商数据
                this.getDealerData();

                //请求二手车数据
                this.getSecondHandData();

                //存储已经选择城市信息
                storage.setItem('selectedLocation',JSON.stringify(this.locationInfo));
            },

            //请求二手车数据
            getSecondHandData(){
                this.getData('https://tao-api.m.360che.com/foreign/truck/relatives?cat_id=' + this.seriesInfo.F_SubCategoryId + '&series_id=' + this.seriesInfo.F_SeriesId + '&prov_id=' + this.locationInfo.provinceId + '&brand_id=' + this.seriesInfo.F_BrandId,(ele) => {
                    console.log(ele)
                    if(ele.ok){
                        this.secondHandData = ele.data
                    }
                })
            },

            //请求经销商数据
            getDealerData(){
                let DEV = 'http://cui.product.kache.com';
                let BUILD = 'http://product-yufabu.360che.com';
                let DBUG = false;
                let ajaxUrl = DBUG ? DEV : BUILD;

                this.getData(ajaxUrl + '/index.php?r=app/series/dealer&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId ,(ele) => {
                    if(ele.ok){
                        this.dealerData = ele.data;
                    }
                })
            }
        },
        created(){
            //iconFont字体
            domModule.addRule('fontFace',{
                'fontFamily':'detail',
                'src':"url(\'https://at.alicdn.com/t/font_1z3q14vor7h3q5mi.woff\')"
            });

            let DEV = 'http://cui.product.kache.com';
            let BUILD = 'http://product-yufabu.360che.com';
            let DBUG = false;
            let ajaxUrl = DBUG ? DEV : BUILD;

            //获取车系id & 子类id & 品牌id等信息
//            let Time = setTimeout(() => {
////                clearTimeout(Time)
                storage.getItem('seriesInfo',(ele) => {
                    if(ele.result == 'success'){
                        this.seriesInfo = JSON.parse(ele.data);
//            this.seriesInfo = {"F_SeriesId":"64","F_SeriesName":"解放J6P","F_EnglishName":"J6P","F_IsEnable":"1","F_CreateDateTime":"2013-11-01 10:58:23","F_BrandId":"5","F_WeekClickCount":"597521","F_MonthClickCount":"1119973","F_TotalClickCount":"0","F_IsStopMake":"1","F_OrderNum":"1","F_ShortName":"一汽解放J6P牵引车","F_APv":"0","F_SPv":"0","proid":"19359","F_SeriesExtendId":"72","F_SubCategoryId":"66","F_CateId":"1","F_ProductNum":163,"F_ImagesCount":"8227","F_ImageId":"82788","F_MainImages":"[{\"s\":1,\"id\":434958},{\"s\":2,\"id\":434989},{\"s\":3,\"id\":435047}]","F_ClickCount":"2400381","F_BrandName":"一汽解放","F_SubCategoryName":"牵引车","F_FirstImg":"66645","F_IsFirst":"1","F_FirstImgUrl":"http://product.360che.com/Pic/416330.html#pic","top":2,"tagid":"50","newTop":1}

                        //请求标题 && 图片数据
                        this.getData(ajaxUrl + '/index.php?r=app/series/info&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId,(ele) => {
                            if(ele.ok){
                                //标题名称
                                this.titleName = ele.data.h1;
                                //卡车图片信息
                                this.truckImageData.imgSrc = ele.data.imgSrc;
                                this.truckImageData.imgTotal = ele.data.imgTotal;
                                this.truckImageData.priceScope = ele.data.priceScope;
                                this.truckImageData.rank = ele.data.rank;
                                this.truckImageData.imgUrl = ele.data.imgUrl;
                            }
                        });

                        //请求车系页面其他数据
                        this.getData(ajaxUrl + '/index.php?r=app/series/other&subCateId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(ele) => {
                            if(ele.ok){
                                //文章数据
                                this.articlesList = ele.data.articles;
                                //更多文章url
                                this.moreArticleUrl = 'https://product.m.360che.com' + ele.data.moreArticleUrl;
                                //口碑数据
                                this.reputation = ele.data.reputation;
                                //论坛数据
                                this.bbsList = ele.data.postList;
                                //论坛更多url
                                this.morePostUrl = ele.data.morePostUrl;
                                //其他人还关注列表
                                this.otherData = ele.data.compete;
                                //地区列表
                                this.locationData = ele.data.provinceList;
                            }
                        });

                        //查看是否保存以选择城市信息
                        storage.getItem('selectedLocation',(ele) => {
                            if(ele.result == 'success'){
                                this.locationInfo = JSON.parse(ele.data);
                            }
                            //请求经销商数据
                            this.getDealerData();

                            //请求二手车数据
                            this.getSecondHandData()
                        });
                    }else{
                        this.alert('网络出错')
                    }
                });
//            },5000)


        },
        components:{
            title,
            nav,
            truckImage,
            modelTypeList,
            dealer,
            articles,
            reputation,
            bbsList,
            otherConcerns,
            footerPrice,
            selectLocation,
            secondHand,
        }
    }
</script>

<style scoped>
    .series{
        flex: 1;
    }
    .search-location-keep{
        flex: 1;
    }
</style>