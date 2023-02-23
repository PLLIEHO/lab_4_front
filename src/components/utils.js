function add(pointToAdd){
    const requestOptions = {
        method: 'PUT',
        data: {},
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(pointToAdd)
    };
    fetch('http://localhost:8080/lab_4_rest-1.0-SNAPSHOT/api/points/add', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (data.status === 401) {
                localStorage.setItem("answer", "false")
            } else {
                console.log('Точка добавлена')
                localStorage.setItem("answer", "true")
            }
        })
}

function loader(){
    let tokenToSend = {
        token: parseInt(localStorage.getItem("token"))
    }
    const requestOptions = {
        method: 'POST',
        data: {},
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(tokenToSend)
    };
    fetch('http://localhost:8080/lab_4_rest-1.0-SNAPSHOT/api/points/load', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (data.status === 401) {
                localStorage.setItem("answer", "false")
            } else if (data.status===200){
                localStorage.setItem("answer", "true")
            }
        })
}

export {add, loader}