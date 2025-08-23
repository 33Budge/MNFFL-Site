
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

async function genYearDropdown() {
    const container = document.getElementById("yearButtons"); 
    container.innerHTML = "";

    const select = document.createElement("select");
    select.classList.add("roster-dropdown");

    const placeholderOption = document.createElement("option");
    placeholderOption.textContent = "Select a year";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    for (let i = 0; i < years.length; i++) {
        const option = document.createElement("option");
        option.value = years[i];
        option.textContent = years[i];
        select.appendChild(option);
    }

    select.onchange = (e) => {
        displayRosters(e.target.value);
    };

    container.appendChild(select);
}


async function displayRosters(year) {
    const container = document.getElementById("rosterContainer");

    container.innerHTML = "";

    for (let i = 0; i < leagueSettings[year]["total_rosters"]; i++) {
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("teamcard");

        const teamTitle = document.createElement("h2");
        const userTitle = document.createElement("h3");

        if(teams[i][year]["ownerId"] == teams[i][years[years.length - 1]]["ownerId"]) { //only works with teams that are within the current year
            displayName = teams[i][years[years.length - 1]]["displayName"];
        } else {
            displayName = teams[i][year]["displayName"];
        }


        if (teams[i][year]["teamName"] == undefined) {
            teamTitle.textContent = teams[i][year]["displayName"];
            userTitle.textContent = displayName;
        } else {
            teamTitle.textContent = teams[i][year]["teamName"];
            userTitle.textContent = displayName;
        }


        
        const starterList = document.createElement("ul");
        for (let j = 0; j < teams[i][year]["starters"].length; j++) {
            const li = document.createElement("li");
           /*  li.textContent = leagueSettings[year]["roster_positions"][j] + " " + getPlayerName(teams[i][year]["starters"][j]); */
           const pos =  leagueSettings[year]["roster_positions"][j];
           const name = getPlayerName(teams[i][year]["starters"][j]);
           li.innerHTML = "<span class='" + pos + "'>" + pos + "</span> " + "<span class='player'>" + name + "</span>";
            starterList.appendChild(li);
        }

        const benchList = document.createElement("ul");
        for (let j = 0; j < teams[i][year]["bench"].length; j++) {
            const li = document.createElement("li");
            /* li.textContent = getPlayerPos(teams[i][year]["bench"][j]) + " " + getPlayerName(teams[i][year]["bench"][j]); */
            const pos = li.textContent = getPlayerPos(teams[i][year]["bench"][j]);
            const name = getPlayerName(teams[i][year]["bench"][j]);
            li.innerHTML = "<span class='" + pos + "'>" + pos + "</span> " + "<span class='player'>" + name + "</span>";
            benchList.appendChild(li);
        }

        teamDiv.appendChild(teamTitle);
        teamDiv.appendChild(userTitle);
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
    //await genYearButtons();
    await genYearDropdown();
    await displayRosters(years[years.length - 1]);
    }

main();
console.log(teams);
console.log(leagueSettings);