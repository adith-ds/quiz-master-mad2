export default {
    template : `
    <div class="container" id="central">
    <div id="form-body">
        <h2 align="center"> Admin Login </h2>
                
            <div class="mb-3">
                <label for="email" class="form-label">Email account</label>
                <input v-model="email" class="form-control" id="email" placeholder="email@example.com" @input="isEmail">
            </div>
            <div class="mb-3">
                <label for="admin_password" class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control" id="admin_password" @input="isPassword">
            </div>
            <button @click="tryAdminLogin" :disabled="!isFormValid" class="btn btn-info">Login</button>  
    </div>
    </div>
    `,
    data() {
        return {
            email: null,
            password : null,
            errors : {
                email : "yeah",
                pwd : "yeah",
            }
        };
    },
    computed : {
        isFormValid() {
            return !this.errors.email && !this.errors.pwd;
        },
    },
    methods : {
        async tryAdminLogin() {
            try {
                const res = await fetch(origin+'/adminlogin', {
                    method : 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body : JSON.stringify({
                        'email' : this.email,
                        'password' : this.password
                    })
                })
                if(res.ok) {
                    const data = await res.json()
                    console.log(data)
                    localStorage.setItem('user', JSON.stringify(data))
                    this.$store.commit('setuser')
                    this.$router.push('/admin/dashboard')
                }
                else if(res.status === 401) {
                    alert("please use the main login")
                    this.$router.push('/login')
                }
                else {
                    const data = await res.json();
                    const message = data['message'];
                    alert(message)
                    this.email = null
                    this.password = null
                }
            }
            catch (err) {
                console.log("request not sent")
            }
        },
        isEmail() {
            if (!this.email) {
                this.errors.email = 'Email is required.';
            }
            else {
                this.errors.email = null;
            }
        },
        isPassword() {
            if (!this.password) {
                this.errors.pwd = 'Password is required.';
            }
            else {
                this.errors.pwd = null;
            }
        },  
    }
}



