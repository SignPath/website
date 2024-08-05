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
<link href="https://about.signpath.io/documentation/changelog/feed.xml" rel="self" type="application/atom+xml"/>
<link href="https://about.signpath.io/" rel="alternate" type="text/html"/>
<updated>{{ updated | date: '%F' }}</updated>
<id>{{ id }}</id>
<title type="html">SignPath - Changelog</title>
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
        <title>{%- case component -%}
          {%- when "application" -%} SignPath Application {{ release.version }}
          {%- when "self_hosted_installations" -%} SignPath Self-hosted Installations {{ release.version }}
          {%- when "powershell_module" -%} SignPath SignPath PowerShell Module {{ release.version }}
          {%- when "powershell_module_docker" -%} SignPath Docker PowerShell Module {{ release.version }}
          {%- when "crypto_providers" -%} SignPath Crypto Providers {{ release.version }}
        {%- endcase -%}</title>
        <updated>{{ entry.date | date: '%F' }}</updated>
        <published>{{ entry.date | date: '%F' }}</published>
        <link rel="alternate" href="https://about.signpath.io/documentation/changelog#{{ entry.date | date: '%F' }}" />
        {%- case component -%}
          {%- when "application" -%} {%- assign category_label = 'SignPath Application' -%}
          {%- when "self_hosted_installations" -%} {%- assign category_label = 'SignPath Self-hosted Installations' -%}
          {%- when "powershell_module" -%} {%- assign category_label = 'SignPath SignPath PowerShell Module' -%}
          {%- when "powershell_module_docker" -%} {%- assign category_label = 'SignPath Docker PowerShell Module' -%}
          {%- when "crypto_providers" -%} {%- assign category_label = 'SignPath Crypto Providers' -%}
        {%- endcase -%}
        <category term="release/{{ component }}" label="{{ category_label }}" />
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