<template>
    <div class="slider">
        <div class="init" ref="slider" :style="{transform: 'translate(' + distance + 'px, 0px)'}" @swipe="Swipe" @touchstart="begin" @touchmove="move" @touchend="end">
            <div class="img-list" v-for="(img,index) in imgList" >
                <image class="image" style="width: 750px;height:500px" resize="cover" :src="img.url"></image>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let animation = weex.requireModule('animation');
    export default {
        data(){
            return {
                //偏移的距离
                distance:0,
                //开始的距离
                start:'',
                //现在的下标
                index:0,
            }
        },
        created(){
        },
        methods:{
            begin(event){
                this.start = event.changedTouches[0].screenX;
            },
            Swipe(event){
                this.alert(JSON.stringify(event))
            },
            move(event){
                this.distance = this.distance + event.changedTouches[0].screenX - this.start;
                //向右
//                this.alert(this.distance)
//                if(this.distance > 0){
//                    this.alert('向右')
//                }else{
//                    this.alert('向左')
//                }
            },
            end(){
                console.log(this.distance - this.start,'11')
                if(this.distance - this.start >= 50 || this.distance - this.start <= 50){
                    //向右
                    let nihao;
                    if(this.distance - this.start > 0){
                        nihao = 750;
                        --this.index;
                        if(this.index < 0){
                            this.index = 0
                        }
                    }else{//向左
                        nihao = -750;
                        this.index++;
                    }
                    let slider = this.$refs.slider;
                    animation.transition(slider, {
                        styles: {
                            transform: 'translate(' + (this.index == 0 ? nihao : this.index * nihao) + 'px, 0)'
                        },
                        duration: 300, //ms
                        timingFunction: 'ease',
                        delay: 0 //ms
                    },ele => {
                        this.distance = this.index == 0 ? nihao : this.index * nihao
                    })

                }
            }
        },
        props:['imgList']
    }
</script>

<style scoped>
    .slider{
        overflow: hidden;
    }
    .init{
        flex-direction:row;
    }
</style>