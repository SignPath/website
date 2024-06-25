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

<div class='changelog-select-ctn'>
	<div>
		Component 
		<select id='changelog-component-select'>
			<option value='all'>All components</option>
			<option value='application'>SignPath Application</option>
			<option value='self_hosted_installations'>Self-hosted Installations</option>
			<option value='powershell_module'>PowerShell module</option>
			<option value='crypto_providers'>Crypto Providers</option>
		</select>
	</div>
	<div>
		Changes 
		<select id='changelog-change_type-select'>
			<option value='all'>All changes</option>
			<option value='breaking_changes'>Breaking changes</option>
			<option value='upgrade_information'>Upgrade information</option>
			<option value='new_features'>New features</option>
			<option value='improvements'>Improvements</option>
			<option value='bug_fixes'>Bug fixes</option>
		</select>
	</div>
</div>

{% assign today = site.time | date: '%s' %}
{% assign one_year_ago = today | minus: 31536000 %}
{% assign opened_old_container = false %}

{% comment %} 
---------------- iterate over all entries 
{% endcomment %}
{% for entry in site.data.changelog %}

{% comment %} 
---------------- converts to unix timestamp 
{% endcomment %}
{% assign timestamp = entry.date | date: '%s' | to_i %}
{% assign timestamp_num = timestamp | minus: 1 %}

{% comment %} 
---------------- puts old changelogs into an own div wrapper 
{% endcomment %}
{% if timestamp_num < one_year_ago %}
	{% if opened_old_container == false %}
		{% assign opened_old_container = true %}
<p id='show-older-releases'><a id='show-older-releases-link' href='#'>Show older releases</a></p>
<div id='older-releases'> 	
	{% endif %}
{% endif %}

{% comment %} 
-------- calculate css class list for the entry 
{% endcomment %}
{% assign class_list = 'release' %}
{% for update in entry.updates %}
	{% comment %} extract the component (e.g. application) {% endcomment %}
	{% assign component = update[0] %}
	{% assign class_list = class_list | append: ' component-' | append: component %}
	{% assign release = update[1] %}
	{% for changes_per_type in release %}
	  {% assign change_type = changes_per_type[0] %}
	  {% assign class_list = class_list | append: ' change_type-' | append: change_type %}
	{% endfor %}
{% endfor %}
{% assign class_list = class_list | split: " " | uniq | join: " " %}

{% comment %}
---------------- actual changelog rendering
{% endcomment %}
<article class='{{ class_list }}' id="{{ entry.date | date: '%Y-%m-%d' }}">
	<h1>&nbsp;<span>{{ entry.date | date: '%B %d, %Y'}}</span></h1>
	{% if entry.updates %}
		{% for update in entry.updates %}
			
			{% comment %} 
			---------------- extract the component (e.g. application, crypto_providers, etc.) and release 
			{% endcomment %}
			{% assign component = update[0] %}
			{% assign release = update[1] %}
			
			{% assign component_change_type_class_list = 'component' %}
			{% for changes_per_type in release %}
			  {% assign change_type = changes_per_type[0] %}
			  {% assign component_change_type_class_list = component_change_type_class_list | append: ' change_type-' | append: change_type %}
			{% endfor %}

			<div class='component-{{ component }} {{ component_change_type_class_list }}'>
			<h2>
				{% case component %}
					{% when "application" %} SignPath Application {{ release.version }}
					{% when "self_hosted_installations" %} Self-hosted Installations {{ release.version }}
					{% when "powershell_module" %} SignPath PowerShell Module {{ release.version }}
					{% when "powershell_module_docker" %} SignPathDocker PowerShell Module {{ release.version }}
					{% when "crypto_providers" %} Crypto Providers {{ release.version }}
				{% endcase %}
			</h2>
			
			{% for changes_per_type in release %}
				
				{% comment %} 
				---------------- extract change_type (e.g. new_features, improvements, bug_fixes) and actual change log {% endcomment %} 
			  {% assign change_type = changes_per_type[0] %}
			  {% assign changes = changes_per_type[1] %}
			  
			  {% comment %} 
			  ---------------- necessary for current yaml structure 
			  {% endcomment %}
				{% if change_type != "version" %}
				  <div class='change_type-{{ change_type }}'>
					<h3>
						{% case change_type %}
							{% when "breaking_changes" %} Breaking Changes / Manual migration steps:
							{% when "upgrade_information" %} Upgrade Information:
							{% when "new_features" %} New Features:
							{% when "improvements" %} Improvements:
							{% when "bug_fixes" %} Bug Fixes:
						{% endcase %}
					</h3>
					
					{% if change_type == "upgrade_information" %}
						{{ changes | markdownify }}
					
					{% else %}
						<ul>
							{% for note in changes %}
								<li>
									{{ note.text | markdownify }}
									{% if note.saas_only %}
										<span class='enterprise-only'>(SaaS only)</span>
									{% endif %}
								</li>
							{% endfor %}
						</ul>
					{% endif %}
					</div> <!-- change_type -->
				{% endif %}
			{% endfor %}
			</div>
		{% endfor %}
	{% else %}
		<p class='no-updates'>No customer facing changes in this release.</p>
	{% endif %}
</article>
{% endfor %}
{% if opened_old_container == true %}
</div> <!-- older-releases -->
{% endif %}

</section>