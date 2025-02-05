export default {
    template : `
    <div class="container" id="central">
    <h2 align="center" class="display-2">Welcome to Quizzy</h2>
    <p class="lead">
    Dive into the world of interactive learning with quizzes tailored for every subject and chapter. Whether you're mastering a new concept or revisiting old ones, Quizzy ensures you stay on top of your game!  
    </p>
    <p>
    <h4 class="display-4">Why Choose Quizzy?</h4>
    <ul>
    <li>Explore Multiple Subjects: From science to history, each subject is broken into chapters, and every chapter features quizzes designed to test and reinforce your knowledge.</li>
    <li>Track Your Progress: Visualize your learning journey with detailed summary charts that showcase your quiz performance. Identify strengths and areas for improvement at a glance!</li>
    <li>Stay Motivated: Enable daily reminders to keep your learning consistent. A little progress each day adds up to big results!  </li>
    <li>Monthly Progress Reports: Receive comprehensive insights into your performance every month. Celebrate milestones and plan for the next step in your learning adventure. </li>
    </ul>
    <h4 class="display-4">How It Works</h4>
    <ol>
    <li>Select a Subject: Choose from a variety of topics to match your interests and goals.</li>
    <li>Pick a Chapter: Narrow down to the specific area you want to focus on.</li>
    <li>Attempt Quizzes: Engage in fun, challenging quizzes designed to help you master concepts effectively.</li>
    <li>Track and Improve: Use our analytics tools and reports to monitor your growth over time. </li>
    </ol>
    <br>
    </p>
    <h1 align="center">Start Quizzing Today!</h1>
    <br>
    <p class="text-end"><small><div @click="secretLogin">admin login</div></small></p>
    </div>
    `,
    methods : {
        secretLogin() {
            this.$router.push('/secretlogin')
        }
    }
}


