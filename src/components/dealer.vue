<template>
    <div class="dealer">
        <!--标题-->
        <div class="subtitle">
            <text class="subtitle-text">经销商</text>
            <div class="location" @click="selectLocationPop">
                <text :style="{fontFamily:'detail',color:'#586c94'}">&#x4f4d;</text>
                <text class="location-text province-name">{{locationInfo.provinceName}}</text>
                <text class="location-text">{{locationInfo.cityName}}</text>
            </div>
        </div>
        <!--内容-->
        <div class="dealer-content">
            <div v-if="dealerData" v-for="(ele,index) in dealerData" class="dealer-model">
                <div class="dealer-list" @click="goUrl(ele.dealerUrl)">
                    <div class="dealer-header">
                        <!--<div class="dealer-name">-->
                            <image class="dealer-icon" src="https://s.kcimg.cn/wap/images/detail/vip_dealer.png" style="width:28px;height:28px;"></image>
                            <text class="dealer-name-text">{{ele.name}}</text>
                        <!--</div>-->
                        <text class="dealer-price">{{ele.price == '' ? '' : ele.price + '起'}}</text>
                    </div>
                    <text class="dealer-location">{{ele.address}}</text>
                    <div class="function">
                        <div class="tags">
                            <text v-if="ele.tag1 != ''" class="tags-text">{{ele.tag1}}</text>
                            <text v-if="ele.tag2 != ''" class="tags-text">{{ele.tag2}}</text>
                        </div>
                        <div class="action">
                            <div class="phone" @click="onGoCall(ele.phone)">
                                <text :style="{marginRight:'10px',fontFamily:'detail',fontSize:'32px',color:'#586c94'}">&#x62e8;</text>
                                <text class="phone-text">联系经销商</text>
                            </div>
                            <div class="footer-price" @click="goUrl(ele.askPriceUrl)">
                                <text class="footer-price-text">询底价</text>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="activity" v-if="ele.article" @click="goUrl(ele.articleUrl)">
                    <div class="activity-info">
                        <text class="activity-icon">促</text>
                        <text class="activity-text">{{ele.article}}</text>
                    </div>
                </div>
            </div>
            <div v-if="!dealerData" class="empty-dealer">
               <text class="empty-dealer-text">当前地区暂无经销商</text>
                <text class="switch-location" @click="selectLocationPop">点击切换</text>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let stream = weex.requireModule('stream')
    let thaw = weex.requireModule('thaw')
    let storage = weex.requireModule('storage')
    let modal = weex.requireModule('modal')
    export default {
        props:['locationInfo','dealerData'],
        methods:{
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            selectLocationPop(){
                this.$emit('selectLocationPop')
            },
            getData(ajaxUrl,callback){
                return stream.fetch({
                    method:'GET',
                    type:'json',
                    url:ajaxUrl
                },callback)
            },
            //拨打电话
            onGoCall(phone){
                thaw.onGoCall(phone)
            }
        },
        created(){
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
    .subtitle-text{
        color:#333;
        font-size:32px;
        font-weight: bold;
        line-height: 0;
    }
    .subtitle{
        flex-direction: row;
        justify-content: space-between;

    }
    .location{
        flex-direction: row;
        align-items: center;
    }
    .province-name{
        margin-left:8px;
        margin-right: 10px;
    }
    .location-text{
        color:#586c94;
        font-size:28px;
    }
    .dealer-content{
        padding-left:30px;
        padding-right:30px;
    }
    .empty-dealer{
        height:200px;
        align-items: center;
        justify-content: center;
    }
    .empty-dealer-text{
        color:#999;
        font-size:28px;
    }
    .switch-location{
        padding-top:20px;
        padding-right:20px;
        padding-bottom:20px;
        padding-left:20px;
        color:#586c94;
        font-size:28px;
    }
    .dealer-model{
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .dealer-list{
        padding-top:30px;
        padding-bottom:30px;
    }
    .dealer-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .dealer-header{
        position:relative;
        padding-left:40px;
        flex-direction: row;
        justify-content:space-between;
        align-items:center;
    }
    .dealer-icon{
        position:absolute;
        left: 5px;
        top:5px;
    }
    .dealer-name-text{
        flex: 1;
        color:#333;
        font-size:28px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .dealer-price{
        color:#f60;
        font-size:28px;
        text-align: right;
    }
    .dealer-location{
        margin-top:10px;
        padding-left:40px;
        color:#999;
        font-size:24px;
    }
    .function{
        padding-left:40px;
        margin-top:20px;
        flex-direction:row;
        justify-content:space-between;
    }
    .tags{
        justify-content: center;
        flex-direction:row;
        align-items: center;
    }
    .tags-text{
        margin-right:16px;
        color:#999;
        font-size:24px;
    }
    .action{
        height:64px;
        flex-direction:row;
        justify-content:flex-start;
        align-items: center;;
    }
    .phone{
        height:64px;
        flex-direction:row;
        align-items:center;
        padding-left:30px;
        padding-right:30px;
    }
    /*.phone:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .phone-text{
        color:#586c94;
        font-size:28px;
    }
    .footer-price{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        justify-content: center;
        border-top-width:1px;
        border-top-style: solid;
        border-top-color:#586c94;
        border-right-width:1px;
        border-right-style: solid;
        border-right-color:#586c94;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#586c94;
        border-left-width:1px;
        border-left-style: solid;
        border-left-color:#586c94;
        border-top-left-radius:8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    /*.footer-price:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .footer-price-text{
        color:#586c94;
        font-size:28px;
    }
    .activity{
        height:80px;
        padding-left:40px;
        padding-right:40px;
    }
    .activity:active{
        background-color: rgba(0,0,0,.2);
    }
    .activity-info{
        flex: 1;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#eee;
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
    }
    .activity-icon{
        padding-left:4px;
        padding-right:4px;
        /*padding-bottom:2px;*/
        margin-right:10px;
        color:#f60;
        font-size:24px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#f60;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#f60;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f60;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#f60;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .activity-text{
        color:#333;
        font-size:28px;
    }
</style>