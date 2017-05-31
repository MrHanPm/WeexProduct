<template>
    <div :class="['title',black ? 'black':'']">
        <div class="back" @click="goBack">
            <text :style="{fontFamily:'detail',fontSize:'32px'}" :class="['back-text',black?'black-text':'']">回</text>
        </div>
        <div class="wrapper">
            <scroller scroll-direction="horizontal" show-scrollbar="false" :class="['init',black ? 'black':'']">
                <div :class="['title-init',black ? 'black':'']">
                    <text :class="['title-name',black?'black-text':'']">{{titleName}}</text>
                </div>
            </scroller>
        </div>
    </div>
</template>

<script type="text/babel">
    let navigator = weex.requireModule('navigator');
    export default {
        props:['titleName','black'],
        methods:{
        }
    }
</script>

<style scoped>
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
    .black{
        background-color:#111;
    }
    .wrapper{
        min-width:510px;
        height:90px;
    }
    .init{
        position:relative;
        width:510px;
        height:89px;
        justify-content: center;
        align-items:center;
    }
    .title-init{
        flex: 1;
        width:510px;
        height: 89px;
        /*padding-left:150px;*/
        /*padding-right:150px;*/
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
    }
    .title-name{
        color:#333;
        font-size:36px;
        flex-wrap: nowrap;
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
    .back-text{
        color:#333;
    }
    .black-text{
        color:#fff;
    }
    /*.shade{*/
        /*position:absolute;*/
        /*top:0;*/
        /*width:40px;*/
        /*height:90px;*/

    /*}*/
    /*.first-shade{*/
        /*left:0;*/
        /*width:0;*/
        /*!*background-image: linear-gradient(to left,rgba(255,255,255,.8),rgba(255,255,255,.2));*!*/
        /*border-right-width:10px;*/
        /*border-right-color:rgba(255,255,255,.8);*/
        /*border-right-style: solid;*/
        /*border-left-width:10px;*/
        /*border-left-color:rgba(255,255,255,.9);*/
        /*border-left-style: solid;*/
    /*}*/
    /*.last-shade{*/
        /*right:0;*/
        /*width:0;*/
        /*border-right-width:10px;*/
        /*border-right-color:rgba(255,255,255,.9);*/
        /*border-right-style: solid;*/
        /*border-left-width:10px;*/
        /*border-left-color:rgba(255,255,255,.8);*/
        /*border-left-style: solid;*/
    /*}*/
</style>