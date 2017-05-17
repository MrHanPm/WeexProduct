<template>
    <div class="model-type-list">
        <div class="subtitle">
            <div class="title-name">
                <text class="subtitle-text">车型报价</text>
                <div class="sell-state-sum" v-for="ele in modelList" v-if="ele.total > 0 && sellState == ele.name">
                    <text :style="{fontSize:'24px',color:'#999'}">共</text>
                    <text :style="{fontSize:'24px',color:'#f60'}">{{ele.total}}</text>
                    <text :style="{fontSize:'24px',color:'#999'}"> 款{{ele.name}}车型</text>
                </div>
            </div>
            <!--在售 || 未发布 || 停售-->
            <div class="sell-state">
                <div :class="['sell-state',sellState == ele.name ? 'sell-state-visible' : '']" v-for="ele in modelList" v-if="ele.total > 0" @click="selectSellState(ele.name)">
                    <keep-alive>
                        <text :class="['sell-state-text',sellState == ele.name ? 'sell-state-text-visible' : '']">{{ele.name}}</text>
                    </keep-alive>
                </div>
            </div>
        </div>
        <!--数据列表-->
        <div v-for="(ele,index) in modelList" v-if="sellState == ele.name" class="content">
            <div class="options">
                <div v-for="(res,key) in ele.list" :class="['option',optionState[index] == key ? 'option-visible' : '',optionNumber == 3 ? 'long-option' : 'short-option']" @click="selectOption(key,index)">
                    <text :class="['option-test',optionState[index] == key ? 'option-test-visible' : '' ]">{{key}}</text>
                </div>
            </div>
            <div class="wrapper">
                <div v-for="(res,key) in ele.list" v-if="optionState[index] == key">
                    <div v-for="(data,index) in res" class="model-list" v-if="index < modelListNumber" @click="goInfo(data)"><!---->
                        <div class="truck-info">
                            <div class="truck-name">
                                <text v-if="data.hotLocation" class="truck-name-tag">{{data.hotLocation}}</text>
                                <text class="truck-name-text">{{data.speaclProName.replace(' ','')}}</text>
                            </div>
                            <div class="guide-price">
                                <text v-if="data.priceScope" class="guide-price-text">厂商指导价：{{data.priceScope}}</text>
                                <text v-else="" class="guide-price-text">厂商指导价：{{data.F_Price != 0 ? data.F_Price : '暂无'}}</text>
                                <div class="tags">
                                    <text v-for="tag in data.paramDetail" class="tag-text">{{tag}}</text>
                                </div>
                            </div>
                            <div class="action">
                                <div class="">
                                    <text class="hot-price">{{data.hotPrice}}</text>
                                </div>
                                <div class="action-wrapper">
                                    <div class="comparison" @click="compare(data.F_ProductId)">
                                        <text v-if="!compareState[data.F_ProductId]" :style="{fontFamily:'detail',fontSize:'26px',color:'#586c94',marginRight:'5px'}">&#x52a0;</text>
                                        <text class="comparison-text">{{compareState[data.F_ProductId] ? compareState[data.F_ProductId] : '加入'}}</text>
                                    </div>
                                    <div class="floor-price" @click="goInfo(data.askUrl)">
                                        <text class="floor-price-text">询底价</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="load-more" v-if="res.length > modelListNumber" @click="loadMore">
                        <text class="load-more-text">加载更多</text>
                        <text :style="{fontFamily:'detail',fontSize:'28px',color:'#999'}">&#x4e0b;</text>
                    </div>
                </div>
            </div>
        </div>
        <div :class="['compare',compareNumber == 0 ? 'compare-hide' : '']" ref="compare" @click="goCompare(compareUrl)">
            <text class="compare-text">对比  ({{compareNumber}})</text>
        </div>
    </div>
</template>

<script type="text/babel">
    import store from '../../store'
    let stream = weex.requireModule('stream');
    let modal = weex.requireModule('modal');
    let storage = weex.requireModule('storage');
    let animation = weex.requireModule('animation');
    export default {
        props:['seriesInfo','locationInfo'],
        data(){
            return {
                //车系ID
                seriesId:'',
                //车型列表
                modelList:[],
                //地区热门列表
                hotModelList:[],
                //当前状态 在售 || 未发布 || 停售
                sellState:'',
                //当前状态 4*2 || 6*2 || 6*4
                optionState:['','',''],
                //车型列表选项一行的个数
                optionNumber:4,
                //车型列表显示数量
                modelListNumber:10,
                //加入对比状态
                compareState:{

                },
                //对比要跳转过去的url
                compareUrl:'',
                //对比的数量
                compareNumber:'',
                //存储的对比数据
                compareTask:{},
            }
        },
        methods:{
            alert (text) {
                modal.alert({
                    message: text,
                    duration: 0.3
                })
            },
            //发送请求
            getData(url,callback){
                return stream.fetch({
                    method:'GET',
                    type:'json',
                    url:url
                },callback)
            },
            selectSellState(state){
                this.sellState = this.sellState == state ? this.sellState : state;
            },
            //选择当前状态 4*2 || 6*2 || 6*4
            selectOption(key,index){
                this.$set(this.optionState,index,key)
                this.modelListNumber = 10;
            },
            //点击展开更多车型
            loadMore(){
                this.modelListNumber += 10;
            },
            //对比
            compare(id){
                //查看存储的数据
                storage.getItem('compareTask',(ele) => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        if(data[this.seriesId]){
                            //判断是加入还是取消
                            if(this.compareState[id]){  //取消
                                //循环已保存的数组 && 删除掉
                                data[this.seriesId].forEach((ele,index) => {
                                    if(ele == id){
                                        data[this.seriesId].splice(index,index + 1)
                                        //添加对比的数量
                                        this.compareNumber--;

                                        //如果还剩下一个对比
                                        if(data[this.seriesId][0]){
                                            //对比的链接
                                            this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
                                        }
                                    }
                                });
                                //再次存储
                                storage.setItem('compareTask',JSON.stringify(data),() => {
                                    this.$set(this.compareState,id,'')
                                })
                            }else{//加入
                                if(data[this.seriesId].length >= 2){
                                    this.alert('只能对比两款车型')
                                }else{
                                    data[this.seriesId].push(id);
                                    //添加对比的数量
                                    this.compareNumber++;

                                    //判断现在对比的数量有几个
                                    if(data[this.seriesId].length == 2){
                                        //对比的链接
                                        this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '_' + data[this.seriesId][1] + '/';
                                    }else{
                                        //对比的链接
                                        this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
                                    }
                                    //再次存储
                                    storage.setItem('compareTask',JSON.stringify(data),() => {
                                        this.$set(this.compareState,id,'已加入')
                                    })

                                }
                            }

                        }else{
                            data[this.seriesId] = [];
                            data[this.seriesId].push(id);
                            //添加对比的数量
                            this.compareNumber++;
                            //加入对比
                            this.$set(this.compareState,id,'已加入');
                            //对比的链接
                            this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
                            storage.setItem('compareTask',JSON.stringify(data))
                        }
                    }else{
                        //未获取到存储，第一次存储
                        let compareTask = {};
                        compareTask[this.seriesId] = [];
                        compareTask[this.seriesId].push(id);


                        //添加对比的数量
                        this.compareNumber++;

                        //加入对比
                        this.$set(this.compareState,id,'已加入');
                        //对比的链接
                        this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
                        storage.setItem('compareTask',JSON.stringify(compareTask))
                    }
                });
            },
            //url跳转
            goInfo(ele){
                //判断是直接跳转还是存储跳转
                if(typeof ele != 'string'){
                    //存储车型id
                    storage.setItem('ProductId',ele.F_ProductId,(ele) => {
                        //跳转
                        this.goWeexUrl('Model.weex.js');
                    });
                }else{
                    //直接跳转
                    this.goUrl(ele);
                }

            },
            //点击对比，跳转对比链接
            goCompare(compareUrl){
                this.compareState = {};
                //对比要跳转过去的url
                this.compareUrl = '';
                //对比的数量
                this.compareNumber = '';
                //存储的对比数据
                this.compareTask = {};
                storage.getItem('compareTask',(ele) => {
                    if(ele.result == 'success'){
                        let compareTask = JSON.parse(ele.data);
                        if(compareTask[this.seriesId]){
                            compareTask[this.seriesId] = [];
                        }
                        storage.setItem('compareTask',JSON.stringify(compareTask),() => {
                            this.goUrl(compareUrl);
                        })
                    }
                })
            },
            //请求地区热门车型
            getHotModel(){
                let DEV = 'http://cui.product.kache.com';
                let BUILD = 'http://product-yufabu.360che.com';
                let DBUG = false;
                let ajaxUrl = DBUG ? DEV : BUILD;
                //请求地区热门车型
                this.getData(ajaxUrl + '/index.php?r=app/series/district-price&subCateId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(res) => {
                    if(res.ok){
                        this.hotModelList = res.data;
                        console.log(this.hotModelList,'this.hotModelList')
                        //循环最外层标签
                        this.modelList.forEach((ele, index) => {
                            //如果数据的内容不为空
                            if(this.modelList[index].total > 0){
                                for(let key in this.modelList[index].list) {
                                    //循环总列表
                                    this.modelList[index].list[key].forEach((data,number) => {
                                        //重置热门地区和报价
                                        this.$set(this.modelList[index].list[key][number],'hotLocation','');
                                        this.$set(this.modelList[index].list[key][number],'hotPrice','');

                                        //循环热门车型报价
                                        if(this.hotModelList){
                                            this.hotModelList.forEach((hot,i) => {
                                                //如果id相等
                                                if(data.F_ProductId == hot.productId){
                                                    //赋值价格
                                                    this.$set(this.modelList[index].list[key][number],'hotPrice',hot.price);
                                                    //是热门
                                                    if(hot.hot && hot.hot == 1){
                                                        this.$set(this.modelList[index].list[key][number],'hotLocation','[' + this.locationInfo.cityName + '热门]');
                                                    }
                                                    let hotprice = this.modelList[index].list[key].splice(number,'1')[0];
                                                    this.modelList[index].list[key].unshift(hotprice)
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                });
            }
        },
        created(){
            let DEV = 'http://cui.product.kache.com';
            let BUILD = 'http://product-yufabu.360che.com';
            let DBUG = false;
            let ajaxUrl = DBUG ? DEV : BUILD;
            //查看屏幕分辨率，判断车型列表选项一行的个数
            if(weex.config.deviceWidth <= 320){
                this.optionNumber = 3;
            };
            //请求车型列表数据
            this.getData(ajaxUrl + '/index.php?r=app/series/price&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid,(ele) => {
                if(ele.ok){
                    //给车型列表赋值
                    this.modelList = ele.data;

                    //请求地区热门车型
                    this.getHotModel();


                    //默认显示状态 在售 || 未上市 || 停售
                    let ishave = true;
                    this.modelList.forEach((ele,index) => {
                        if(this.modelList[index].total > 0 && ishave){
                            this.sellState = this.modelList[index].name;
                            ishave = false;
                        }
                    });

                    //获取对比存储数据
                    storage.getItem('compareTask',(comper) => {
                        if(comper.result == 'success'){
                            this.compareTask = JSON.parse(comper.data);
                        }
                    });

                    //默认显示状态 4*2 || 6*2 || 6*4 ...
                    let islongest = true;
                    let longest = '';
                    //循环最外层标签
                    this.modelList.forEach((ele,index) => {
                        islongest = true;
                        //如果数据的内容不为空
                        if(this.modelList[index].total > 0){

                            //循环状态下的list
                            for(let key in this.modelList[index].list){
                                //定义状态，只循环一次，用第一条数据逐个对比之后的数据
                                if(islongest){
                                    islongest = false;

                                    //当车系id为空的时候 获取车系id并赋值
                                    if(!this.seriesId){
                                        this.seriesId = this.modelList[index].list[key][0].F_SubCategoryId;

                                        //获取存储对比数据 && 给元素赋值
                                        if (this.compareTask[this.seriesId]) {
                                            //获取对比的数量
                                            this.compareNumber = this.compareTask[this.seriesId].length;
                                            //循环存储的对比数据，渲染数据
                                            this.compareTask[this.seriesId].forEach((res,index) => {
                                                this.$set(this.compareState, res, '已加入')
                                            })

                                            //判断现在对比的数量有几个
                                            if (this.compareTask[this.seriesId].length == 2) {
                                                //对比的链接
                                                this.compareUrl = 'http://product.m.360che.com/contrast/' + this.compareTask[this.seriesId][0] + '_' + this.compareTask[this.seriesId][1] + '/';
                                            } else {
                                                //对比的链接
                                                this.compareUrl = 'http://product.m.360che.com/contrast/' + this.compareTask[this.seriesId][0] + '/';
                                            }
                                        }
                                    }

                                    //默认取第一条数据的length
                                    longest = this.modelList[index].list[key];
                                    //默认取第一条数据的key
                                    this.$set(this.optionState,index,key)

                                    //二次循环，去一一对比
                                    for(let k in this.modelList[index].list){
                                        //如果小于后面的length
                                        if(longest.length < this.modelList[index].list[k].length){

                                            //取后面的length比较长的数据
                                            longest = this.modelList[index].list[k]
                                            this.$set(this.optionState,index,k)
                                        }
                                    }
                                }

                            }
                        }
                    });

                }
            });
        },
        watch:{
            //监听 加入 || 取消对比
            compareNumber(){
                let compare = this.$refs.compare;
                if(this.compareNumber == ''){
                    animation.transition(compare,{
                        styles:{
                            transform:'translate(0,0)',
                        },
                        duration:300,
                        timingFunction:'ease'
                    })
                }else{
                    animation.transition(compare,{
                        styles:{
                            transform:'translate(-140px,0)',
                        },
                        duration:300,
                        timingFunction:'ease'
                    })
                }
            },
            //深度监听地区发生变化
            locationInfo:{
                //当地区发生变化的时候 请求调取热门地区
                handler(){
                    this.getHotModel();
                },
                deep: true,
            }
        }
    }
</script>

<style scoped>
    .subtitle{
        height:100px;
        flex-direction:row;
        justify-content: space-between;
        align-items: center;
        padding-left:30px;
        padding-right:30px;
        border-top-width:20px;
        border-top-style: solid;
        border-top-color:#f5f5f5;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#e5e5e5;
    }
    .title-name{
        flex-direction: row;
    }
    .subtitle-text{
        color:#333;
        font-size:32px;
        font-weight: bold;
    }
    .sell-state-sum{
        margin-left:10px;
        flex-direction: row;
        align-items: center;
    }
    .sell-state{
        height:78px;
        margin-left:10px;
        flex-direction:row;
        align-items: center;
        border-bottom-width: 0;
    }
    .sell-state-text{
        font-size:28px;
        color:#999;
        padding-left:10px;
        padding-right:10px;
    }
    .sell-state-visible{
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f60;
    }
    .sell-state-text-visible{
        color:#f60;
    }
    .options{
        flex-direction:row;
        justify-content:flex-start;
        align-items:center;
        padding-top:10px;
        padding-bottom:10px;
        padding-left:10px;
        padding-right:10px;
        flex-wrap: wrap;
    }
    .option{
        height:60px;
        justify-content:center;
        align-items:center;
        margin-left:10px;
        margin-right:10px;
        margin-top:10px;
        margin-bottom:10px;
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
        border-top-left-radius: 8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    .long-option{
        width:223px;
    }
    .short-option{
        width:160px;
    }
    .option-visible{
        border-top-color:#586c94;
        border-right-color:#586c94;
        border-bottom-color:#586c94;
        border-left-color:#586c94;
    }
    .option-test{
        color:#333;
        font-size:24px;
    }
    .option-test-visible{
        color:#586c94;
    }
    .wrapper{
        border-top-width:20px;
        border-top-style: solid;
        border-top-color:#f5f5f5;
    }
    .model-list{
        padding-left:30px;
        padding-right:30px;
    }
    .model-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .truck-info{
        padding-top:30px;
        padding-bottom:20px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .truck-name{
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
    }
    .truck-name-tag{
        margin-right:20px;
        color:#448dea;
        font-size:24px;
    }
    .truck-name-text{
        color: #333333;
        font-size:28px;
    }
    .guide-price{
        flex-direction:row;
        justify-content:space-between;
        margin-top:12px;
    }
    .guide-price-text{
        color:#999;
        font-size:24px;
    }
    .tags{
        flex-direction:row;
    }
    .tag-text{
        margin-left:15px;
        color:#999;
        font-size:24px;
    }
    .load-more{
        height:80px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }
    .action{
        height:64px;
        margin-top:20px;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .hot-price{
        color:#f60;
        font-size:28px;
    }
    .action-wrapper{
        flex:1;
        flex-direction:row;
        justify-content:flex-end;
    }
    .comparison{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
    }
    /*.comparison:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .comparison-text{
        color:#586c94;
        font-size:24px;
    }
    .floor-price{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#586C94;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#586C94;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#586C94;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#586C94;
        border-top-left-radius: 8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    /*.floor-price:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .floor-price-text{
        color:#586C94;
        font-size:28px;
    }
    .keep-alive{
        flex-direction:row
    }
    .compare{
        position: fixed;
        left:750px;
        bottom: 270px;
        width: 140px;
        height: 70px;
        justify-content: center;
        align-items: center;
        border-top-left-radius:36px;
        border-bottom-left-radius:36px;
        background-color: rgba(21,113,229,.8);
    }
    .compare-text{
        color:#fff;
        font-size:24px;
    }
</style>