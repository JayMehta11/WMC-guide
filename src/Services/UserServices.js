async function getUsers(search=""){
    return fetch('http://localhost:5000/api/auth/get',{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            search: search
        })
    }).then(res => res.json()).catch(err => {
        return {
            status: false,
            message: "Unable to get Students"
        }
    })
}

export {getUsers}