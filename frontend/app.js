import Navbar from "./components/Navbar.js";
import router from "./utils/router.js";
import store from "./utils/store.js";

const { createApp } = Vue;



const app = createApp({
    template : `
        <div> 
            <Navbar></Navbar> 
            <router-view> </router-view>
        </div>
    `
});

app.config.compilerOptions.delimiters = ['[[', ']]'];

app.component('Navbar', Navbar)
app.use(store)
app.use(router);
app.mount('#app');
