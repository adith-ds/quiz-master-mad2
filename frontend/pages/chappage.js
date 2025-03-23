export default {
    props : ['id'],
    template : `
    <div class="container" id="central">
    <h1>Quizzes</h1>
    <div id="passwordHelpBlock" class="form-text">
    Click to attempt a quiz
    </div>
    <div v-if="quizzes">
    <div v-for="quiz in quizzes" >
    <div class="jumbotron card">
    <h4 class="card-title">[[ quiz.name ]]</h4>
    <br>
    <p class="card-text">[[ quiz.desc ]]</p>
    <br>
    <button class="btn btn-primary ms-auto" @click="this.$router.push('/attempt/'+quiz.id)">Attempt quiz</button>
    </div>
    <br>
    </div>
    </div>
    <div v-else>No quizzes found :&#40;</div>
    <div>
    <button type="button" class="btn btn-primary" @click="this.$router.push('/main')">Go back</button>
    </div>
    
    </div>
    `,
    data() {
        return {
            chap : null,
            quizzes : [],
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
                
                const quizs = await data.json()
                this.quizzes = quizs
            }
            else {
                if(data.status == 404) {
                    console.log(await data.json())
                    this.quizzes = null
                }
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }

    },
}