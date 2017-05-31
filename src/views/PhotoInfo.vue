<template>
    <div class="photo-info">
        <title :titleName="titleName" black="black"></title>
        <div class="options">
            <div v-for="(ele,index) in tagName" class="option" >
                <text :class="['option-text',ele.id == imgDataList.typeId ?'option-selected-text':'']">{{ele.name}}</text>
            </div>
        </div>
        <div class="img-list">
            <img-slider :imgList="sliderData"></img-slider>
            <!--<slider class="slider" @change="change">-->
                <!--<div class="frame" v-for="img in sliderData">-->
                    <!--<image class="image" style="width: 750px;height:500px" resize="cover" :src="img.url"></image>-->
                <!--</div>-->
            <!--</slider>-->
            <div class="indicator">
                <text class="current" style="color:#fff;">{{forward}}</text>
                <text class='between'> / </text>
                <text class="total">{{total}}</text>
            </div>
        </div>

    </div>
</template>

<script type="text/babel">
    let storage = weex.requireModule('storage');

    import title from '../components/title.vue'
    import imgSlider from '../components/photo/slider.vue'
    export default {
        data(){
            return {
                //标题名称
                titleName: '',
                //当前选项的TypeId
                typeId:'',
                tagName:[],
                //图片的详细信息
                imgDataList:{},
                //轮播图数据
                sliderData:[],
                //当前标签的数据
                imgList:[],
                //图片总数量
                total:0,
                //详细分类
                infoPage:1,
                //前进还是后退
                forward:0,
                switch:true,

            }
        },
        created(){
            //获取图片页面的tab头部标题
            storage.getItem('PhotoTabName',ele => {
                if(ele.result == 'success'){
                    this.tagName = JSON.parse(ele.data);
                    console.log(this.tagName)
                }
            })

            //获取图片详情信息
            storage.getItem('imgDataInfo',ele => {
                if(ele.result == 'success'){
                    this.imgDataList = JSON.parse(ele.data);
                    console.log(this.imgDataList,'imgDataList')
                    this.getData('http://product-yufabu.360che.com/index.php?r=api/getweekpicturedetail&imageId=' + this.imgDataList.F_ImageId + '&typeId=' + this.imgDataList.typeId + '&page=1',ele => {
                        if(ele.ok){

                            //标题
                            this.titleName = ele.data.title;

                            //图片数据内容
                            this.sliderData = ele.data.data;
                            //图片总数量
                            this.total = ele.data.total;

                        }
                    })
                }
            })

        },
        methods:{
            //图片切换
            change(event){
                let number = event.index + 1;
                if(number - this.forward == 1){
                    this.forward = number;
                }else if(this.forward - number == 1){
                    this.forward = number;
                }else{
                    if(number > this.forward){
                        event.index++;
                    }else{
                        event.index--;
                    }
                }
            }
        },
        components:{title,imgSlider},
    }
</script>

<style scoped>
    .photo-info{
        background-color:#111;
    }
    .options{
        flex-direction: row;
        height:80px;
        justify-content: center;
        align-items: center;
        background-color: #222;
    }
    .option{
        height:80px;
        /*align-items: center;*/
        justify-content: center;
        padding-left:32px;
        padding-right:32px;
    }
    .option-text{
        color:rgba(255,255,255,.5);
    }
    .option-selected-text{
        color:#fff;
    }
    .slider{
        width: 750px;
        height:500px;
    }
    .frame{
        width: 750px;
        height:500px;
        /*background-color:red;*/
    }
    .img-list{
        flex:1;
        justify-content: center;
        background-color: #222;
    }
    .image{
        width:750px;
        height:500px;
    }
    .indicator{
        flex-direction: row;
        margin-top:80px;
        justify-content: center;
        align-items: center;
    }
    .current{
        color:#fff;
        font-size:32px;
    }
    .between{
        color:#fff;
        font-size:24px;
        margin-left:10px;
        margin-right:10px;
    }
    .total{
        color:#fff;
        font-size:24px;
    }
</style>