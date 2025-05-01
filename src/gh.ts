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
        try {
            execFileSync("gh", ["pr", "checks", "--watch", "--required"]); // throws if the PR has no checks
        } catch (e) {
            if (
                e instanceof Error &&
                "stderr" in e &&
                e.stderr instanceof Buffer &&
                e.stderr.toString("utf8").includes("no checks reported")
            ) {
                return;
            } else {
                throw e;
            }
        }
    }

    /**
     * runs `gh pr status --json <fields>`, parses the response and returns the
     * `currentBranch` field. If no such field exists, returns `undefined`.
     *
     * @param fields the {@link https://cli.github.com/manual/gh_pr_status|json fields} to use.
     *
     * @returns the `currentBranch` field of the response as a JS object with fields
     * as specified.
     * 
     * @todo remove this?
     */
    prStatusJsonCurrentBranch(...fields: string[]) {
        const resJson = JSON.parse(
            execFileSync("gh", ["pr", "status", "--json", fields.join(",")], {
                encoding: "utf8",
            })
        );
        return resJson.currentBranch;
    }

    /**
     * @returns `true` if the PR can be merged, otherwise `false`.
     * Reasons for not being mergeable include:
     * - the branch has no associated pr.
     * - the pr has already been merged (`UNKNOWN`).
     * - the pr requires reviews (`BLOCKED`).
     * - the pr has merge conflicts (`DIRTY`).
     */
    get isCurrentPRMergeable() {
        return JSON.parse(execFileSync("gh", ["pr", "status", "--json", "mergeStateStatus"], {encoding: "utf8"})).currentBranch?.mergeStateStatus === "CLEAN"
    }
}
