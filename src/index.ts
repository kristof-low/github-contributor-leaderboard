import core from "@actions/core";
import github from "@actions/github";

import { generateContributorLeaderboard } from "./generateContributorLeaderboard.js";
import { getContributors } from "./getContributors.js";
import { updateREADME } from "./updateREADME.js";
import { Git } from "./git.js";
import { Gh } from "./gh.js";
import { waitSync } from "./utils.js";

const owner = github.context.repo.owner;
const repo = github.context.repo.repo;
const sectionStart = core.getInput("sectionStart") || undefined;
const sectionEnd = core.getInput("sectionEnd") || undefined;
const maxContributors = Number(core.getInput("maxContributors")) || 10;
const gitUserName = core.getInput("username") || "github-actions[bot]";
const gitUserEmail =
    core.getInput("email") || "github-actions[bot]@users.noreply.github.com";
const commitMessage =
    core.getInput("commit-message") || "chore: update contributor leaderboard";
const usePullRequest = JSON.parse(core.getInput("use-pull-request") || "false");

/**
 * the name of the branch used as the source/head in the created pull (PR)
 * request. Only relevant if a PR is created.
 *
 * @todo enable user to specifiy as with `commitMessage`
 */
const checkoutBranchName = "update(docs)/update-contributor-leaderboard";

const gh = new Gh();
gh.setupGit();

const git = new Git({ name: gitUserName, email: gitUserEmail });

const contributors = getContributors(owner, repo, maxContributors);

const leaderboard = generateContributorLeaderboard(contributors);

git.clone({ repo, owner });
process.chdir(repo);

git.config({ "push.autoSetupRemote": "true" });

if (usePullRequest) {
    git.checkoutB(checkoutBranchName);
}

const readmeUpdated = updateREADME(leaderboard, {
    sectionStart,
    sectionEnd,
});

if (readmeUpdated) {
    git.add("README.md");
    git.commit(commitMessage);
    git.push();

    if (usePullRequest) {
        gh.prCreateFillHead(checkoutBranchName);

        waitSync(1000); // if you run `gh pr check` too soon after creating the PR,
        // it will report no checks.

        gh.prChecksWatchRequired();

        if (gh.isCurrentPRMergeable) gh.prMergeSquashDelete();
    }
}
