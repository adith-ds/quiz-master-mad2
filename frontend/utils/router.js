import Home from "../pages/home.js"
import loginpage from "../pages/login.js"
import registerpage from "../pages/register.js"
import mainpage from "../pages/mainpage.js"
import subpage from "../pages/subpage.js"
import adminlogin from "../pages/adminlogin.js"
import dashboard from "../pages/dashboard.js"
import subjects from "../pages/subjects.js"
import subjects from "../pages/subjects.js"

import store from "./store.js";

const { createRouter, createWebHistory } = VueRouter;



const routes = [
    {path : '/', component : Home},
    {path : '/login', component : loginpage},
    {path : '/register', component : registerpage},
    {path : '/main', component : mainpage, meta : {reqLogin : true, role : 'user'}},
    {path : '/subject/:id', props : true, component : subpage, meta : {reqLogin : true, role : 'user'}},
    {path : '/chapter/:id', props : true, component : Home, meta : {reqLogin : true, role : 'user'}},
    {path : '/secretlogin', component : adminlogin},
    {path : '/admin', meta : {reqLogin : true, role : 'admin'}, children : [
        {path : 'dashboard', component : dashboard},
        {path : 'subjects', component : subjects},
        {path : 'createsub', component : createsub},
        {path : 'chapters'},
        {path : 'quizzes'},
        {path : 'users'}
    ]}
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