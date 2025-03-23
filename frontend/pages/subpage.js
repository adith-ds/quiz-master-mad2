export default {
    props : ['id'],
    template : `
    <div class="container" id="central"> 
    <h1>Chapters</h1>
    <div id="passwordHelpBlock" class="form-text">
    Click on a heading to view related quizzes
    </div>
    <div v-if="chapters">
    <div v-for="chap in chapters" >
    <div class="jumbotron card">
    <h4 class="card-title" @click="$router.push('/chapter/' + chap.id)">[[ chap.name ]]</h4>
    <br>
    <p class="card-text">[[ chap.desc ]]</p>
    </div>
    <br>
    </div>
    </div>
    <div v-else>No chapters found :&#40;</div>
    <div>
    <button type="button" class="btn btn-primary" @click="$router.push('/main')" >Go back</button>
    </div>
    
    </div>
    `,
    data() {
        return {
            chapters : null,
        }
    },
    async mounted() {
        try {
            const data = await fetch(`${origin}/api/chapters/${this.id}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                
                const chaps = await data.json()
                this.chapters = chaps
            }
            else {
                if(data.status == 404) {
                    console.log(await data.json())
                    this.chapters = null
                }
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }
    },
}