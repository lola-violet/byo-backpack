// add item to event 
const claimChecks = document.querySelectorAll(".claimCheck")
for (const check of claimChecks) {
    check.addEventListener('click', e => {
        const obj = {
            bring: false
        }
        if(e.target.checked) {
            obj.bring = true;
        }
        fetch(`/api/items/${e.target.id}`, {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok) {
                location.reload(true);
            } else {
                alert("update failed, check if logged in")
            }
        })
    })
}

// user who click button is rsvp'ing for event
const rsvpBtn = document.querySelector("#rsvpBtn")
if (rsvpBtn) {
    rsvpBtn.addEventListener("click", e => {
        e.preventDefault();
        const obj = {
            rsvp_status: document.querySelector('#rsvp-choice').value
        }
        fetch(`/api/attendees/${e.target.value}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok) {
                location.reload()
            } else {
                alert("rsvp failed, check if logged in")
            }
        })
    })
}


const leaveBtn = document.querySelector("#leaveBtn")
if (leaveBtn) {
    //change default select to user's choice
    const userChoice = document.querySelector("#rsvp-choice").getAttribute('status');
    document.querySelector(`#option-${userChoice}`).setAttribute('selected', 'selected');

    // user who click button is un-rsvp from event
    leaveBtn.addEventListener("click", e => {
        e.preventDefault();
        const choice = document.querySelector('#rsvp-choice').value;
        // if take off list, delete, if not, just update
        if (choice == 4) {
            fetch(`/api/attendees/${e.target.value}`, {
                method: "DELETE",
            }).then(res => {
                if (res.ok) {
                    location.reload()
                } else {
                    alert("leave failed, check if logged in")
                }
            })
        } else {
            const obj = {
                rsvp_status: choice
            }
            fetch(`/api/attendees/${e.target.value}`, {
                method: "PUT",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.ok) {
                    location.reload()
                } else {
                    alert("rsvp failed, check if logged in")
                }
            })
        }
    })
}