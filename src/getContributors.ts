import { execSync } from "child_process";
import { URL } from "url";

export interface Contributor {
    login: string;
    id: number;
    node_id: string;
    avatar_url: URL;
    gravatar_id: string;
    url: URL;
    html_url: URL;
    followers_url: URL;
    following_url: URL;
    gists_url: URL;
    starred_url: URL;
    subscriptions_url: URL;
    organizations_url: URL;
    repos_url: URL;
    events_url: URL;
    received_events_url: URL;
    type: string;
    user_view_type: string;
    site_admin: boolean;
    contributions: number;
}

export type Contributors = Contributor[];

export function getContributors(
    owner: string,
    repo: string,
    maxContributors: number
) {
    console.log("Fetching contributors...");
    const raw = execSync(
        `gh api repos/${owner}/${repo}/contributors --paginate`
    ).toString();
    const contributors = (JSON.parse(raw) as Contributor[])
        .filter((contributor) => !/bot/i.test(contributor.type)) // filter out bot accounts
        .sort((a: any, b: any) => b.contributions - a.contributions)
        .slice(0, maxContributors);
    return contributors as Contributors;
}
