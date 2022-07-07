let form = document.getElementById('form')

form.addEventListener('submit', async (e) =>{
    e.preventDefault()
    console.log("good")
    const title         = form.title.value
    const datePublished = form.datePublished.value
    const author        = form.author.value
    try{
        const res = await fetch('/books/add',{
            method:'POST',
            body:JSON.stringify({title,datePublished,author}),
            headers: {'Content-Type':'application/json'}
        })
        const data =await res.json()
        console.log(data)
    }catch(err){
        console.log(err)
    }
})