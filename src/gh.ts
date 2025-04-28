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
        execFileSync("gh", ["pr", "create", "-f", "--head", head]);
    }

    /**
     * `gh pr merge --squash --delete-branch`
     */
    prMergeSquashDelete() {
        execFileSync("gh", ["pr", "merge", "--squash", "--delete-branch"]);
    }

    /**
     * `gh pr checks --watch --required`
     */
    prChecksWatchRequired() {
        execFileSync("gh", ["pr", "checks", "--watch", "--required"]);
    }

    /**
     * runs `gh pr status --json <fields>`, parses the response and returns the
     * `currentBranch` field. If no such field exists, returns `undefined`.
     * 
     * @param fields the {@link https://cli.github.com/manual/gh_pr_status|json fields} to use.
     * 
     * @returns the `currentBranch` field of the response as a JS object with fields
     * as specified.
     */
    prStatusJsonCurrentBranch(...fields: string[]) {
        const resJson = JSON.parse(
            execFileSync("gh", ["pr", "status", "--json", fields.join(",")], {
                encoding: "utf8",
            })
        )
        return resJson.currentBranch;
    }
}
