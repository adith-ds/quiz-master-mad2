import Quizpopup from "./../components/quizpopup.js"

export default {
    props : ['id'],
    template : `
    <div class="container" id="central">
    <h1 v-if="chap" class="display-1">[[ chap.name ]]</h1>
    <button class="btn btn-warning" @click="this.$router.push('/admin/createquiz/'+chap.id)">Create new quiz</button>
    <br>
    <div v-if="quizs">
    <div v-for="quiz in quizs" >
    <br>
    <div class="jumbotron card overflow-hidden">
    <h1 class="card-title">[[ quiz.name ]]</h1>
    <p class="card-text">[[ quiz.desc ]]</p>
    <br>
    <Quizpopup :quizid="quiz.id"></Quizpopup>
    <br>
    </div>
    </div>
    <br>
    </div>
    <div v-else>
    <h3>No quizzes created yet</h3>
    </div>
    </div>
    `,
    data() {
        return {
            chap : null,
            quizs : [],
        }
    },
    async mounted() {
        try {
            const params = new URLSearchParams({
                "type" : "chapter",
            });
            const data = await fetch(`${origin}/api/byid/${this.id}?${params.toString()}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                const chapter = await data.json()
                this.chap = chapter
                console.log(this.chap)
            }
            else {
                console.log(await data.json())
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }
        try {
            const data = await fetch(`${origin}/api/quizzes/${this.id}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                
                const quizzes = await data.json()
                this.quizs = quizzes
            }
            else {
                if(data.status == 404) {
                    console.log(await data.json())
                    this.quizs = null
                }
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }

    },
    components : {
        Quizpopup
    }


}