
const storageKey = "fitTrackData";

function getData() {
    let data = JSON.parse(localStorage.getItem(storageKey));

    if (!data) {
        data = {
            completedWorkouts: [],
            activeWorkout: null,
            profile: {
                name: "FitTrack User",
                email: "fittrackuser@example.com",
                goal: "Build muscle, stay healthy, and feel great."
            }
        };

        saveData(data);
    }

    return data;
}

function saveData(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function startWorkout() {
    window.location.href = "workOut.html";
}

function pushUps() {
    window.location.href = "workOut.html";
}

function squats() {
    window.location.href = "workOut.html";
}

function planks() {
    window.location.href = "workOut.html";
}

function goHome() {
    window.location.href = "gymApp.html";
}


function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function loadWorkouts() {
    const cards = document.querySelectorAll(".workout-card[data-id]");

    cards.forEach(card => {
        const id = card.dataset.id;
        const button = card.querySelector(".workout-btn");

        if (!button) return;

        button.addEventListener("click", function () {
            let data = getData();

            const completedToday = data.completedWorkouts.some(workout =>
                workout.id === id &&
                workout.date === getDateKey(new Date())
            );

            if (completedToday) return;

            if (data.activeWorkout === id) {

                const workout = {
                    id: id,
                    name: card.querySelector("h2").textContent,
                    date: getDateKey(new Date()),
                    calories: id === "pushups" ? 35 :
                              id === "squats" ? 45 : 20
                };

                data.completedWorkouts.push(workout);
                data.activeWorkout = null;

                saveData(data);

                alert("Workout completed! Great job!");

            } else {

                data.activeWorkout = id;
                saveData(data);

            }

            loadWorkoutStatuses();
        });

    });

    loadWorkoutStatuses();
}


function loadWorkoutStatuses() {
    const data = getData();

    document.querySelectorAll(".workout-card[data-id]").forEach(card => {
        const id = card.dataset.id;
        const status = card.querySelector(".workout-status");
        const button = card.querySelector(".workout-btn");

        const completedToday = data.completedWorkouts.some(workout =>
            workout.id === id &&
            workout.date === getDateKey(new Date())
        );

        if (completedToday) {
            status.textContent = "Completed";
            status.style.color = "#55aa00";

            button.textContent = "Completed";
            button.disabled = true;

        } else if (data.activeWorkout === id) {
            status.textContent = "In Progress";
            status.style.color = "#55aa00";

            button.textContent = "Complete";

        } else {
            status.textContent = "Not Started";
            status.style.color = "#777";

            button.textContent = "Start";
            button.disabled = false;
        }
    });
}



function loadProgress() {
    const totalWorkouts = document.getElementById("total-workouts");
    const totalStreak = document.getElementById("total-streak");
    const totalCaloriesElement = document.getElementById("total-calories");

    if (!totalWorkouts || !totalStreak || !totalCaloriesElement) {
        return;
    }

    const data = getData();
    const workouts = data.completedWorkouts;

    const totalCalories = workouts.reduce((total, workout) => {
        return total + workout.calories;
    }, 0);

    totalWorkouts.textContent = workouts.length;
    totalCaloriesElement.textContent = totalCalories;

    const days = [...new Set(workouts.map(workout => workout.date))];

    let streak = 0;
    let checkDate = new Date();

    if (!days.includes(getDateKey(checkDate))) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (days.includes(getDateKey(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    totalStreak.textContent = streak;

    loadWeeklyChart(workouts);
    loadRecentWorkouts(workouts);
}


function loadWeeklyChart(workouts) {
    const chart = document.getElementById("weekly-chart");

    if (!chart) return;

    chart.innerHTML = "";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();
    const week = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateKey = getDateKey(date);

        const count = workouts.filter(workout =>
            workout.date === dateKey
        ).length;

        week.push({
            day: days[date.getDay()],
            count: count
        });
    }

    const highest = Math.max(...week.map(day => day.count), 1);

    week.forEach(day => {
        const height = (day.count / highest) * 100;

        const item = document.createElement("div");
        item.className = "chart-item";

        item.innerHTML = `
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${height}%"></div>
            </div>
            <p>${day.day}</p>
            <small>${day.count}</small>
        `;

        chart.appendChild(item);
    });
}


function loadRecentWorkouts(workouts) {
    const list = document.getElementById("recent-workouts");

    if (!list) return;

    list.innerHTML = "";

    const recent = [...workouts].reverse().slice(0, 5);

    if (recent.length === 0) {
        list.innerHTML = "<p>No completed workouts yet.</p>";
        return;
    }

    recent.forEach(workout => {
        const item = document.createElement("div");
        item.className = "recent-item";

        item.innerHTML = `
            <div>
                <h3>${workout.name}</h3>
                <p>${workout.date}</p>
            </div>
            <span>Completed</span>
        `;

        list.appendChild(item);
    });
}


function loadProfile() {
    
    
    const data = getData();
    const profile = data.profile;

    const name = document.getElementById("profile-name");
    const email = document.getElementById("profile-email");
    const goal = document.getElementById("profile-goal");

    const displayName = document.getElementById("display-name");

if (displayName) {
    displayName.textContent = profile.name;
}
    

    if (!name || !email || !goal) return;

    name.value = profile.name;
    email.value = profile.email;
    goal.value = profile.goal;

    const editButton = document.getElementById("edit-profile-btn");
    const form = document.getElementById("profile-form");

    if (!editButton || !form) return;

    editButton.addEventListener("click", function () {
        const inputs = form.querySelectorAll("input, textarea");

        inputs.forEach(input => {
            input.disabled = false;
        });

        editButton.textContent = "Save Changes";
        editButton.type = "submit";
        
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = getData();

        data.profile = {
            name: name.value,
            email: email.value,
            goal: goal.value
        };

        saveData(data);
        displayName.textContent = data.profile.name;

        const inputs = form.querySelectorAll("input, textarea");

        inputs.forEach(input => {
            input.disabled = true;
        });

        editButton.textContent = "Edit Profile";
        editButton.type = "button";

        alert("Profile updated successfully!");
    });
}


document.addEventListener("DOMContentLoaded", function () {
    loadWorkouts();
    loadProgress();
    loadProfile();
});
