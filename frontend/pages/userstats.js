export default {
    template: `
    <div class="container">
        <h1>Your Statistics</h1>
        <div class="stats">
            <p><strong>Quizzes Attempted:</strong> [[ quizzes_attempted ]]</p>
            <button :disabled="!isQuiz" type="button" class="btn btn-outline-success" @click="create_csv">Download scores</button>
        </div>
        <div v-if="isQuiz">
        <canvas id="userQuizPerformanceChart"></canvas>
        <canvas id="userTimeTakenChart"></canvas>
        </div>
        <div v-else><h1 class="display-3">Try out some quizzes <a @click="this.$router.push('/main')"><mark>now!</mark></a></h1></div>
    </div>
    `,
    data() {
        return {
            quizzes_attempted: 0,
            quizPerformance: [],
            timeTaken: []
        };
    },
    computed : {
        isQuiz() {
            return this.quizzes_attempted>0;
        }

    },
    async mounted() {
        await this.fetchUserStats();
        this.renderCharts();
    },
    methods: {
        async fetchUserStats() {
            try {
                const res = await fetch(`${origin}/api/stats/${this.$store.state.user_id}`, {
                    method : 'GET',
                    headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
                });
                if (res.ok) {
                    const data = await res.json();
                    this.quizzes_attempted = data.quizzes_attempted;
                    this.quizPerformance = data.quizPerformance;
                    this.timeTaken = data.timeTaken;
                }
            } catch (err) {
                console.error("Error fetching user stats", err);
            }
        },
        renderCharts() {
            const quizCtx = document.getElementById("userQuizPerformanceChart").getContext("2d");
            new Chart(quizCtx, {
                type: "bar",
                data: {
                    labels: this.quizPerformance.map(q => q.name),
                    datasets: [{
                        label: "Score Percentage",
                        data: this.quizPerformance.map(q => (q.obtained_score / q.total_score) * 100),
                        backgroundColor: "rgba(75, 192, 192, 0.5)"
                    }]
                }
            });

            const timeCtx = document.getElementById("userTimeTakenChart").getContext("2d");
            new Chart(timeCtx, {
                type: "line",
                data: {
                    labels: this.timeTaken.map(q => q.name),
                    datasets: [{
                        label: "Time Taken (s)",
                        data: this.timeTaken.map(q => q.time),
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    }]
                }
            });
        },
        async create_csv() {
            try {
                const res = await fetch(`${origin}/make-csv/${this.$store.state.user_id}`, {
                    method : 'GET',
                    headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
                });
                if (res.ok) {
                    const task_id = (await res.json()).task_id;
                    const inter = setInterval(async() => {
                        const resp = await fetch(`${origin}/get-csv/${task_id}`, {
                            method : 'GET',
                            headers: {'auth-token' : this.$store.state.auth_token}
                        });
                        if (resp.ok) {
                            console.log("file is ready");
                            window.open(`${origin}/get-csv/${task_id}`);
                            clearInterval(inter)
                        }
                    }, 100);
                }
            } catch (err) {
                console.error("Network error\nTry again later");
                alert("Network error\nTry again later")
            }
        }
    }
};
