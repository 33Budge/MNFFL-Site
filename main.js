let year2022 = '779087239882874880';
let year2023 = '916390138647785472';
let year2024 = '1048344081149054976';
let year2025 = '1183100419290038272';
let years = [2022, 2023, 2024, 2025];
let yearIDs = ['779087239882874880', '916390138647785472', '1048344081149054976', '1183100419290038272'];
let yearCurrent = years[years.length - 1];

let jsonTeams = [];

const teams = [
    {number: 1},
    {number: 2},
    {number: 3},
    {number: 4},
    {number: 5},
    {number: 6},
    {number: 7},
    {number: 8},
    {number: 9},
    {number: 10},
    {number: 11},
    {number: 12}
]

function addVariable (teamNumber, varName, varValue) {
    const index = teamNumber - 1;
    teams[index][varName] = varValue;
}

function addToVariable (teamNumber, varName, varValue) {
    const index = teamNumber - 1;
    teams[index][varName].push(varValue); //problematic?????????
}


async function fetchOwnerData() { //trashcode for getting past owners with a bad way of getting around years with differnt numbers of teams
    for(let i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        data.forEach(roster => {
            if (i == 0) {
                addVariable(roster.roster_id, "ownerLog", [roster.owner_id]);
                teamsAdded = roster.roster_id;
            } else {

                if (i == 1 && teamsAdded < roster.roster_id) { //dogshit code
                    addVariable(roster.roster_id, "ownerLog", [roster.owner_id]);
                    teamsAdded = roster.roster_id;
                }
                if (!teams[roster.roster_id - 1]["ownerLog"].includes(roster.owner_id)) {
                    addToVariable(roster.roster_id, "ownerLog", roster.owner_id);
                }
            }
        });
    }
}

async function fetchRosterData() {
    for(i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        data.forEach(roster => {
            addVariable(roster.roster_id, "starters" + years[i], roster.starters);
            addVariable(roster.roster_id, "players" + years[i], roster.players);
            addVariable(roster.roster_id, "metadata" + years[i], roster.settings)
        });
    }
}

async function fetchCurrUserData() {
    const teamResponse = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[years.length - 1] + "/users"); 
    const teamData = await teamResponse.json();
    teamData.forEach(user => {
            for (i = 0; i < teams.length; i++) {
                if (teams[i].ownerLog.includes(user.user_id)) {
                    if (user.metadata.team_name != undefined) {
                        addVariable(teams[i].number, "currTeamName", user.metadata.team_name);
                        
                    } else {
                        addVariable(teams[i].number, "currTeamName", user.display_name); //the "Rich Sohn" line
                    }
                    if (user.metadata.avatar != undefined) {
                        addVariable(teams[i].number, "teamAvatar", user.metadata.avatar);
                    } else {
                        addVariable(teams[i].number, "avatarNum", user.avatar);//the "Rich Sohn" line + Noah
                    }
                }
            }
    });


    for(i = 0; i < teams.length; i++){
        console.log(teams[i]);
    }
}

async function main() {
    await fetchOwnerData();
    await fetchCurrUserData();
    await fetchRosterData();
}

main();

if (window.location.pathname.endsWith("rosters.html")) {
    /* fetch("https://api.sleeper.app/v1/league/779087239882874880/rosters")
    .then(response => response.json())
    .then(data => {
        data.forEach(roster => {
            console.log(roster.owner_id);
            });
        data.forEach(roster => {
            console.log(roster.roster_id);
        });
        })
    .catch(error => console.error(error)); */

    function genYearButtons(year) {
        container = document.getElementById("yearButtons");
        container.innerHTML = "";

        years.forEach(year => {
            const btn = document.createElement("button");
            btn.textContent = year;
            btn.classList.add("roster-button");
            btn.onclick = () => displayYear(year);
            container.appendChild(btn);
        
        });
    }
    function displayYear(year) {

    }

    displayYear(yearCurrent);
    genYearButtons();

    document.getElementById("demo").innerHTML =" <h2> Hello World</h2>";

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
