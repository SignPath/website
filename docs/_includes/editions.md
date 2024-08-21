{%- assign compare_value = include.value | default: "true" -%}
{%- assign available = site.data.editions | where: include.feature, compare_value | map: "name" | join: ", " -%}
{%- assign required = site.data.editions | where: include.feature, "required" | map: "name" | join: ", " -%}
Available for _{{ available }}_. {% if required != '' %} Required for _{{ required }}_. {% endif %}
{: .badge.icon-signpath}
