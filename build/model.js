/*** Created by zhouhepeng on 2017/5/4.*/
import Model from '../src/views/Model.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
Model.el = '#root'
export default new Vue(Model);

