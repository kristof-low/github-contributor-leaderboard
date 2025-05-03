import { execFileSync } from "child_process";
/**
 * a minimal representation of the git cli, only supporting operations required
 * by this project.
 */
export class Git {
    email;
    name;
    constructor(config) {
        this.name = config.name;
        this.email = config.email;
    }
    /**
     * TODO: is this method necessary?
     */
    config(config) {
        Object.entries(config).map((keyValuePair) => execFileSync("git", ["config", "set", ...keyValuePair]));
    }
    clone(options) {
        const { repo, owner, branch } = options;
        execFileSync("git", [
            "clone",
            "--single-branch",
            ...(branch ? ["--branch", branch] : []),
            `https://github.com/${owner}/${repo}.git`,
        ]);
    }
    add(filespec) {
        execFileSync("git", ["add", ...filespec.split(" ")]);
    }
    addAll() {
        this.add(".");
    }
    commit(message) {
        execFileSync("git", ["commit", "-m", message], {
            env: {
                GIT_COMMITTER_NAME: this.name,
                GIT_COMMITTER_EMAIL: this.email,
                GIT_AUTHOR_NAME: this.name,
                GIT_AUTHOR_EMAIL: this.email,
            },
        });
    }
    push() {
        execFileSync("git", ["push"]);
    }
    pushForce() {
        execFileSync("git", ["push", "-f"]);
    }
    /**
     * `git checkout -b <branch>`
     * @param branch name of the branch
     */
    checkoutB(branch) {
        execFileSync("git", ["checkout", "-b", branch]);
    }
}
