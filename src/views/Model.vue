<template>
    <div  class="model">
        <scroller style="flex: 1">
            <title :titleName="titleName"></title>
            <nav :navList="navList"></nav>
            <truck-image :truckImageData="truckImageData"></truck-image>
            <div class="model-info">
                <div class="model-name">
                    <text class="model-name-text">{{simName}}</text>
                    <text class="examine-similar" @click="examineSimilar">查看{{gatherTotal}}款相近车型</text>
                </div>
                <div class="switch-model-button" @click="switchModelShow">
                    <text :style="{fontFamily:'detail',fontSize:'32px',color:'#586c94'}">&#x5237;</text>
                    <text class="switch-model-button-text">换车型</text>
                </div>
            </div>
            <!--参数配置-->
            <parameterConfig :parameterData="parameterData" :moreParamUrl="moreParamUrl"></parameterConfig>
            <!--相近车型可选配置-->
            <examineSimilar v-if="examineSimliarData.content.length > 0" ref="examine" :seriesId="seriesInfo.F_SubCategoryId" :seriesInfo="seriesInfo" :examineSimliarData="examineSimliarData" :locationInfo="locationInfo"></examineSimilar>
            <!--经销商-->
            <dealer :locationInfo="locationInfo" :dealerData="dealerData" @selectLocationPop="selectLocationPop"></dealer>
        </scroller>
        <!--选地区弹层-->
        <selectLocation v-if="LocationPop" :locationData="locationData" @selectLocationPop="selectLocationPop" @getLocationInfo="getLocationInfo"></selectLocation>
        <!--换车型弹层-->
        <switch-model v-if="switchModelData.paramName" :switchModelPop="switchModelPop" :switchModelData="switchModelData" :ProductId="ProductId" @switchModelShow="switchModelShow"></switch-model>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import truckImage from '../components/truckImage.vue'
    import parameterConfig from '../components/model/parameterConfig.vue'
    import examineSimilar from '../components/model/examineSimilar.vue'
    import dealer from '../components/dealer.vue'
    import selectLocation from '../components/selectLocation.vue'
    import switchModel from '../components/switchModel.vue'

    let stream = weex.requireModule('stream')
    let dom = weex.requireModule('dom')
    let storage = weex.requireModule('storage')
    let modal = weex.requireModule('modal')
    export default {
        components:{title, nav, truckImage,parameterConfig,examineSimilar,dealer,selectLocation,switchModel},
        data(){
            return {
                //车系标题名称
                titleName:'',
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //导航列表
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
                //车型id
                ProductId:'',
                //车型简称
                simName:'',
                //类似车型数量
                gatherTotal:'',
                //卡车图片信息
                truckImageData:{
                    //图片路径
                    imgSrc:'',
                    //图片数量
                    imgTotal:'',
                    //图片价格
                    priceScope:{
                        price:''
                    },
                    //排行
                    rank:'',
                    //点击跳转链接
                    imgUrl:''
                },
                //换车型弹层是否显示
                switchModelPop:false,
                //换车型弹层数据
                switchModelData:{
                    paramName:'',
                },
                //参数配置数据
                parameterData:[],
                //查看详细参数配置url
                moreParamUrl:'',
                //相似车型可选配置数据
                examineSimliarData:{
                    options:{},
                    content:[]
                },
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

            }
        },
        methods:{
            //选择城市弹层显示与隐藏
            selectLocationPop(){
                this.LocationPop = !this.LocationPop;
            },
            //查看类似车型
            examineSimilar(){
                let examine = this.$refs.examine.$el;
                dom.scrollToElement(examine,{offset:0})

            },
            //换车型弹框
            switchModelShow(){
                this.switchModelPop = !this.switchModelPop;
            },
            //选择城市后保存已选择城市信息
            getLocationInfo(locationInfo){
                this.locationInfo = locationInfo;
                //请求经销商数据
                this.getDealerData();

                //存储已经选择城市信息
                storage.setItem('selectedLocation',JSON.stringify(this.locationInfo));
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

            //获取车系id & 子类id & 品牌id等信息
            storage.getItem('seriesInfo',(ele) => {
                if(ele.result == 'success'){
                    this.seriesInfo = JSON.parse(ele.data);

                    //查看是否保存以选择城市信息
                    storage.getItem('selectedLocation',(ele) => {
                        if(ele.result == 'success'){
                            this.locationInfo = JSON.parse(ele.data);
                        }
                        //请求经销商数据
                        this.getDealerData();

                    });
                }
            });

            //获取车型id
            storage.getItem('ProductId',(res) => {
                if(res.result == 'success'){
                    //给车型id赋值
                    this.ProductId = res.data;
                    //请求车型数据
                    this.getData('http://product-yufabu.360che.com/index.php?r=app/product/price/&proId=' + this.ProductId + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(ele) => {
                        if(ele.ok){
                            //标题
                            this.titleName = ele.data.proInfo.F_ProductName;
                            //图片数据
                            this.truckImageData.imgSrc = ele.data.proInfo.imgSrc;
                            this.truckImageData.rank = ele.data.rank;
                            this.truckImageData.imgTotal = ele.data.proInfo.F_ImagesCount;
                            this.truckImageData.priceScope.price = ele.data.proInfo.F_Price;
                            this.truckImageData.priceScope.imgUrl = ele.data.proInfo.imgUrl;
                            this.truckImageData.imgUrl = ele.data.proInfo.imgUrl;

                            //车型简称
                            this.simName = ele.data.proInfo.simName;
                            //查看相似车型数量
                            this.gatherTotal = ele.data.gatherTotal;
                            //参数配置数据
                            this.parameterData = ele.data.mainParam;
                            //查看详细参数配置url
                            this.moreParamUrl = ele.data.moreParamUrl;
                            //相似车型可选配置数据
                            this.examineSimliarData.options = ele.data.gatherProParams;
                            this.examineSimliarData.content = ele.data.gatherProList;

                            //选地区数据
                            this.locationData = ele.data.provinceList;
                        }
                    });

                    //请求换车型数据
                    this.getData('http://product.36oche.com/index.php?r=app/product/get-product-change-list&subId=66&seriesId=64&proId=2550',(ele) => {
                        if(ele.ok){
                            this.switchModelData = ele.data;

                            //判断哪一个的length最长显示哪一个
                            let paramName = '';
                            let has = true;
                            for(let key in ele.data){
                                if(has && ele.data[key]){
                                    has = false;
                                    paramName = key;
                                    for(let k in ele.data){
                                        if (ele.data[k] && ele.data[k].list && ele.data[key].list.length < ele.data[k].list.length) {
                                            paramName = k;
                                        }
                                    }
                                }
                            }

                            this.$set(this.switchModelData,'paramName',paramName);
                        }
                    })
                }
            })
        }
    }
</script>
<style scoped>
    .model-info{
        padding-top:20px;
        padding-bottom:20px;
        padding-left:30px;
        flex-direction:row;
    }
    .model-name{
        flex: 1;
        flex-wrap:wrap;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction:row;
    }
    .model-name-text{
        color: #333;
        font-size:28px;
        margin-right:20px;
        margin-bottom:10px;
    }
    .examine-similar{
        color:#586C94;
        font-size:28px;
        text-decoration: underline;
    }
    .switch-model-button{
        width:170px;
        height:90px;
        padding-top: 5px;
        padding-bottom:5px;
        align-items: center;
        justify-content:space-between;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
    }
    .switch-model-button-text{
        color:#586c94;
        font-size:28px;
    }
</style>