export default {
    props : ['id'],
    template : `
    <div class="container" id="central">
    <h1 v-if="sub" class="display-1">[[ sub.name ]]</h1>
    <button class="btn btn-warning" @click="this.$router.push('/admin/createchap/'+this.id)">Create new chapter</button>
    <br>
    <div v-if="chaps">
    <div v-for="chap in chaps" >
    <br>
    <div class="jumbotron card">
    <h1 class="card-title" @click="this.$router.push('/admin/chapter/' + chap.id)">[[ chap.name ]]</h1>
    <p class="card-text">[[ chap.desc ]]</p>
    <br>
    </div>
    </div>
    <br>
    </div>
    <div v-else>
    <h3>No chapters created yet</h3>
    </div>
    </div>
    `,
    data() {
        return {
            sub : null,
            chaps : [],
        }
    },
    async mounted() {
        try {
            const params = new URLSearchParams({
                "type" : "subject",
            });
            const data = await fetch(`${origin}/api/byid/${this.id}?${params.toString()}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                const subject = await data.json()
                this.sub = subject
                console.log(this.sub)
            }
            else {
                console.log(await data.json())
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }
        try {
            const data = await fetch(`${origin}/api/chapters/${this.id}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                
                const chapters = await data.json()
                this.chaps = chapters
            }
            else {
                if(data.status == 404) {
                    console.log(await data.json())
                    this.chaps = null
                }
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }

    },


}