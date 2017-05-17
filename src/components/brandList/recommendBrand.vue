<template>
    <div class="recommend">
        <div class="title">
            <text class="title-text">推荐品牌</text>
        </div>
        <div class="content">
            <div class="recommend-list" v-for="(ele,index) in recommendList" @click="SidebarShow(ele.url)">
                <image :src="ele.img" style="width:120px;height:80px"></image>
                <text class="recommend-text">{{ele.name}}</text>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['recommendList'],
        methods:{
            SidebarShow(url){
               this.$emit('SidebarShow',url)
            }
        }
    }
</script>

<style scoped>
    .title{
        height:60px;
        padding-left:20px;
        justify-content: center;
        background-color: #f5f5f5;
    }
    .title-text{
        color:#1571e5;
        font-size:28px;
    }
    .content{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f5f5f5;
        flex-wrap: wrap;

    }
    .recommend-list{
        width:183px;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-left:20px;
        padding-bottom:20px;
        padding-right:20px;
    }
    .recommend-list:active{
        background-color:rgba(0,0,0,.2);
    }
    .recommend-text{
        height:24px;
        margin-top:20px;
        color:#333;
        font-size:24px;
        flex-wrap: wrap;
        text-align: center;
    }
</style>