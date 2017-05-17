<template>
    <div class="truck-image" @click="goUrl('http://product.m.360che.com' + truckImageData.imgUrl)">
        <image :src="truckImageData.imgSrc" style="width:750px;height: 500px"></image>
        <div class="img-info">
            <div class="price">
                <text class="guide-text">厂商指导价：</text>
                <div v-if="!truckImageData.priceScope.price" style="flex-direction:row;">
                    <text class="price-text" v-if="truckImageData.priceScope.min">{{truckImageData.priceScope.min == Math.round(truckImageData.priceScope.min)?Math.round(truckImageData.priceScope.min):truckImageData.priceScope.min}}</text>
                    <text class="price-text" v-if="truckImageData.priceScope.max">-{{truckImageData.priceScope.max == Math.round(truckImageData.priceScope.max) ? Math.round(truckImageData.priceScope.max) : truckImageData.priceScope.max}}万</text>
                </div>
                <text v-else class="price-text">{{truckImageData.priceScope.price}}万元</text>
            </div>
            <text v-if="truckImageData.imgTotal != 0" class="img-total">{{truckImageData.imgTotal}}张图片</text>
        </div>
        <div class="ranking" v-if="truckImageData.rank != 0">
            <div :style="{backgroundColor:'#ff8533',height:'37px',paddingRight:'10px',justifyContent:'center',alignItems:'center'}">
                <text :style="{paddingLeft:'20px',fontSize:'24px',color:'#fff'}">牵引车第{{truckImageData.rank}}名</text>
            </div>
            <text :style="{position:'absolute',left:'0',top:'0',fontFamily:'detail',color:'#ff8533',fontSize:'37px'}">&#x6392;</text>
            <text :style="{position:'absolute',left:'25px',top:'5px',fontFamily:'detail',color:'#fff',fontSize:'24px'}">&#xe603;</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            truckImageData:Object
        },
        methods:{

        },
        created(){
        }
    }
</script>

<style scoped>
    .truck-image{
        position:relative;
        border-top-width:20px;
        border-top-style:solid;
        border-top-color:#f5f5f5;
    }
    .ranking{
        position:absolute;
        right:0;
        top:0;
        padding-left:45px;
        flex-direction:row;
    }
    .img-info{
        position:absolute;
        left:0;
        right:0;
        bottom:0;
        height:100px;
        padding-right:20px;
        padding-left:26px;
        flex-direction:row;
        justify-content: space-between;
        align-items:center;
        /*background-image:linear-gradient(to bottom,rgba(255, 255, 255, 0) 0,rgba(0, 0, 0, .9)) ;*/
        background-color:rgba(0,0,0,.2);
    }
    .price{
        height:100px;
        flex-direction:row;
        align-items:center;
    }
    .guide-text{
        font-size:24px;
        color:#fff;
    }
    .price-text{
        font-size:32px;
        color:#fff;
    }
    .img-total{
        font-size:24px;
        color:#fff;
    }
</style>