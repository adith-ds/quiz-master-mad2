export default {
    props: ["quizid"],
    template: `
    <div>
      <button class="btn btn-primary ms-auto" @click="fetchQuestions">View Questions</button>

      <div v-if="showPopup" class="popup-overlay">
        <div class="popup">
          <button class="close-btn" @click="showPopup = false">X</button>

          <div v-if="questions.length">
            <h3>Question [[ currentIndex + 1 ]] of [[ questions.length ]]</h3>
            <h4><strong>Q:</strong> [[ questions[currentIndex].statement ]]</h4>
            <div class="row">
                <div class="col border text-center rounded option-cell" :class="questions[currentIndex].ans === '1' ? 'bg-success text-white' : 'bg-danger'">
                    [[ questions[currentIndex].op1 ]]
                </div>
                <div class="col border text-center rounded option-cell" :class="questions[currentIndex].ans === '2' ? 'bg-success text-white' : 'bg-danger'">
                    [[ questions[currentIndex].op2 ]]
                </div>
            </div>
            <div class="row">
                <div class="col border text-center rounded option-cell" :class="questions[currentIndex].ans === '3' ? 'bg-success text-white' : 'bg-danger'">
                    [[ questions[currentIndex].op3 ]]
                </div>
                <div class="col border text-center rounded option-cell" :class="questions[currentIndex].ans === '4' ? 'bg-success text-white' : 'bg-danger'">
                    [[ questions[currentIndex].op4 ]]
                </div>
            </div>
            <br>
            <div class="row">
            <div class="col"></div>
            <div class="col">
            <button type="button" class="btn btn-danger ms-auto" @click="deleteques(questions[currentIndex].id)">Delete question</button>
            </div>
            </div>
            <br>


            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 500px; margin: auto; position: relative;">
                <button v-if="currentIndex > 0" 
                    @click="prevQuestion" 
                    style="font-size: 24px; width: 45px; height: 45px; border: none; background:rgb(245, 124, 54); color: white; border-radius: 50%; cursor: pointer; position: absolute; left: -300px;">
                    ←
                </button>

                <button v-if="currentIndex < questions.length - 1" 
                    @click="nextQuestion" 
                    style="font-size: 24px; width: 45px; height: 45px; border: none; background:rgb(245, 124, 54); color: white; border-radius: 50%; cursor: pointer; position: absolute; right: -300px;">
                    →
                </button>
            </div>

          
        </div>
        <p v-else>No questions available.</p>
      </div>
      <style>
            .popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .popup {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
                width: 350px;
                text-align: center;
                position: relative;
            }
            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: red;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 18px;
                border-radius: 50%;
            }
            .nav-btn {
                background: #007bff;
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                border-radius: 50%;
            }
            .nav-btn.left {
                left: 10px;
            }
            .nav-btn.right {
                right: 10px;
            }
        </style>
    </div>
  `,
  data() {
    return {
      showPopup: false,
      questions: [],
      currentIndex: 0, 
    };
  },
  methods: {
    async fetchQuestions() {
        try {
            const data = await fetch(`${origin}/api/questions/${this.quizid}`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            });
            if (data.ok) {
                this.questions = await data.json();
                this.currentIndex = 0; 
                this.showPopup = true; 
            } 
            else {
                this.questions = [];
                console.log(await data.json());
            }
        } 
        catch (error) {
            alert("Network error, please try again later");
        }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
      }
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    async deleteques(deleted_id) {
        if (this.questions.length == 1) {
            alert("quiz needs at least one question");
        }
        else {
            try {
                const data = await fetch(`${origin}/api/questions/${deleted_id}`, {
                    method : 'DELETE',
                    headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
                });
                if(data.ok) {
                    const res = await data.json()
                    console.log(res)
                    this.showPopup = false;
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
  },
}



