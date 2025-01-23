const { createStore } = Vuex;

const store = createStore({
    state() {
        return {
            auth_token : null,
            role : null,
            islogged : false,
            user_id : null,
            
        };
    },
    mutations : {
        setuser(state) {
            try {
                if (JSON.parse(localStorage.getItem('user'))) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    state.auth_token = user.token;
                    state.role = user.role;
                    state.user_id = user.id;
                    state.islogged = true;

                }
                else {
                    throw new Error("no data found")
                }
            }
            catch {
                console.warn("not logged in");
            }

        },
        logout(state) {
            state.auth_token = null;
            state.role = null;
            state.islogged = false;
            state.user_id = null;
            localStorage.removeItem('user');
        }
        

    },
    actions : {

    },
    getters : {

    },


});

store.commit('setuser')

export default store;