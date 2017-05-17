<template>
    <div class="other-concerns">
        <sub-title subTitleName="看过该车的人还关注"></sub-title>
        <div class="other-content">
            <div v-for="ele in otherData" class="other-list" @click="goUrl(ele.url)">
                <image :src="ele.img" style="width:180px;height:120px;margin-right:20px"></image>
                <div class="truck-info">
                    <text class="truck-name">{{ele.name}}</text>
                    <text class="truck-price">{{ele.price}}</text>
                    <div class="footer-price" @click="goUrl(ele.priceUrl)">
                        <text class="truck-price-text">询底价</text><text :style="{fontFamily:'detail',fontSize:'24px',color:'#f60'}">&#x53bb;</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../subTitle.vue';
    export default {
        props:['otherData'],
        components:{subTitle},
        methods:{

        }
    }
</script>

<style scoped>
    .other-content{
        padding-left:30px;
    }
    .other-list{
        padding-top:30px;
        padding-right:30px;
        padding-bottom:30px;
        flex-direction:row;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#e5e5e5;
    }
    .other-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .truck-info{
        flex: 1;
    }
    .truck-name{
        color:#333;
        font-size:32px;
    }
    .truck-price{
        margin-top:10px;
        color:#f60;
        font-size:28px;
    }
    .footer-price{
        flex-direction:row;
        justify-content: flex-end;
        align-items:center;
    }
    /*.footer-price:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .truck-price-text{
        color:#f60;
        font-size:28px;
    }
</style>