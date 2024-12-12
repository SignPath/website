---
header: GitHub
layout: resources
toc: true
show_toc: 2
description: GitHub
---

## Prerequisites

* Use the predefined Trusted Build System _GitHub.com_ (see [configuration](/documentation/trusted-build-systems#configuration))
  *  add it to the Organization
  *  link it to each SignPath Project for GitHub
* Specify `<zip-file>` as root element of your [Artifact Configurations](/documentation/artifact-configuration) (GitHub packages all artifacts as ZIP archives)

{:.panel.info}
> **GitHub Enterprise**
>
> SignPath hosts an instance of the GitHub connector which is linked to GitHub.com For integrating self-hosted GitHub Enterprise instances, contact our [support](/support) team.

## Performed checks

The GitHub connector performs the following checks:

* A build was actually performed by a GitHub workflow, not by some other entity in possession of the API token
* [Origin metadata](/documentation/origin-verification) is provided by GitHub, not the build script, and can therefore not be forged
* The artifact is stored as a GitHub workflow artifact before it is submitted for signing
* For OSS projects: All jobs of the GitHub worfklow leading up to the signing request were executed on GitHub-hosted agents

## Usage

We provide a [`submit-signing-request` action](https://github.com/SignPath/github-action-submit-signing-request) that can be integrated into a GitHub Actions workflow:

{% raw %}
```yaml
steps:
  # required for the artifact to be available on the GitHub server
- name: upload-unsigned-artifact
  id: upload-unsigned-artifact
  uses: actions/upload-artifact@v4
  with: 
    path: path/to/your/artifact

- id: optional_step_id
  uses: signpath/github-action-submit-signing-request@v1
  with:
    api-token: '${{ secrets.SIGNPATH_API_TOKEN }}'
    organization-id: '<SignPath organization id>'
    project-slug: '<SignPath project slug>'
    signing-policy-slug: '<SignPath signing policy slug>'
    github-artifact-id: '${{ steps.upload-unsigned-artifact.outputs.artifact-id }}'
    wait-for-completion: true
    output-artifact-directory: '/path/to/signed/artifact/directory'
```
{% endraw %}

### Action input parameters

| Parameter                                     | Default Value                 | Description |
| ----                                          | -                             | ------      |
| `connector-url`                               | `https://app.signpath.io/Api` | The URL of the SignPath connector. Required if self-hosted.
| `api-token`                                   | (mandatory)                   | The _Api Token_ for a user with submitter permissions in the specified project/signing policy.
| `organization-id`                             | (mandatory)                   | The SignPath organization ID.
| `project-slug`                                | (mandatory)                   | The SignPath project slug.
| `signing-policy-slug`                         | (mandatory)                   | The SignPath signing policy slug.
| `artifact-configuration-slug`                 |                               | The SignPath artifact configuration slug. If not specified, the default is used.
| `github-artifact-id`                          | (mandatory)                   | ID of the Github Actions artifact. Must be uploaded using the [actions/upload-artifact](https://github.com/actions/upload-artifact) v4+ action before it can be signed. Use {% raw %}`${{ steps.<step-id>.outputs.artifact-id }}`{% endraw %} from the preceding actions/upload-artifact action step.
| `wait-for-completion`                         | (mandatory)                   | If true, the action will wait for the signing request to complete. Defaults to `true`.
| `output-artifact-directory`                   |                               | Path to where the signed artifact will be extracted. If not specified, the task will not download the signed artifact from SignPath.
| `github-token`                                |                               | GitHub access token used to read job details and download the artifact. Defaults to the [`secrets.GITHUB_TOKEN`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication). Requires the `action:read` and `content:read` permissions.
| `wait-for-completion-timeout-in-seconds`      | `600`                         | Maximum time in seconds that the action will wait for the signing request to complete.
| `service-unavailable-timeout-in-seconds`      | `600`                         | Total time in seconds that the action will wait for a single service call to succeed (across several retries).
| `download-signed-artifact-timeout-in-seconds` | `300`                         | HTTP timeout when downloading the signed artifact. Defaults to 5 minutes.
| `parameters`                                  |                               | Multiline-string of values that map to [user-defined parameters](/documentation/artifact-configuration/syntax#parameters) in the Artifact Configuration. Use one line per parameter with the format `<name>: "<value>"` where `<value>` needs to be a valid JSON string.

### Action output parameters

The action supports the following output parameters:
- `signing-request-id`: The id of the newly created signing request
- `signing-request-web-url`: The url of the signing request in SignPath
- `signpath-api-url`: The base API url of the SignPath API
- `signed-artifact-download-url`: The url of the signed artifact in SignPath

## Build and source code policies

{% include editions.md feature="pipeline_integrity.extended_policies" value="Optional" %}

By granting the [SignPath GitHub App](https://github.com/apps/signpath) access to the source code repositories, continous enforcement of branch rulesets, build and runner configuration can be guaranteed.

A policy configuration file needs to be stored at `.signpath/policies/<project-slug>/<signing-policy-slug>.yml` in the `default` branch of the source code repository. It is recommended to restrict access to the policy files using GitHub's [code owners] feature.

### Example

```yaml
# .signpath/policies/my-project-slug/release-signing.yml

github-policies:
  runners:
    allowed_groups:
      - 'GitHub Actions'                         # all jobs need to run on GitHub-hosted runners
  build:
    disallow_reruns: true
  branch_rulesets:
    - condition:
        rules:
        - block_force_pushes:                    # force pushes are prevented
        - pull_request:                          # code reviews are required
            min_required_approvals: 1
            require_code_owner_review: true
      allow_bypass_actors: false                 # no-one is allowed to bypass this rule
      enforced_from: EARLIEST                    # rule enforcement history is checked
    - condition:
        rules:
        - require_code_scanning:                 # code scanning must not reveal problems
            tools:
              - tool: CodeQL
                min_alerts_threshold: errors
                min_security_alerts_threshold: medium
        allow_bypass_actors: true                # some people may bypass these rules
        enforced_from: '2025-01-01 00:00'        # had to be reset at some point
```

### Available policies

The following policies can be configured:

#### `runners` policies

The policies in the `runners` section restrict the build runners used in the workflow run.

{%- include render-table.html table=site.data.tables.trusted-build-systems.github-extended-policies-runners -%}

#### `build` policies

The policies in the `build` section configure parameters of the build run that creates the artifact to be signed.

{%- include render-table.html table=site.data.tables.trusted-build-systems.github-extended-policies-build -%}

#### `branch_rulesets` policies

The policies in the `branch_rulests` section configure which [GitHub branch rulesets] need to be active for the specified repository. The branch rulesets may be configured on an organization or repository level.

##### How `branch_rulesets` policies are evaluated

Different conditions can be configured, each with its own rules, exceptions and enforcement date. The individual rules may be split up into different rulesets in GitHub.

Each `condition` specifies 
* the `rules` that need to be active (see below for all possible options)
* the `allow_bypass_actors` flag defining whether bypassers are allowed for the current set.
* the `enforced_from` value defining a point in time from which the associated rules have to be continuously enforced. SignPath ensures that there was always a combination of rulesets active that enforced the rules at any given time. Possible values are ISO-8601 formatted timestamps (e.g. `2024-12-05T11:51:29Z`) or `EARLIEST`. If no value is provided, the conditions are only evaluated at the time of signing.

{:.panel.info}
> **Info about enforcable timespans**
> 
> Depending on the GitHub subscription, the continuous enforcement of policies is either based on:
> * **Audit log events** for _GitHub Enterprise_ subscriptions. Audit log events are only available for the last 180 days, any prior policy violations cannot be detected.
> * The **last modified date** of the branch rulesets for all other subscriptions.

##### Available `branch_rulesets` policies

{%- include render-table.html table=site.data.tables.trusted-build-systems.github-extended-policies-branch-ruleset-rules -%}


[code owners]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
[GitHub branch rulesets]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets