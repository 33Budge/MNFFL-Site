
async function genYearButtons(year) {
    container = document.getElementById("yearButtons");
    container.innerHTML = "";
    for(let i = 0; i < years.length; i++) {
        const btn = document.createElement("button");
        btn.textContent = years[i];
        btn.classList.add("roster-button");
        btn.onclick = () => displayRosters(years[i]);
        container.appendChild(btn);
    }
}

async function displayRosters(year) {
    const container = document.getElementById("rosterContainer");

    container.innerHTML = "";

    for (let i = 0; i < leagueSettings[year]["total_rosters"]; i++) {
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("teamcard");

        const teamTitle = document.createElement("h2");
        if (teams[i][year]["teamName"] == undefined) {
            teamTitle.textContent = teams[i][year]["displayName"];
        } else {
            teamTitle.textContent = teams[i][year]["teamName"];
        }
        
        const starterList = document.createElement("ul");
        for (let j = 0; j < teams[i][year]["starters"].length; j++) {
            const li = document.createElement("li");
            li.textContent = leagueSettings[year]["roster_positions"][j] + " " + getPlayerName(teams[i][year]["starters"][j]);
            starterList.appendChild(li);
        }

        const benchList = document.createElement("ul");
        for (let j = 0; j < teams[i][year]["bench"].length; j++) {
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
    await fetchAllYears(currentYearID);
    await initTeams();
    await loadPlayerDB();
    await fetchRosterData();
    await fetchUserData();
    await fetchLeagueData();
    await genYearButtons();
    await displayRosters(years[years.length - 1]);
    }

main();
console.log(teams);
console.log(leagueSettings);