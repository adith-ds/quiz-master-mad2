import loginpage from "../pages/login.js"
import registerpage from "../pages/register.js"
import mainpage from "../pages/mainpage.js"
import subpage from "../pages/subpage.js"

const { createRouter, createWebHistory } = VueRouter;


const Home = {
    template : `<h1> testing ts out </h1>`
}


const routes = [
    {path : '/', component : Home},
    {path : '/login', component : loginpage},
    {path : '/register', component : registerpage},
    {path : '/main', component : mainpage},
    {path : '/subject/:id', props : true, component : subpage},
    {path : '/chapter/:id', props : true, component : Home},

]

const router = createRouter({
    history: createWebHistory(),
    routes
});








export default router;