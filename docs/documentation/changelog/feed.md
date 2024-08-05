---
permalink: /documentation/changelog/feed.xml
---
<feed xmlns="http://www.w3.org/2005/Atom">
<generator uri="https://jekyllrb.com/" version="3.9.3">Jekyll</generator>
<link href="https://about.signpath.io/documentation/changelog/feed.xml" rel="self" type="application/atom+xml"/>
<link href="https://about.signpath.io/" rel="alternate" type="text/html"/>
<updated>{{ site.data.changelog[0].date | date: '%F' }}</updated>
<id>https://about.signpath.io/documentaiton/changelog/feed.xml</id>
<title type="html">SignPath - Changelog</title>
{%- for entry in site.data.changelog -%}
  {%- if entry.updates -%}
    {%- for update in entry.updates -%}
      {%- assign component = update[0] -%}
      {%- assign release = update[1] -%}
      <entry>
        <id>tag:about.signpath.io,{{ entry.date | date: '%F'}}:{{ component }}:{{ release.version }}</id>
        <title>{%- case component -%}
          {%- when "application" -%} SignPath Application {{ release.version }}
          {%- when "self_hosted_installations" -%} SignPath Self-hosted Installations {{ release.version }}
          {%- when "powershell_module" -%} SignPath SignPath PowerShell Module {{ release.version }}
          {%- when "powershell_module_docker" -%} SignPath Docker PowerShell Module {{ release.version }}
          {%- when "crypto_providers" -%} SignPath Crypto Providers {{ release.version }}
        {%- endcase -%}</title>
        <updated>{{ entry.date | date: '%F' }}</updated>
        <link rel="alternate">https://about.signpath.io/documentation/changelog#{{ entry.date | date: '%F' -}} </link>
        <category>{{ component }}</category>
        <content type="xhtml">
          <div xmlns="http://www.w3.org/1999/xhtml">
            {%- for changes_per_type in release -%}
              {%- assign change_type = changes_per_type[0] -%}
              {%- assign changes = changes_per_type[1] -%}
            
              {%- if change_type != "version" -%}
                <h2>
                {%- case change_type -%}
                  {%- when "breaking_changes" -%} # Breaking Changes / Manual migration steps:
                  {%- when "upgrade_information" -%} # Upgrade Information:
                  {%- when "new_features" -%} # New Features:
                  {%- when "improvements" -%} # Improvements:
                  {%- when "bug_fixes" -%} # Bug Fixes:
                {%- endcase -%}
                </h2>
                {%- if change_type == "upgrade_information" -%}
                  {{ changes | markdownify }}
                {%- else -%}
                  <ul>
                    {%- for note in changes -%}
                      <li>
                        {{ note.text | markdownify }}
                        {%- if note.saas_only -%}
                          <span class='enterprise-only'>(SaaS only)</span>
                        {%- endif -%}
                      </li>
                    {%- endfor -%}
                  </ul>
                {%- endif -%}
              {%- endif -%}
            {%- endfor -%}
          </div>
        </content>
      </entry>
    {%- endfor -%}
  {%- endif -%}
{%- endfor -%}
</feed>