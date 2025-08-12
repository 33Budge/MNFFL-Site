async function generateBanner() {
    container = document.getElementById("banner");
    container.innerHTML = "";

    for(i = 0; i < years.length; i++) {
        const response = await fetch("https://api.sleeper.app/v1/league/" + yearIDs[i]);
        const data = await response.json();
        avatarId = data.avatar;
        
        const img = document.createElement("img");
        img.src = "https://sleepercdn.com/avatars/" + avatarId;
        img.alt = "League image for" +years[i];
        img.classList.add("LeagueImage", years[i]);
        container.appendChild(img);
    }
}


generateBanner();