import Subject from "./../components/subinfo.js"

export default {
    template : `
    <div class="container" id="central">
    <h1>Subjects</h1>
    <div id="passwordHelpBlock" class="form-text">
    Click on a heading to get more information
    </div>
    <div v-if="subjects">
    <Subject v-for="sub in subjects" :id="sub.id" :name="sub.name" :desc="sub.desc"></Subject>
    </div>
    <div v-else>No subjects found :&#40;</div>
    </div>
    `,
    data() {
        return {
        subjects : [],
        }
    },
    async mounted() {
        try {
            const data = await fetch(origin+'/api/subjects', {
                method : 'GET',
                headers: {'Content-Type' : 'application/json', 'auth-token' : this.$store.state.auth_token}
            })
            if(data.ok) {
                const subs = await data.json()
                this.subjects = subs
            }
            else {
                console.log("bruh")
            }
        }
        catch (err) {
            console.log("fail")
        }
    },
    components : {
    Subject,
    }
}