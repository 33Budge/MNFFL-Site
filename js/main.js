let currentYearID = '1183100419290038272';
let numOfTeams = 0;
let yearIDs = [];
let yearIDstest = [];
let years = []; 
const teams = [];
let leagueSettings = [];

async function fetchAllYears(leagueID) {
    const response = await fetch("https://api.sleeper.app/v1/league/" + leagueID);
    const data = await response.json();
    yearIDs.unshift(data.league_id);
    years.unshift(data.season);
    if (data.settings.num_teams > numOfTeams) {
        numOfTeams = data.settings.num_teams;
    }
    if (data.previous_league_id == null){

    } else {
        await fetchAllYears(data.previous_league_id);
    }
}

function initTeams() {
    for (i = 0; i < numOfTeams; i++) {
        teams.push({rosterId: i + 1});
        for (j = 0; j < years.length; j++) {
            teams[i][years[j]] = {};
        }
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
            for (k = 0; k < teams.length; k++) { // maybe uneccesary but this finds what team each element in data is linked with
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

async function loadPlayerDB() { //probably bad because you need to fetch 5MB everytime, maybe?

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
}
