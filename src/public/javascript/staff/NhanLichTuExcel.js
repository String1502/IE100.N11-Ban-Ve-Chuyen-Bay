let form = document.getElementById('form-excel');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    console.log(formData);

    axios.post('/flight/addFromexcel', formData).then((res) => {
        console.log(res.data);
    });
});
