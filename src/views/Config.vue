<template>
    <div class="config">
        <list style="flex: 1">
            <cell>
                <!--标题-->
                <title :titleName="titleName"></title>
                <!--nav导航-->
                <nav :navList="navList" :navInfo="navInfo"></nav>
            </cell>
        </list>
    </div>
</template>

<script type="text/babel">
    let storage = weex.requireModule('storage')

    import title from '../components/title.vue'
    import nav from '../components/nav.vue'

    export default {
        components:{
            title,
            nav
        },
        data(){
            return {
                //标题
                titleName:'',
                //导航列表
                navInfo:'config',
                navList:[
                    {
                        name:'综述',
                        url:'series.weex.js',
                        selected:false
                    },
                    {
                        name:'配置',
                        url:'',
                        selected:true
                    },
                    {
                        name:'图片',
                        url:'seriesPhoto.weex.js',
                        selected:false
                    },
                    {
                        name:'经销商',
                        url:'',
                        selected:false
                    }
                ],
                //配置数据
                configData:{},
            }
        },
        created(){
            this.getData('http://product.360che.com/index.php?r=weex/series/config&subId=66&seriesId=64',ele => {
                if(ele.ok){
                    this.configData = ele.data;
                    //标题
                    this.titleName = ele.data.seriesInfo.F_SeriesName + ele.data.seriesInfo.F_SubCategoryName + '配置'
                }
            })
        }
    }
</script>

<style scoped>
</style>