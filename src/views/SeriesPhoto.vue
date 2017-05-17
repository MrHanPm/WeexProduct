<template>
    <div class="series-photo">
        <scroller style="flex: 1" @loadmore="fetch" loadmoreoffset="10">
            <!--标题-->
            <title :titleName="titleName"></title>
            <!--nav导航-->
            <nav :navList="navList"></nav>
            <!--车型名字和换车型-->
            <div class="model-name">
                <text class="model-name-text">{{proName}}</text>
                <div class="switch-model-button" @click="switchModelShow">
                    <text class="switch-model-text">换车型</text>
                    <text :style="{fontFamily:'detail',fontSize:'24px',color:'#586C94'}">&#x53bb;</text>
                </div>
            </div>
            <!--内容-->
            <photo-album :photoData="photoData" v-if="photoData.options.length" @detailed="detailed"></photo-album>
            <!--loading状态-->
            <load v-if="loadingShow"></load>
        </scroller>
        <!--换车型弹层-->
        <switch-model v-if="switchModelData.paramName" :switchModelPop="switchModelPop" :switchModelData="switchModelData" @switchModelShow="switchModelShow" :imgSwitchModel="imgSwitchModel" @switchModel="switchModel"></switch-model>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import photoAlbum from '../components/photoAlbum.vue'
    import switchModel from '../components/switchModel.vue'
    import load from '../components/load.vue'

    let dom = weex.requireModule('dom');
    let stream = weex.requireModule('stream');
    let storage = weex.requireModule('storage');
    let modal = weex.requireModule('modal')
    export default {
        data(){
            return {
                //标题名称
                titleName: '',
                //车型名称
                proName: '',
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo: {},
                //车型id
                ProductId:0,
                //导航列表
                navList: [
                    {
                        name: '综述',
                        url: '',
                        selected: false
                    },
                    {
                        name: '配置',
                        url: '',
                        selected: false
                    },
                    {
                        name: '图片',
                        url: '',
                        selected: true
                    },
                    {
                        name: '经销商',
                        url: '',
                        selected: false
                    },
                    {
                        name: '文章',
                        url: '',
                        selected: false
                    },
                    {
                        name: '口碑',
                        url: '',
                        selected: false
                    },
                    {
                        name: '论坛',
                        url: '',
                        selected: false
                    },
                    {
                        name: '服务站',
                        url: '',
                        selected: false
                    }
                ],
                //图片列表数据
                photoData: {
                    options: [],
                    content: {},
                    typeId: 0,
                    page:2,
                },
                //换车型弹层是否显示
                switchModelPop: false,
                //换车型弹层数据
                switchModelData: {
                    paramName: '',
                },
                //图片页面换车型
                imgSwitchModel:true,
                //loading状态显示与隐藏
                loadingShow:false,
            }
        },
        created(){
            //iconFont字体
            dom.addRule('fontFace', {
                'fontFamily': 'detail',
                'src': "url(\'https://at.alicdn.com/t/font_1z3q14vor7h3q5mi.woff\')"
            });


            //获取车系id信息
            storage.getItem('seriesInfo', seriesInfo => {
                if (seriesInfo.result == 'success') {
                    this.seriesInfo = JSON.parse(seriesInfo.data);

                    //查看有没有车型id ？ 如果有车型id 请求车型图片数据 ： 请求所有数据

                    storage.getItem('ProductId', ProductId => {
                        if(ProductId.result == 'success'){
                            this.ProductId = ProductId.data;
                            //请求详细车型数据
                            this.detailed(this.photoData.typeId)
                        }else{
                            //请求图片页信息
                            this.getData('http://product-yufabu.360che.com/index.php?r=api/getweekpicturelist&subCateId=66&seriesId=64/index.php?r=api/getweekpicturelist&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId, ele => {
                                if (ele.ok && ele.data.info == 'ok') {
                                    //标题
                                    this.titleName = ele.data.title;
                                    //车型名称
                                    this.proName = '全部车型';
                                    //图片内容选项
                                    this.photoData.options = ele.data.data.tab;
                                    //图片内容
                                    this.photoData.content = ele.data.data.list;
                                }
                            });
                        }
                    });

                    //请求换车型数据
                    this.getData('http://product.m.360che.com/index.php?r=m/ajax/series/ajaxgetseriesimgproduct&&seriesid=' + this.seriesInfo.F_SeriesId + '&subcateid=' + this.seriesInfo.F_SubCategoryId, ele => {
                        if (ele.ok && ele.data.status == 1) {
                            this.switchModelData = ele.data.data;

                            //判断哪一个的length最长显示哪一个
                            let paramName = '';
                            let has = true;
                            for (let key in ele.data.data) {
                                if (has) {
                                    has = false;
                                    paramName = key;
                                    for (let k in ele.data.data) {
                                        if (ele.data.data[k] && ele.data.data[k].list && ele.data.data[key].list.length < ele.data.data[k].list.length) {
                                            paramName = k;
                                        }
                                    }
                                }
                            }
                            this.$set(this.switchModelData, 'paramName', paramName);
                        }
                    })
                }
            });

        },
        methods: {
            alert(text){
                modal.alert({
                    message:text,
                })
            },
            //数据请求
            getData(ajaxUrl, callback){
                return stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: ajaxUrl
                }, callback)
            },
            //请求图片详细分类
            detailed(typeId){
                //选中的选项
                this.photoData.typeId = typeId;
                //重置页数
                this.page = 2;
                //请求图片页信息
                this.getData('http://product-yufabu.360che.com/index.php?r=api/getweekpicturelist&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&typeId=' + typeId + '&productId=' + this.ProductId, ele => {
                    if (ele.ok && ele.data.info == 'ok') {
                        //标题
                        this.titleName = ele.data.title;
                        //车型名称
                        this.proName = ele.data.proName;
                        //详细车型内容选项
                        this.photoData.options = ele.data.data.tab;
                        //详细车型图片内容
                        this.photoData.content = ele.data.data.list;
                    }
                })
            },
            //换车型弹框
            switchModelShow(){
                this.switchModelPop = !this.switchModelPop;
            },
            //滚动加载更多图片
            fetch(){
                //loading状态显示
                this.loadingShow = true;
                this.getData('http://product.m.360che.com/index.php?r=m/ajax/series/ajaxgetseriesimgmore&ajaxurl=%2Findex.php%3Fr%3Dm%2Fajax%2Fseries%2Fajaxgetseriesimgmore&seriesid=' + this.seriesInfo.F_SeriesId + '&subcateid=' + this.seriesInfo.F_SubCategoryId + '&typeid=' + this.photoData.typeId + '&productid=' + this.ProductId + '&page=' + this.photoData.page,(ele) => {
                   if(ele.ok && ele.data.status == 1){
                       //数组合并
                       let arr = this.photoData.content[0].imgList.concat(ele.data.data);
                       //设置更新数据
                       this.$set(this.photoData.content[0], 'imgList', arr);
                       //loading状态隐藏
                       this.loadingShow = false;
                       //页数++
                       this.page++
                   }else{
                       //loading状态隐藏
                       this.loadingShow = false;
                   }
                })
            },
            //点击换车型弹层车型列表
            switchModel(ProductId){
                //切换车型id
                this.ProductId = ProductId;
                storage.setItem('ProductId',ProductId,ele => {
                    if(ele.result == 'success'){
                        this.goWeexUrl('seriesPhoto.weex.js')
                    }
                })
            }
        },
        components: {title, nav, photoAlbum, switchModel,load}
    }
</script>

<style scoped>
    /*车型名字 && 换车型*/
    .model-name {
        height: 90px;
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #eee;
    }

    .model-name-text {
        color: #333;
        font-size: 28px;
    }

    .switch-model-button {
        width: 120px;
        height: 90px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .switch-model-text {
        color: #586C94;
        font-size: 28px;
        margin-right: 10px;
    }
</style>