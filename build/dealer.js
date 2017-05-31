/**
 * Created by zhouhepeng on 2017/5/25.
 */
import Dealer from '../src/views/Dealer.vue'
import mixins from '../src/mixins'

Vue.mixin(mixins);
Dealer.el = '#root'
export default new Vue(Dealer);

