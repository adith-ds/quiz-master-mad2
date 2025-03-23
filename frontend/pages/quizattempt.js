
export default {
    props : ['quizid'],
    template : `
    <div class="container" id="central">

    <div v-if="quiz">
    <div v-if="step === 'start'">
        <h1>[[ quiz.name ]]</h1>
        <p>[[ quiz.desc ]]</p>
        <p v-if="previousScore !== null">Previous Attempt: [[ previousScore.obtained_score ]] / [[ previousScore.total_score ]]</p>
        <button class="btn btn-primary" @click="startQuiz">Start Quiz</button>
        <button class="btn btn-danger" @click="$router.push('/main')">Go to Home</button>
    </div>

    <div v-else-if="step === 'quiz'">
        <h3>Time Left: [[ timeLeft ]]s</h3>
        <h4>Question [[ currentIndex + 1 ]] of [[ totalQuestions ]]</h4>
        <p><strong>Q:</strong> [[ questions[currentIndex].statement ]]</p>
        <div v-for="(option, index) in options" :key="index">
            <input type="radio" :id="'option' + index" v-model="userAnswers[currentIndex]" :value="index + 1">
            <label :for="'option' + index">[[ option ]]</label>
        </div>
        <button v-if="currentIndex > 0" @click="prevQuestion">Previous</button>
        <button v-if="currentIndex < totalQuestions - 1" @click="nextQuestion">Next</button>
        <br>
        <button v-if="currentIndex === totalQuestions - 1" class="btn btn-primary" @click="submitQuiz">Submit</button>
    </div>
    
    <div v-else-if="step === 'finish'">
        <h2>Quiz Completed!</h2>
        <p>Your Score: [[ score ]] / [[ totalQuestions ]]</p>
        <br>
        <button class="btn btn-primary" @click="$router.push('/main')">Go to Home</button>
    </div>
    
    </div>
    <div v-else>Loading. . .</div>
    
    </div>    
    `,
    data() {
        return {

            step : 'start',
            quiz : null,
            previousScore : null,
            questions: [],
            currentIndex: 0,
            totalQuestions: 0,
            userAnswers: [],
            timeLeft: 60,
            score : 0,
            timer : null,

        };
    },
    computed : {
        options() {
            if (this.questions.length === 0) return [];
            const q = this.questions[this.currentIndex];
            return [q.op1, q.op2, q.op3, q.op4];
        }
    },
    async mounted() {
        try {
            const params = new URLSearchParams({
                "type" : "quiz",
            });
            const data = await fetch(`${origin}/api/byid/${this.quizid}?${params.toString()}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                this.quiz = await data.json()
            }
            else {
                console.log(await data.json())
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }
        try {
            const params = new URLSearchParams({
                "type" : "score",
                "u_id" : this.$store.state.user_id,
                "q_id" : this.quizid

            });
            const data = await fetch(`${origin}/api/byid/1?${params.toString()}`, {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if(data.ok) {
                this.previousScore = await data.json()
            }
            else {
                console.log(await data.json())
            }
        }
        catch (err) {
            alert("network error, please try again later")
        }
        try {
            const data = await fetch(`${origin}/api/questions/${this.quizid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'auth-token': this.$store.state.auth_token }
            });
            if (data.ok) {
                this.questions = await data.json();
                this.totalQuestions = this.questions.length;
                this.userAnswers = new Array(this.totalQuestions).fill(null);
            }
        } catch (err) {
            alert("Network error, please try again later");
        }


    },
    methods : {
        startQuiz() {
            this.step = 'quiz';
            const [minutes, seconds] = this.quiz.time.split(":").map(Number);
            this.timeLeft = minutes * 60 + seconds; 
            this.timer = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else {
                    this.submitQuiz();
                }
            }, 1000);
        },
        nextQuestion() {
            if (this.currentIndex < this.totalQuestions - 1) {
                this.currentIndex++;
            }
        },
        prevQuestion() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        },
        submitQuiz() {
            clearInterval(this.timer);
            this.calculateScore();
            this.step = 'finish';
            this.submitscore();
            
        },
        calculateScore() {
            this.score = this.questions.reduce((acc, q, index) => acc + (q.ans == this.userAnswers[index] ? 1 : 0), 0);
        },
        async submitscore() {
            try {
                const res = await fetch(`${origin}/api/scores`, {
                    method : 'POST',
                    headers: {'Content-Type' : 'application/json',  'auth-token' : this.$store.state.auth_token},
                    body : JSON.stringify({
                        'q_name' : this.quiz.name,
                        'q_id' : this.quizid,
                        'u_id' : this.$store.state.user_id,
                        'attempt_time' : this.timeLeft,
                        'obtained_score' : this.score,
                        'total_score' : this.totalQuestions
                    })
                });
                if(res.ok) {
                    console.log(await res.json())
                }
                else {
                    console.log(await res.json())
                }
            }
            catch (err) {
                alert("request not sent\nplease try again")
            }

        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}