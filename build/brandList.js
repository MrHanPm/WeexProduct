import BrandList from '../src/views/BrandList.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);

BrandList.el = '#root';
export default new Vue(BrandList);
