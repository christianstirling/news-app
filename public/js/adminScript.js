
const deleteForms = document.querySelectorAll('.delete-form')
console.log(deleteForms.length)


deleteForms.forEach(form => {
    form.addEventListener('submit', (event) => {
        const confirmed = confirm('You sure about that?')
        if(!confirmed) {
            event.preventDefault()
        }
    })
    
})