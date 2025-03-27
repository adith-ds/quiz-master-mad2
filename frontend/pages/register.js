export default {
    template : `
    <div class="container" id="central">
    <div id="form-body">
        <h2 align="center"> Registration </h2>
                
            <div class="row">
            <div class="col">
                <label for="email" class="form-label">Email account</label>
                <input v-model="email" class="form-control" id="email"  @input="validateEmail" placeholder="email@example.com">
                <p v-if="errors.email" style="color: red">[[ errors.email ]]</p>
            </div>
            <div class="col">
                <label for="user_password" class="form-label">Password</label>
                <input v-model="password" @input="validatePassword" class="form-control" id="user_password">
                <p v-if="errors.pwd" style="color: red">[[ errors.pwd ]]</p>
            </div>
            </div>
            <div class="row">
              <div class="col">
                <label for="username" class="form-label">Username</label>
                <input v-model="username" @input="validateUsername" class="form-control" id="username" placeholder="MrCoolGuy">
                <p v-if="errors.username" style="color: red">[[ errors.username ]]</p>
              </div>
              <div class="col">
                <label for="dob" class="form-label">Date of birth</label>
                <input type="date" v-model="dob" @input="validateDate" class="form-control" id="dob">
                <p v-if="errors.date" style="color: red">[[ errors.date ]]</p>
              </div>
            </div>
            <br>
            <button @click="tryRegister" :disabled="!isFormValid" class="btn btn-success">Register</button>  
    </div>
    </div>
    `,
    data() {
        return {
            email: null,
            password : null,
            username : null,
            dob : null,
            errors: {
                username: null,
                email: null,
                date : null,
                pwd : null,
              },
        };
    },
    computed : {
        isFormValid() {
            return !this.errors.date && !this.errors.username && !this.errors.email && !this.errors.pwd && this.username && this.email;
        },
    },
    methods : {
        async tryRegister() {
            try {
                const res = await fetch(origin+'/register', {
                    method : 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body : JSON.stringify({
                        'email' : this.email,
                        'password' : this.password,
                        'username' : this.username,
                        'dob' : this.dob
                    })
                })
                if(res.ok) {
                    console.log("we exist")
                    const data = await res.json()
                    console.log(data)
                    this.$router.push('/login')
                }
                else {
                    console.log(await res.json())
                }
            }
            catch (err) {
                console.log("fail")
            }
        },
        validateEmail() {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!this.email) {
              this.errors.email = 'Email is required.';
            } else if (!emailRegex.test(this.email)) {
              this.errors.email = 'Invalid email format.';
            } else {
              this.errors.email = null;
            }
        },
        validateUsername() {
            if (!this.username) {
              this.errors.username = 'Username is required.';
            } else if (this.username.length < 6) {
              this.errors.username = 'Username must be at least 6 characters long.';
            } else {
              this.errors.username = null;
            }
        },
        validateDate() {
            if (!this.dob) {
              this.errors.date = 'Date is required.';
              return;
            }
      
            const inputDate = new Date(this.dob);
            const currentDate = new Date();
            const thresholdDate = new Date();
            thresholdDate.setFullYear(currentDate.getFullYear() - 10);
      
            if (inputDate > thresholdDate) {
              this.errors.date = 'Must be at least 10 years old';
            } else {
              this.errors.date = null;
            }
        },
        validatePassword() {
            if (!this.password) {
              this.errors.pwd = 'Password is required.';
            } else if (this.password.length < 8) {
              this.errors.pwd = 'Password must be at least 8 characters long.';
            } else {
              this.errors.pwd = null;
            }
        }
            
    }
}



