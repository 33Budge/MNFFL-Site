let numOfTeams = 12; //what what the most teams you ever had in this league at one time?
let firstYear = 2022; //first year you started using sleeper for this league
let lastYear = 2025; //last or current year of usign sleepr for this league
let yearIDs = ['779087239882874880', '916390138647785472', '1048344081149054976', '1183100419290038272']; //paste in each league id for each of your years in sleeper
let years = [];
const teams = [];

for (i = 0; i <= lastYear - firstYear; i++) {
    years.push(firstYear + i);
}

for (i = 0; i < numOfTeams; i++) {
    teams.push({number: i + 1});
}

for (i = 0; i < numOfTeams; i++) {
    for (j = firstYear; j < lastYear + 1; j++) {
        addVariable(i, j, {});
    }
}

function addVariable (teamIndex, varName, varValue) {
    teams[teamIndex][varName] = varValue;
}

function addToVariable (teamIndex, varName, varValue) {
    teams[teamIndex][varName].push(varValue); 
}



async function fetchOwnerData () {
    for (i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        for (j = 0; j < data.length; j++) {
            teams[j][years[i]] // find out how to add to a team in teams but in that team a year and in that year add a variable named rosterID which is of the value data[j].roster_id
        }
    }
}


console.log(teams);
/* async function fetchOwnerData() { //trashcode for getting past owners with a bad way of getting around years with differnt numbers of teams
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
} */

/* async function fetchRosterData() {
    for(i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        data.forEach(roster => {
            addVariable(roster.roster_id, "starters" + years[i], roster.starters);
            addVariable(roster.roster_id, "players" + years[i], roster.players);
            addVariable(roster.roster_id, "metadata" + years[i], roster.settings);
        });
    }
} */

/* async function fetchCurrUserData() {
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
} */

if (window.location.pathname.endsWith("rosters.html")) {
    async function genYearButtons(year) {
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


    async function displayYear(year) {
        var output;
        for(i = 0; i < teams.length; i++) {

        }
    }

    async function main() {
        await fetchOwnerData();
/*         await fetchCurrUserData();
        await fetchRosterData();
        await displayYear(yearCurrent); */
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
