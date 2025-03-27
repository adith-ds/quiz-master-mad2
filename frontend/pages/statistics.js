export default {
    template: `
    <div class="container">
        <h1>Site Statistics</h1>
        <div class="stats">
            <p><strong>Users:</strong> [[ stats.users ]]</p>
            <p><strong>Subjects:</strong> [[ stats.subjects ]]</p>
            <p><strong>Chapters:</strong> [[ stats.chapters ]]</p>
            <p><strong>Quizzes:</strong> [[ stats.quizzes ]]</p>
        </div>
        
        <canvas id="quizPerformanceChart"></canvas>
        <canvas id="timeDistributionChart"></canvas>
        <canvas id="userPerformanceChart"></canvas>
    </div>
    `,
    data() {
        return {
            stats: {
                users: 0,
                subjects: 0,
                chapters: 0,
                quizzes: 0
            },
            quizPerformance: [],
            timeDistribution: [],
            userPerformance: []
        };
    },
    async mounted() {
        await this.fetchStats();
        this.renderCharts();
    },
    methods: {
        async fetchStats() {
            try {
                const res = await fetch(`${origin}/api/statistics`, {
                    method : 'GET',
                    headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
                });
                if (res.ok) {
                    const alldata = await res.json();
                    this.stats.users = alldata.users
                    this.stats.subjects = alldata.subjects
                    this.stats.chapters = alldata.chapters
                    this.stats.quizzes = alldata.quizzes
                    this.quizPerformance = alldata.quizPerformance;
                    this.timeDistribution = alldata.timeDistribution;
                    this.userPerformance = alldata.userPerformance;


                }
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        },
        renderCharts() {
            const quizCtx = document.getElementById("quizPerformanceChart").getContext("2d");
            new Chart(quizCtx, {
                type: "bar",
                data: {
                    labels: this.quizPerformance.map(q => q.name),
                    datasets: [{
                        label: "Average Score",
                        data: this.quizPerformance.map(q => q.avg_score),
                        backgroundColor: "rgba(54, 162, 235, 0.5)"
                    }]
                }
            });

            const timeCtx = document.getElementById("timeDistributionChart").getContext("2d");
            new Chart(timeCtx, {
                type: "line",
                data: {
                    labels: ["Mean", "Median", "Mode"],
                    datasets: [{
                        label: "Time Taken (s)",
                        data: this.timeDistribution,
                        backgroundColor: "rgba(255, 159, 64, 0.5)"
                    }]
                }
            });

            const userCtx = document.getElementById("userPerformanceChart").getContext("2d");
            new Chart(userCtx, {
                type: "pie",
                data: {
                    labels: this.userPerformance.map(u => u.username),
                    datasets: [{
                        label: "Top Performers",
                        data: this.userPerformance.map(u => u.avg_score),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
                    }]
                }
            });
        }
    }
};
