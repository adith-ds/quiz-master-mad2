import AddQues from "./../components/qadder.js"

export default {
    props : ['id'],
    template : `
    <div class="container" id="central">
    <div id="quizstuff" :style="{ opacity: isQuiz ? 0.5 : 1, pointerEvents: isQuiz ? 'none' : 'auto' }">
    <h1>Create a quiz now</h1>
    <br>
    <div class="mb-3">
    <label for="name" class="form-label">Quiz name</label>
    <input type="text" v-model="name" class="form-control" id="name" @input="isName">
    </div>
    <div class="mb-3">
    <label for="desc" class="form-label">Quiz description</label>
    <textarea v-model="desc" class="form-control" id="desc" rows="3" @input="isDesc"></textarea>
    </div>
    <div class="mb-3">

    <h3 class="form-label">Quiz duration</h3>
    <div class="row">
        <div class="col d-flex flex-column">
            <label for="minutes" class="form-label">Minutes</label>
            <input type="number" v-model="minutes" id="minutes" class="form-control" placeholder="00" step="1" min="1" max="60" @input="isMin">
        </div>
        <div class="col-auto d-flex align-items-end">
            <h3>:</h3>
        </div>
        <div class="col d-flex flex-column">
            <label for="seconds" class="form-label">Seconds</label>
            <input type="number" v-model="seconds" id="seconds" class="form-control" placeholder="00" step="1" min="0" max="59">
        </div>
    </div>
    </div>
    <button type="button" @click="CreateQuiz" :disabled="!isFormValid" class="btn btn-success">Create</button>

    </div>

    <div id="questionstuff" v-show="isQuiz">
    <AddQues :id="this.quizid" :name="this.name"></AddQues>
    </div>

    </div>
    `,
    data() {
        return {
            name : null,
            desc : null,
            minutes : null,
            quizid : null,
            seconds : "00",
            isQuiz : false,
            errors : {
                name : "yeah",
                desc : "yeah",
                min : "yeah",
            }
        }
    },
    computed : {
        isFormValid() {
            return !this.errors.name && !this.errors.desc && !this.errors.min;
        },
        fullTime() {
            const mm = String(this.minutes).padStart(2, '0');
            const ss = String(this.seconds).padStart(2, '0');
            return `${mm}:${ss}`;
        },
    },
    methods : {
        async CreateQuiz() {
            try {
                const res = await fetch(`${origin}/api/quizzes/${this.id}`, {
                    method : 'POST',
                    headers: {'Content-Type' : 'application/json',  'auth-token' : this.$store.state.auth_token},
                    body : JSON.stringify({
                        'name' : this.name,
                        'desc' : this.desc,
                        'time' : this.fullTime
                    })
                });
                if(res.ok) {
                    const data = await res.json();
                    this.quizid = data['id'];
                    this.isQuiz = true;
                }
                else {
                    const data = await res.json();
                    const message = data['message'];
                    alert(message)
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
        },
        isMin() {
            if (!this.minutes) {
                this.errors.min = "Time is required.";
            }
            else {
                this.errors.min = null;
            }
        }
    },
    watch: {
        minutes(value) {
          if (value > 60) this.minutes = 60; 
          if (value < 1) this.minutes = 1;   
        },
        seconds(value) {
          if (value > 59) this.seconds = 59;
          if (value < 0) this.seconds = 0;
        }
    },
    components : {
        AddQues
    }   
}