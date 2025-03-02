export default {
    props : ['id', 'name'],
    template : `
    <div>
    <div class="card">
    <div class="card-header">
    [[ this.name ]]
    </div>
    <div class="card-body">
    <h5 class="card-title">Please add a question</h5>
    <label for="statement" class="form-label">Question statement</label>
    <input type="text" v-model="statement" class="form-control" id="statement">
    <br>
    <h6>Add options, select the correct option</h6>
    <br>
    <div class="row">
        <div class="col d-flex align-items-center gap-2">
        <input type="text" v-model="op1" class="form-control" @input="isTitle">
        <input type="radio" v-model="ans" :value="1">
        </div>
        <div class="col d-flex align-items-center gap-2">
        <input type="text" v-model="op2" class="form-control" @input="isTitle">
        <input type="radio" v-model="ans" :value="2">
        </div>
    </div>
    <br>
    <div class="row">
        <div class="col d-flex align-items-center gap-2">
        <input type="text" v-model="op3" class="form-control" @input="isTitle">
        <input type="radio" v-model="ans" :value="3">
        </div>
        <div class="col d-flex align-items-center gap-2">
        <input type="text" v-model="op4" class="form-control" @input="isTitle">
        <input type="radio" v-model="ans" :value="4">
        </div>
    </div>
    <br><br>
    <div class="row">
        <div class="col w-50">
            <button type="button" class="btn btn-success" @click="addQ">Add question</button>
        </div>
        <div class="col w-50">
            <button type="button" class="btn btn-warning" @click="finishQs">Finish</button>
        </div>
    </div>
    
    
    </div>
    </div>
    </div>
    `,
    data() {
        return {
            statement : null,
            op1 : null,
            op2 : null,
            op3 : null,
            op4 : null,
            ans : null
        }
    },
    methods : {
        isValid() {
            return this.statement && this.op1 && this.op2 && this.op3 && this.op4 && this.ans !== null;
        },
        async addQ() {
            if (this.isValid()) {
                try {
                    const res = await fetch(`${origin}/api/questions/${this.id}`, {
                        method : 'POST',
                        headers: {'Content-Type' : 'application/json',  'auth-token' : this.$store.state.auth_token},
                        body : JSON.stringify({
                            'statement' : this.statement,
                            'op1' : this.op1,
                            'op2' : this.op2,
                            'op3' : this.op3,
                            'op4' : this.op4,
                            'ans' : this.ans
                        })
                    });
                    if(res.ok) {
                        this.statement = ""
                        this.op1 = ""
                        this.op2 = ""
                        this.op3 = ""
                        this.op4 = ""
                        this.ans = null
                    }
                    else {
                        const data = await res.json();
                        const message = data['message'];
                        alert(message)
                    }
                }
                catch(err) {
                    alert("not added, try again")
                }

            }
            else {
                alert("please fill in all the details")
            }
        },
        finishQs() {
            this.$router.push(`/admin/chapter/${this.id}`)
        }
    }

}