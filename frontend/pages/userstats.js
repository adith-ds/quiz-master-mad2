export default {
    template: `
    <div class="container">
        <h1>Your Statistics</h1>
        <div class="stats">
            <p><strong>Quizzes Attempted:</strong> [[ stats.quizzes_attempted ]]</p>
        </div>
        
        <canvas id="userQuizPerformanceChart"></canvas>
        <canvas id="userTimeTakenChart"></canvas>
    </div>
    `,
    data() {
        return {
            stats: {
                quizzes_attempted: 0
            },
            quizPerformance: [],
            timeTaken: []
        };
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
                    this.stats.quizzes_attempted = data.quizzes_attempted;
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
        }
    }
};
