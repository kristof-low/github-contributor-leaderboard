import { execFileSync } from "child_process";
execFileSync("gh", ["auth", "setup-git"])
/**
 * a minimal representation of the git cli, only supporting operations required
 * by this project.
 */
export class Git {
    public email: string;
    public name: string;

    constructor(config: { name: string; email: string }) {
        this.name = config.name;
        this.email = config.email;
    }

    /**
     * TODO: is this method necessary?
     */
    config(config: { [key: string]: string }) {
        Object.entries(config).map((keyValuePair) =>
            execFileSync("git", ["config", "set", ...keyValuePair])
        );
    }

    clone(options: { repo: string; owner: string; branch?: string }) {
        const { repo, owner, branch } = options;
        execFileSync("git", [
            "clone",
            "--single-branch",
            ...(branch ? ["--branch", branch] : []),
            `https://github.com/${owner}/${repo}.git`,
        ]);
    }

    add(filespec: string) {
        execFileSync("git", ["add", ...filespec.split(" ")]);
    }
    addAll() {
        this.add(".");
    }
    commit(message: string) {
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
}
