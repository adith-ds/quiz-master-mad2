

export default {
    template : `
    <div class="container" id="central">
    <h1 class="display-1">Subjects</h1>
    <button class="btn btn-warning" @click="this.$router.push('createsub')">Create new subject</button>
    <br>
    <div v-if="subs">
    <div v-for="sub in subs" >
    <br>
    <div class="jumbotron card">
    <h1 class="card-title" @click="$router.push('subject/' + sub.id)">[[ sub.name ]]</h1>
    <p class="card-text">[[ sub.desc ]]</p>
    <br>
    <button class="btn btn-danger ms-auto" @click="deletesub(sub.id)">Delete</button>
    <br>
    </div>
    </div>
    <br>
    </div>
    <div v-else>
    No subjects created yet
    </div>
    </div>
    `,
    data() {
        return {
            subs : [],

        }
    },
    async mounted() {
        try {
            const data = await fetch(origin+'/api/subjects', {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            })
            if(data.ok) {
                const subjects = await data.json()
                this.subs = subjects
            }
            else {
                console.log("error")
            }
        }
        catch (err) {
            console.log("network error, please try again later")
        }
    },
    methods : {
        async deletesub(deleted_id) {
            try {
                const data = await fetch(`${origin}/api/subjects/${deleted_id}`, {
                    method : 'DELETE',
                    headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
                });
                if(data.ok) {
                    const res = await data.json()
                    this.subs = this.subs.filter(sub => sub.id !== deleted_id)
                    console.log(res)
                }
                else {
                    if(data.status == 404) {
                        console.log(await data.json())
                    }
                }
            }
            catch (err) {
                alert("network error, please try again later")
            }

        }
    }
}