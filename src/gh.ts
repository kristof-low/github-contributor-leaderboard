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
     * `gh auth setup-git`
     */
    setupGit() {
        execFileSync("gh", ["auth", "setup-git"]);
    }

    /**
     * `gh pr create --fill --head <head>`
     * @param head the source branch of the pull request
     */
    prCreateFillHead(head: string) {
         execFileSync("gh", ["pr", "create", "-f", "--head", head], {
            encoding: "utf8",
        });
    }

    /**
     * `gh pr merge --squash`
     */
    prMergeSquash() {
        execFileSync("gh", ["pr", "merge", "--squash"]);
    }
}
