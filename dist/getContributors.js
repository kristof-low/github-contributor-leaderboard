import { execSync } from "child_process";
export function getContributors(owner, repo, maxContributors) {
    console.log("Fetching contributors...");
    const raw = execSync(`gh api repos/${owner}/${repo}/contributors --paginate`).toString();
    const contributors = JSON.parse(raw)
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, maxContributors);
    return contributors;
}
