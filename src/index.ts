import core from "@actions/core";
import github from "@actions/github";

import { generateContributorLeaderboard } from "./generateContributorLeaderboard.js";
import { getContributors } from "./getContributors.js";
import { updateREADME } from "./updateREADME.js";
import { Git } from "./git.js";

const owner = github.context.repo.owner;
const repo = github.context.repo.repo;
const sectionStart = core.getInput("sectionStart") || undefined;
const sectionEnd = core.getInput("sectionEnd") || undefined;
const maxContributors = Number(core.getInput("maxContributors")) || 10;
const gitUserName = core.getInput("username") || "github-actions[bot]";
const gitUserEmail =
  core.getInput("email") || "github-actions[bot]@users.noreply.github.com";
    
const git = new Git({ name: gitUserName, email: gitUserEmail });

const contributors = getContributors(owner, repo, maxContributors);

const leaderboard = generateContributorLeaderboard(contributors);

git.clone({ repo, owner });
process.chdir(repo);

const readmeUpdated = updateREADME(leaderboard, {
    sectionStart,
    sectionEnd,
});

if (readmeUpdated) {
    git.add("README.md");
    git.commit("chore: update contributors leaderboard");
    git.push();
}
