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
    for (j = 0; j < years.length; j++) {
        teams[i][years[j]] = {};
    }
}

async function fetchRosterData () {
    for (i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i] + "/rosters"); 
        const data = await response.json();
        for (j = 0; j < data.length; j++) {
            teams[j][years[i]]["ownerId"] = data[j].owner_id;
            teams[j][years[i]]["starters"] = data[j].starters;
            teams[j][years[i]]["players"] = data[j].players;
            teams[j][years[i]]["metadata"] = data[j].settings;
            teams[j][years[i]]["bench"] = [];
        }
    }
}

async function fillBenches() {
    for (i = 0; i < years.length; i++) {
        for (j = 0; j < teams.length; j++) {
            if (teams[j] && teams[j][years[i]] && Array.isArray(teams[j][years[i]]["players"])) {
                for (k = 0; k < teams[j][years[i]]["players"].length; k++) {
                    if(!teams[j][years[i]]["starters"].includes(teams[j][years[i]]["players"][k])) { //i feel like its getting a little unreadable here
                        teams[j][years[i]]["bench"].push(teams[j][years[i]]["players"][k]);
                    }
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
            teams[j][years[i]]["teamName"] = data[j].metadata.team_name;
            teams[j][years[i]]["displayName"] = data[j].display_name; //the "Rich Sohn" line
            teams[j][years[i]]["teamAvatar"] = data[j].metadata.avatar;
            teams[j][years[i]]["avatarId"] = data[j].avatar; //the "Rich Sohn" line + Noah
        }
    }
}

console.log(teams);

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



            teamDiv.appendChild(teamTitle);
            
            const starterList = document.createElement("ul");
            for (j = 0; j < teams[i][year]["starters"].length; j++) {
                const li = document.createElement("li");
                li.textContent = teams[i][year]["starters"][j];
                starterList.appendChild(li);
            }


            const benchList = document.createElement("ul");
            for (j = 0; j < teams[i][year]["bench"].length; j++) {
                const li = document.createElement("li");
                li.textContent = teams[i][year]["bench"][j];
                benchList.appendChild(li);
            }


            teamDiv. appendChild(starterList);
            teamDiv. appendChild(benchList);
            container.appendChild(teamDiv);
        }
    }

    async function main() {
        await fetchRosterData();
        await fetchUserData();
        await fillBenches();
        await displayYear(years[years.length - 1]);
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
