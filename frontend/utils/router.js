import loginpage from "../pages/login.js"
import registerpage from "../pages/register.js"
import mainpage from "../pages/mainpage.js"
import subpage from "../pages/subpage.js"
import store from "./store.js";

const { createRouter, createWebHistory } = VueRouter;


const Home = {
    template : `<h1> testing ts out </h1>`
}


const routes = [
    {path : '/', component : Home},
    {path : '/login', component : loginpage},
    {path : '/register', component : registerpage},
    {path : '/main', component : mainpage, meta : {reqLogin : true, role : 'user'}},
    {path : '/subject/:id', props : true, component : subpage, meta : {reqLogin : true, role : 'user'}},
    {path : '/chapter/:id', props : true, component : Home, meta : {reqLogin : true, role : 'user'}},

]

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.reqLogin)) {
        if(!store.state.islogged) {
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role) {
            next({path : '/'})
        } else {
            next()
        }
    }
    else {
        next()
    }

})




export default router;