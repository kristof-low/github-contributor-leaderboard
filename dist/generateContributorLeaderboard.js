export function generateContributorLeaderboard(contributors) {
    let leaderboard = `\n| Rank | Contributor | Contributions |\n|:------:|:-------------:|:----------------:|\n`;
    contributors.forEach((contributor, i) => {
        const medal = ["🥇", "🥈", "🥉"][i] || `${i + 1}`;
        leaderboard += `| ${medal} | [${contributor.login}](${contributor.html_url}) | ${contributor.contributions} |\n`;
    });
    return leaderboard;
}
