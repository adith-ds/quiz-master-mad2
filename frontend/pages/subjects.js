

export default {
    template : `
    <div class="container" id="central">
    <h1 class="display-1">Subjects</h1>
    <button class="btn btn-warning">Create new subject</button>
    <br>
    <div v-if="subs">
    <div v-for="sub in subs" class="jumbotron card">
    <h1 class="card-title" @click="$router.push('admin/subject/' + id)">[[ sub.name ]]</h1>
    <p class="card-text">[[ sub.desc ]]</p>
    <br>
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
                console.log("bruh")
            }
        }
        catch (err) {
            console.log("fail")
        }
    },
}