export default {
    props : ['id'],
    template : `
    <div class="container" id="central">
    <h1>Create a chapter now</h1>
    <br>
    <div class="mb-3">
    <label for="name" class="form-label">Chapter name</label>
    <input type="text" v-model="name" class="form-control" id="name" @input="isName">
    </div>
    <div class="mb-3">
    <label for="desc" class="form-label">Chapter description</label>
    <textarea v-model="desc" class="form-control" id="desc" rows="3" @input="isDesc"></textarea>
    </div>
    <button type="button" @click="CreateChap" :disabled="!isFormValid" class="btn btn-success">Create</button>
    </div>
    `,
    data() {
        return {
            name : null,
            desc : null,
            errors : {
                name : "yeah",
                desc : "yeah",
            }
        }
    },
    computed : {
        isFormValid() {
            return !this.errors.name && !this.errors.desc;
        },
    },
    methods : {
        async CreateChap() {
            try {
                const res = await fetch(`${origin}/api/chapters/${this.id}`, {
                    method : 'POST',
                    headers: {'Content-Type' : 'application/json',  'auth-token' : this.$store.state.auth_token},
                    body : JSON.stringify({
                        'name' : this.name,
                        'desc' : this.desc,
                    })
                });
                if(res.ok) {
                    this.$router.push('/admin/subject/'+this.id)
                }
                else {
                    const data = await res.json();
                    const message = data['message'];
                    alert(message)
                    this.name = null
                    this.desc = null
                }
            }
            catch (err) {
                alert("request not sent\nplease try again")
            }

        },
        isName() {
            if (!this.name) {
                this.errors.name = 'Name is required.';
            }
            else {
                this.errors.name = null;
            }
        },
        isDesc() {
            if (!this.desc) {
                this.errors.desc = 'Description is required.';
            }
            else {
                this.errors.desc = null;
            }
        }
    }   
}