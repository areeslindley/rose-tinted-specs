const opponents = [
    'Liverpool', 'Manchester City', 'Arsenal', 'Chelsea', 'Tottenham',
    'Newcastle United', 'Brighton', 'Aston Villa', 'West Ham',
    'Crystal Palace', 'Wolves', 'Leicester City', 'Everton',
    'Brentford', 'Fulham', 'Bournemouth', 'Sheffield United',
    'Burnley', 'Luton Town', 'Nottingham Forest', 'Barcelona',
    'Real Madrid', 'Bayern Munich', 'PSG', 'AC Milan', 'Juventus',
    'Inter Milan', 'Atletico Madrid', 'Dortmund', 'Ajax', 'Grimsby'
];

const victoryMessages = [
    'Absolutely demolished!',
    'Complete domination!',
    'Ruthless performance!',
    'Tactical masterclass!',
    'Goals galore!'
];

const defeatMessages = [
    'Completely outclassed!',
    'No answer to that!',
    'Torn apart!',
    'Defensive shambles!',
    'Humiliating defeat!'
];

function seedRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function isGrimsbyTeam(teamName) {
    return teamName.toLowerCase().includes('grimsby');
}

function formatDate(date) {
    const options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options);
}

function generateFixture(userTeam, fixtureNumber) {
    const isGrimsby = isGrimsbyTeam(userTeam);
    
    const opponentIndex = Math.floor(seedRandom(fixtureNumber * 7) * opponents.length);
    let opponent = opponents[opponentIndex];
    
    if (!isGrimsby && fixtureNumber === 7) {
        opponent = 'Grimsby';
    }

    const today = new Date();
    const daysToAdd = Math.floor(fixtureNumber / 2) * 7 + (fixtureNumber % 2) * 3 + 3;
    const matchDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));

    let userScore, opponentScore;

    if (isGrimsby) {
        userScore = Math.floor(seedRandom(fixtureNumber * 31) * 3);
        opponentScore = Math.floor(seedRandom(fixtureNumber * 37) * 8) + 3;
    } else {
        userScore = Math.floor(seedRandom(fixtureNumber * 13) * 8) + 3;
        
        if (opponent === 'Grimsby') {
            userScore = 10;
            opponentScore = 0;
        } else {
            opponentScore = seedRandom(fixtureNumber * 23) < 0.3 ? 
                Math.floor(seedRandom(fixtureNumber * 29) * 2) + 1 : 0;
        }
    }

    const isHome = (fixtureNumber % 2 === 0);
    const messageIndex = Math.floor(seedRandom(fixtureNumber * 17) * victoryMessages.length);
    const defeatMessageIndex = Math.floor(seedRandom(fixtureNumber * 19) * defeatMessages.length);

    return {
        date: matchDate,
        userTeam: userTeam,
        opponent: opponent,
        userScore: userScore,
        opponentScore: opponentScore,
        isHome: isHome,
        message: isGrimsby ? defeatMessages[defeatMessageIndex] : victoryMessages[messageIndex]
    };
}

function createFixtureCard(fixture) {
    const card = document.createElement('div');
    card.className = 'fixture-card';

    const homeTeam = fixture.isHome ? fixture.userTeam : fixture.opponent;
    const awayTeam = fixture.isHome ? fixture.opponent : fixture.userTeam;
    const homeScore = fixture.isHome ? fixture.userScore : fixture.opponentScore;
    const awayScore = fixture.isHome ? fixture.opponentScore : fixture.userScore;

    const isGrimsby = isGrimsbyTeam(fixture.userTeam);
    const celebration = isGrimsby ? '😢' : '🎉';
    const marginClass = isGrimsby ? 'defeat-margin' : 'victory-margin';

    card.innerHTML = `
        <div class="celebration">${celebration}</div>
        <div class="fixture-date">${formatDate(fixture.date)}</div>
        <div class="fixture-match">
            <div class="team-names">
                <span class="${fixture.isHome ? 'user-team' : ''}">${homeTeam}</span>
                <span style="margin: 0 15px;">vs</span>
                <span class="${!fixture.isHome ? 'user-team' : ''}">${awayTeam}</span>
            </div>
            <div class="score">${homeScore}-${awayScore}</div>
        </div>
        <div class="${marginClass}">${fixture.message}</div>
        <div class="match-details">
            📍 ${fixture.isHome ? 'Home' : 'Away'}
        </div>
    `;

    return card;
}

function generatePredictions() {
    const teamInput = document.getElementById('teamInput');
    const userTeam = teamInput.value.trim();

    if (!userTeam) {
        alert('Please enter your team name!');
        return;
    }

    const fixtures = [];
    for (let i = 0; i < 8; i++) {
        fixtures.push(generateFixture(userTeam, i));
    }

    displayPredictions(userTeam, fixtures);
}

function displayPredictions(teamName, fixtures) {
    const container = document.getElementById('predictionsContainer');
    const teamNameEl = document.getElementById('teamName');
    const fixturesGrid = document.getElementById('fixturesGrid');

    teamNameEl.textContent = teamName + ' - Upcoming Fixtures';

    fixturesGrid.innerHTML = '';
    fixtures.forEach(fixture => {
        const card = createFixtureCard(fixture);
        fixturesGrid.appendChild(card);
    });

    container.style.display = 'block';
}

// Initialize the app
function init() {
    // Add football-page class to body
    document.body.classList.add('football-page');
    
    // Add event listener for Enter key
    document.getElementById('teamInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePredictions();
        }
    });
}

// Start the app when page loads
window.addEventListener('load', init); 