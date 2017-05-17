<template>
    <div class="photo-info">
        <title :titleName="titleName" black="black"></title>
        <div class="options">
            <div v-for="(ele,index) in sliderData" class="option" @click>
                <text :class="['option-text',index == tagPage?'option-selected-text':'']">{{ele.F_TypeName}}</text>
            </div>
        </div>
        <div class="img-list">
            <slider class="slider" @change="change">
                <div class="frame" v-for="img in imgList"><!--v-for="img in sliderData[tagPage].imgList"-->
                    <image class="image" resize="cover" :src="img.url"></image>
                </div>
            </slider>
            <div class="indicator" v-if="sliderData[tagPage]">
                <text class="current" style="color:#fff;">{{forward}}</text>
                <text class='between'> / </text>
                <text class="total">{{sliderData[tagPage].imgList.length}}</text>
            </div>
        </div>

    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    let storage = weex.requireModule('storage');
    export default {
        data(){
            return {
                //标题名称
                titleName: '',
                //当前选项的TypeId
                typeId:'',
                //图片的详细信息
                imgDataList:{},
                //轮播图数据
                sliderData:[],
                //当前标签的数据
                imgList:[],
                //标签类型
                tagPage:0,
                //详细分类
                infoPage:1,
                //前进还是后退
                forward:1,
                switch:true,

            }
        },
        created(){
            //获取图片详情信息
            storage.getItem('imgDataInfo',ele => {
                if(ele.result == 'success'){
                    this.imgDataList = JSON.parse(ele.data);
                    console.log(this.imgDataList,'this.imgDataList')
                    this.getData('http://product-yufabu.360che.com/index.php?r=api/getweekpicturedetail&imageId=203238',ele => {
                        if(ele.ok){
                            //标题
                            this.titleName = ele.data.title;
                            //图片数据内容
                            this.sliderData = ele.data.data;
                            this.imgList = this.sliderData[this.tagPage].imgList;
                            console.log(this.imgList)

                            //判断现在page是第几个。
                          this.sliderData.forEach((page,index) => {
                            if(page.F_TypeName == ele.data.typeName){
                                this.tagPage = index;
                            }
                          })
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
                        this.tagPage--;
                        if(this.tagPage < 0){
                            this.tagPage =  this.sliderData.length-1;
                        }
                        this.forward = this.sliderData[this.tagPage].imgList.length;
                    }else{
                        this.tagPage++;
                        if(this.tagPage > this.sliderData.length){
                            this.tagPage =  0
                        }
                        this.forward = 1;
                    }
                }
            }
        },
        components:{title},
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