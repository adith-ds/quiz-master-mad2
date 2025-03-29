export default {
    template : `
    <div class="container" id="central">
    <h1 class="display-1">Users</h1>
    <br>
    <table class="table">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Username</th>
      <th scope="col">Email</th>
      <th scope="col">Date of birth</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(u, index) in users">
      <th scope="row">[[ index + 1 ]]</th>
      <td>[[ u.username ]]</td>
      <td>[[ u.email ]]</td>
      <td>[[ u.dob ]]</td>
    </tr>
    </tbody>
    </table>
    </div>
    `,
    data() {
        return {
            c : 1,
            users : [],
        }
    },
    async mounted() {
        try {
            const data = await fetch(origin+'/api/userlist', {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            })
            if(data.ok) {
                this.users = await data.json()
            }
            else {
                console.log("error")
            }
        }
        catch (err) {
            console.log("network error, please try again later")
        }
    },
}