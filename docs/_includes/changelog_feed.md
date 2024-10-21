{%- comment -%} 
---------------- find the last update for the passed in category (or take the latest entry)
{%- endcomment -%}
{%- if include.category -%}
  {%- assign id = 'https://about.signpath.io/documentation/changelog/feeds/' | append: include.category | append: '.xml' -%}
  {%- for entry in site.data.changelog -%}
    {%- if entry.updates -%}
      {%- for update in entry.updates -%}
        {%- if update[0] == include.category -%}
          {%- if updated -%}
          {%- else -%}
            {%- assign updated = entry.date -%}
          {%- endif -%}
        {%- endif -%}
      {%- endfor -%}
    {%- endif -%}
  {%- endfor -%}
{%- else -%}
  {%- assign id = 'https://about.signpath.io/documentation/changelog/feeds/all.xml' -%}
  {%- assign updated = site.data.changelog[0].date -%}
{%- endif -%}
<feed xmlns="http://www.w3.org/2005/Atom">
<generator uri="https://jekyllrb.com/" version="3.9.3">Jekyll</generator>
<link href="{{ id }}" rel="self" type="application/atom+xml"/>
<link href="https://about.signpath.io/" rel="alternate" type="text/html"/>
<updated>{{ updated | date: '%F' }}</updated>
<id>{{ id }}</id>
{%- case include.category -%}
  {%- when "application" -%} {%- assign include_category_name = 'Application ' -%}
  {%- when "self_hosted_installations" -%} {%- assign include_category_name = 'Self-hosted Installations ' -%}
  {%- when "powershell_module" -%} {%- assign include_category_name = 'PowerShell Module ' -%}
  {%- when "powershell_module_docker" -%} {%- assign include_category_name = 'Docker PowerShell Module ' -%}
  {%- when "crypto_providers" -%} {%- assign include_category_name = 'Crypto Providers ' -%}
  {%- when "macos_cryptotokenkit" -%} {%- assign include_category_name = 'MacOS CryptoTokenKit ' -%}
  {%- when "github_connector" -%} {%- assign include_category_name = 'GitHub Connector' -%}
  {%- when "jenkins_plugin" -%} {%- assign include_category_name = 'Jenkins Plugin' -%}
{%- endcase -%}
<title type="html">SignPath - {{ include_category_name }}Changelog</title>
<author>
  <name>SignPath GmbH</name>
  <uri>https://about.signpath.io</uri>
</author>
{%- for entry in site.data.changelog -%}
  {%- if entry.updates -%}
    {%- for update in entry.updates -%}
      {%- assign component = update[0] -%}
      {%- assign release = update[1] -%}
      {%- if include.category == nil or include.category == component -%}
      <entry>
        <id>tag:about.signpath.io,{{ entry.date | date: '%F'}}:{{ component }}:{{ release.version }}</id>
        <title>SignPath {{ site.data.changelog_components.details[component].label }} {{ release.version }}</title>
        <updated>{{ entry.date | date: '%F' }}</updated>
        <published>{{ entry.date | date: '%F' }}</published>
        <link rel="alternate" href="https://about.signpath.io/documentation/changelog#{{ entry.date | date: '%F' }}" />
        <category term="release/{{ component }}" label="{{ site.data.changelog_components.details[component].label }}" />
        <summary type="html">New Release: {{ category_label }} {{ release.version }}</summary>
        <content type="html">
          &lt;div&gt;
            &lt;h2&gt;New Release: {{ category_label }} {{ release.version }}&lt;/h2&gt;
            {%- for changes_per_type in release -%}
              {%- assign change_type = changes_per_type[0] -%}
              {%- assign changes = changes_per_type[1] -%}
            
              {%- if change_type != "version" -%}
                &lt;h3&gt;
                {%- case change_type -%}
                  {%- when "breaking_changes" -%} Breaking Changes / Manual migration steps:
                  {%- when "upgrade_information" -%} Upgrade Information:
                  {%- when "new_features" -%} New Features:
                  {%- when "improvements" -%} Improvements:
                  {%- when "bug_fixes" -%} Bug Fixes:
                {%- endcase -%}
                &lt;/h3&gt;
                {%- if change_type == "upgrade_information" -%}
                  {{ changes | markdownify | xml_escape }}
                {%- else -%}
                  &lt;ul&gt;
                    {%- for note in changes -%}
                      &lt;li&gt;
                        {{ note.text | markdownify | xml_escape }}
                        {%- if note.saas_only -%}
                          &lt;span class='enterprise-only'&gt;(SaaS only)&lt;/span&gt;
                        {%- endif -%}
                      &lt;/li&gt;
                    {%- endfor -%}
                  &lt;/ul&gt;
                {%- endif -%}
              {%- endif -%}
            {%- endfor -%}
          &lt;/div&gt;
        </content>
      </entry>
      {%- endif -%}
    {%- endfor -%}
  {%- endif -%}
{%- endfor -%}
</feed>