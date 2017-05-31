var navigator = weex.requireModule('navigator');
var thaw = weex.requireModule('THAW');
var dom = weex.requireModule('dom');
var stream = weex.requireModule('stream')
let modal = weex.requireModule('modal')
export default {
    methods: {
        alert (text) {
            modal.alert({
                message: text
            })
        },
        goBack(){
            navigator.pop();
        },
        //直接跳转m端页面
        goUrl (url) {
            console.log(url)
            thaw.goUrl(url)
        },
        //跳入到weex页面
        goWeexUrl(url){
            navigator.push({
                url: "http://192.168.1.120:8080/dist/" + url,
                animated: 'true'
            }, event => {

            })
        },
        //请求数据
        getData(ajaxUrl,callback){
            return stream.fetch({
                method:'GET',
                type:'json',
                url:ajaxUrl
            },callback)
        },
        //请求链接
        ajaxUrl(){
            let DEV = 'http://cui.product.kache.com';
            let BUILD = 'http://product-yufabu.360che.com';
            let DBUG = false;
            let ajaxUrl = DBUG ? DEV : BUILD;
            return ajaxUrl;
        }
    },
    created(){

        //iconFont字体
        dom.addRule('fontFace',{
            'fontFamily':'detail',
            'src':"url(\'https://at.alicdn.com/t/font_scqt9ftimh9nqaor.woff\')"
        });
    }
}
