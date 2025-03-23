export default {
    name : 'Navbar',
    template : `
    <div>
    <nav class="navbar navbar-expand-lg" style="background-color: #8c80e4;">
    <div class="container-fluid">
    <span class="navbar-brand mb-0 h1">
      <img :src="imgsrc" alt="Quizzy" width="80.85" height="41.65">
    </span>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
        <router-link v-if="!this.$store.state.islogged" class="nav-link" to='/'>Home</router-link>
        </li>
        <li class="nav-item">
        <router-link v-if="!this.$store.state.islogged" class="nav-link" to='/login'>Login</router-link>
        </li>
        <li class="nav-item">
        <router-link v-if="!this.$store.state.islogged" class="nav-link" to='/register'>Register!</router-link>
        </li>
        <li class="nav-item">
        <router-link v-if="this.$store.state.islogged && this.$store.state.role==='user'" class="nav-link" to='/main'>Subjects</router-link>
        </li>
        <li class="nav-item">
        <router-link v-if="this.$store.state.islogged && this.$store.state.role==='admin'" class="nav-link" to='/admin/dashboard'>Dashboard</router-link>
        </li>
        <li class="nav-item">
        <router-link v-if="this.$store.state.islogged && this.$store.state.role==='admin'" class="nav-link" to='/admin/subjects'>Subjects</router-link>
        </li>
        <li class="nav-item">
        <router-link v-if="this.$store.state.islogged && this.$store.state.role==='admin'" class="nav-link" to='/admin/users'>Users</router-link>
        </li>
      </ul>
      <button v-if="this.$store.state.islogged" type="button" class="btn btn-danger ms-auto" @click="$store.commit('logout')" @click="this.$router.push('/')">Logout</button>
    </div>
    </div>
    </nav>
    </div>
    `,
    data() {
        return {
            imgsrc: '/static/images/logo.png'

        };
    }
};

