export default {
    props : ['id', 'name', 'desc'],
    template :`
    <div class="jumbotron card">
    <h1 class="card-title" @click="$router.push('/subject/' + id)">[[ name ]]</h1>
    <p class="card-text">[[ desc ]]</p>
    <br>
    </div>
    <br>
    `
}