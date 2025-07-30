let numOfTeams = 12; //what what the most teams you ever had in this league at one time?
let firstYear = 2022; //first year you started using sleeper for this league
let lastYear = 2025; //last or current year of usign sleepr for this league
let yearIDs = ['779087239882874880', '916390138647785472', '1048344081149054976', '1183100419290038272']; //paste in each league id for each of your years in sleeper
let years = [];
const teams = [];
let leagueSettings = [];

for (i = 0; i <= lastYear - firstYear; i++) {
    years.push(firstYear + i);
}

for (i = 0; i < numOfTeams; i++) {
    teams.push({number: i + 1});
}

for (i = 0; i < numOfTeams; i++) {
    for (j = 0; j < years.length; j++) {
        teams[i][years[j]] = {};
    }
}

async function fetchRosterData () {
    for (i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        for (j = 0; j < data.length; j++) {
            teamIdx = data[j].roster_id - 1;
            teams[teamIdx][years[i]]["ownerId"] = data[j].owner_id;
            teams[teamIdx][years[i]]["starters"] = data[j].starters;
            teams[teamIdx][years[i]]["players"] = data[j].players;
            teams[teamIdx][years[i]]["metadata"] = data[j].settings;
            teams[teamIdx][years[i]]["bench"] = [];
            for (k = 0; k < teams[teamIdx][years[i]]["players"].length; k++) { // maybe bad, too many things in 1 function, but i fill the benches here
                if(!teams[teamIdx][years[i]]["starters"].includes(teams[teamIdx][years[i]]["players"][k])) { //i feel like its getting a little unreadable here
                    teams[teamIdx][years[i]]["bench"].push(teams[teamIdx][years[i]]["players"][k]);
                }
            }
        }
    }
}

async function fetchUserData() {
    for (i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/users");
        const data = await response.json();
        for (j = 0; j < data.length; j++) {
            for (k = 0; k < teams.length; k++) {
                if (teams[k][years[i]]["ownerId"] == data[j].user_id) {
                    teamIdx = k;
                }
            }
            teams[teamIdx][years[i]]["teamName"] = data[j].metadata.team_name;
            teams[teamIdx][years[i]]["displayName"] = data[j].display_name; //the "Rich Sohn" line
            teams[teamIdx][years[i]]["teamAvatar"] = data[j].metadata.avatar;
            teams[teamIdx][years[i]]["avatarId"] = data[j].avatar; //the "Rich Sohn" line + Noah
        }
    }
}

async function fetchLeagueData() {
    for (i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i]);
        const data = await response.json();
        leagueSettings[years[i]] = data;
    }
}

async function loadPlayerDB() { //probably bad because you need to fetch 5MB everytime
    console.log("fetching playersDB");
    const res = await fetch("players.json");
    const data = await res.json();
    playerDB = data;
}

function getPlayerName(id) {
    if (isNaN(id)) {
        return id;
    } else if(playerDB && playerDB[id]) {
        return playerDB[id].full_name;
    } else {
        console.log(id + " not found ");
        return id;
    }
}

function getPlayerPos(id) {
    if (isNaN(id)) {
        return "DEF";
    } else if(playerDB && playerDB[id]) {
        return playerDB[id].position;
    }
    console.log(playerDB[id] + " not found ");
}

console.log(teams);
console.log(leagueSettings);

if (window.location.pathname.endsWith("rosters.html")) {
    async function genYearButtons(year) {
        container = document.getElementById("yearButtons");
        container.innerHTML = "";

        years.forEach(year => {
            const btn = document.createElement("button");
            btn.textContent = year;
            btn.classList.add("roster-button");
            btn.onclick = () => displayRosters(year);
            container.appendChild(btn);
        
        });
    }

    async function displayRosters(year) {
        const container = document.getElementById("rosterContainer");

        container.innerHTML = "";

        for (i = 0; i < teams.length; i++) {
            const teamDiv = document.createElement("div");
            teamDiv.classList.add("teamcard");

            const teamTitle = document.createElement("h2");
            if (teams[i][year]["teamName"] == undefined) {
                teamTitle.textContent = teams[i][year]["displayName"];
            } else {
                teamTitle.textContent = teams[i][year]["teamName"];
            }
            
            const starterList = document.createElement("ul");
            for (j = 0; j < teams[i][year]["starters"].length; j++) {
                const li = document.createElement("li");
                li.textContent = leagueSettings[year]["roster_positions"][j] + " " + getPlayerName(teams[i][year]["starters"][j]);
                starterList.appendChild(li);
            }

            const benchList = document.createElement("ul");
            for (j = 0; j < teams[i][year]["bench"].length; j++) {
                const li = document.createElement("li");
                li.textContent = getPlayerPos(teams[i][year]["bench"][j]) + " " + getPlayerName(teams[i][year]["bench"][j]);
                benchList.appendChild(li);
            }

            teamDiv.appendChild(teamTitle);
            teamDiv.appendChild(starterList);
            teamDiv.appendChild(benchList);
            container.appendChild(teamDiv);
        }
    }

    async function main() {
        await loadPlayerDB();
        await fetchRosterData();
        await fetchUserData();
        await fetchLeagueData();
        await displayRosters(years[years.length - 1]);
    }

    main();
    genYearButtons();

}

if (window.location.pathname.endsWith("players.html")) {
    fetch("https://api.sleeper.app/v1/league/1183100419290038272")
    .then(response => response.json())
    .then(data => console.log(data.league_id))
    .catch(error => console.error(error));
}
if (window.location.pathname.endsWith("headtohead.html")) {
    fetch("https://api.sleeper.app/v1/league/1183100419290038272")
    .then(response => response.json())
    .then(data => console.log(data.league_id))
    .catch(error => console.error(error));
}
if (window.location.pathname.endsWith("teams.html")) {
    fetch("https://api.sleeper.app/v1/league/1183100419290038272")
    .then(response => response.json())
    .then(data => console.log(data.league_id))
    .catch(error => console.error(error));
}
if (window.location.pathname.endsWith("data.html")) {
    fetch("https://api.sleeper.app/v1/league/1183100419290038272")
    .then(response => response.json())
    .then(data => console.log(data.league_id))
    .catch(error => console.error(error));
}
