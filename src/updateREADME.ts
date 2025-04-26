import * as fs from "fs";

export function updateREADME(
    leaderboard: string,
    options?: {
        sectionStart: string | undefined;
        sectionEnd: string | undefined;
    }
) {
    const sectionStart = options?.sectionStart ?? "<!-- leaderboard-start -->";
    const sectionEnd = options?.sectionEnd ?? "<!-- leaderboard-end -->";

    const regex = new RegExp(
        `(?<start>${sectionStart})(?<oldLeaderboard>(.|(\r?\n))*?)(?<end>${sectionEnd})`,
        "g"
    );
    const readmePath = "README.md";
    const readme = fs.readFileSync(readmePath, "utf8");
    const hasLeaderboardSection = readme.search(regex) !== -1;

    if (!hasLeaderboardSection)
        throw new Error("README.md does not contain a leaderboard section.");

    const updatedReadme = readme.replace(
        regex,
        `$<start>\r\n${leaderboard}\r\n$<end>`
    );

    if (updatedReadme !== readme) {
        fs.writeFileSync(readmePath, updatedReadme);
        console.log("README.md updated with new leaderboard.");
        return true;
    } else {
        console.log("Leaderboard is already up to date.");
        return false;
    }
}
