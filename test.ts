//test login route with fetch

const login = async () => {
    const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: "juanPerez@gmail.com",
            password: "1234"
        }),
    });
    // const data = await response.json();
    // console.log(data);

    const cookies = response.headers.get("set-cookie");

    //get auth-token from cookies
    const token = cookies?.split("auth-token=")[1].split(";")[0];
    console.log(token);
};  

login();