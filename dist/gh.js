import { execFileSync } from "child_process";
/**
 * a minimal representation of the Github Cli
 *
 * @todo refactor this class to support the following usage
 * ```
 * gh.auth.setupGit() // gh auth setup-git
 * gh.pr.create.fill() // gh pr create -f
 * gh.pr.merge.squash(20) // gh pr merge --squash 20
 * ```
 */
export class Gh {
    /**
     * the number of the last created pull request
     */
    lastPrNumber;
    /**
     * `gh auth setup-git`
     */
    setupGit() {
        execFileSync("gh", ["auth", "setup-git"]);
    }
    /**
     * `gh pr create --fill --head <head>`
     * @param head the source branch of the pull request
     */
    prCreateFillHead(head) {
        const stdout = execFileSync("gh", ["pr", "create", "-f", "--head", head], {
            encoding: "utf8",
        });
        const matchResult = /\/pull\/(?<pullNumber>\d+)$/.exec(stdout);
        if (!matchResult ||
            !matchResult.groups ||
            !("pullNumber" in matchResult.groups))
            throw new Error(`could not determine pull-request number`);
        this.lastPrNumber = Number(matchResult.groups.pullNumber);
    }
    /**
     * `gh pr merge --squash --delete-branch <this.lastPrNumber>`
     */
    prMergeSquashDeleteLastPr() {
        execFileSync("gh", ["pr", "merge", "--squash", "--delete-branch", `${this.lastPrNumber}`]);
    }
}
// // gh pr
// gh.pr;
// // gh pr create
// gh.pr.create;
// // gh pr create -f
// gh.pr.create.fill();
// // gh pr merge --squash 20
// gh.pr.merge.squash(20);
