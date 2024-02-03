---
sub_header: Product Updates
layout: resources
show_toc: 0
hide_sub_toc: true
description: Product Changelog for all SignPath components.
datasource: changelog
redirect_from:
  - /product/changelog
---

<section class='changelog'>

<div class='changelog-component-select-ctn'>
Component 
<select id='changelog-component-select'>
	<option value='all'>All components</option>
	<option value='application'>SignPath Application</option>
	<option value='self_hosted_installations'>Self-hosted Installations</option>
	<option value='powershell_module'>PowerShell module</option>
	<option value='crypto_providers'>Crypto Providers</option>
</select>
</div>

{% assign today = site.time | date: '%s' %}
{% assign one_year_ago = today | minus: 31536000 %}
{% assign opened_old_container = false %}

{% for release in site.data.changelog %}

{% assign timestamp = release.date | date: '%s' | to_i %}
{% assign timestamp_num = timestamp | minus: 1 %}
{% if timestamp_num < one_year_ago %}
	{% if opened_old_container == false %}
		{% assign opened_old_container = true %}
<p id='show-older-releases'><a id='show-older-releases-link' href='#'>Show older releases</a></p>
<div id='older-releases'> 	
	{% endif %}
{% endif %}

{% assign class_list = 'release' %}
{% for update in release.updates %}
	{% assign class_list = class_list | append: ' component-' | append: update[0] %}
{% endfor %}

<article class='{{ class_list }}' id="{{ release.date | date: '%Y-%m-%d'}}">
	<h1>&nbsp;<span>{{ release.date | date: '%B %d, %Y'}}</span></h1>
	{% if release.updates %}
		{% for update in release.updates %}
			<div class='component-{{ update[0] }}'>
			<h2>
				{% case update[0] %}
					{% when "application" %} SignPath Application {{ update[1].version }}
					{% when "self_hosted_installations" %} Self-hosted Installations {{ update[1].version }}
					{% when "powershell_module" %} SignPath PowerShell Module {{ update[1].version }}
					{% when "powershell_module_docker" %} SignPathDocker PowerShell Module {{ update[1].version }}
					{% when "crypto_providers" %} Crypto Providers {{ update[1].version }}
				{% endcase %}
			</h2>
			{% for update_type in update[1] %}
				{% if update_type[0] != "version" %}
					<h3>
						{% case update_type[0] %}
							{% when "breaking_changes" %} Breaking Changes / Manual migration steps:
							{% when "upgrade_information" %} Upgrade Information:
							{% when "new_features" %} New Features:
							{% when "improvements" %} Improvements:
							{% when "bug_fixes" %} Bug Fixes:
						{% endcase %}
					</h3>
					{% if update_type[0] == "upgrade_information" %}
						{{ update_type[1] | markdownify }}
					{% else %}
						<ul>
							{% for note in update_type[1] %}
								<li>
									{{ note.text | markdownify }}
									{% if note.saas_only %}
										<span class='enterprise-only'>(SaaS only)</span>
									{% endif %}
								</li>
							{% endfor %}
						</ul>
					{% endif %}
				{% endif %}
			{% endfor %}
			</div>
		{% endfor %}
	{% else %}
		<p class='no-updates'>No customer facing changes in this release.</p>
	{% endif %}
</article>
{% endfor %}
</div>

</section>