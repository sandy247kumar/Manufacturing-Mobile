
const Netsuite = function () {

    this.get = async function () {

        throw new Error('Not Implmeneted');
    }

    this.post = async function (body) {
        try {
            const API_URL = "https://td2908586.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2052&deploy=1&compid=TD2908586&ns-at=AAEJ7tMQ_04zhyHg5sGhiv2wNMf2FsXMCvXv8OjmRoa_jU-wiqE"

            // Default options are marked with *
            const response = await fetch(API_URL, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(body), // body data type must match "Content-Type" header
            });

            return response.json(); // parses JSON response into native JavaScript objects

        } catch (error) {
            console.log("error in fetch", error);
            throw error;
        }
    }
}

export default Netsuite