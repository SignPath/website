{%- assign compare_value = include.value | default: "true" -%}
{%- assign available = site.data.editions | where: include.feature, compare_value | map: "name" | join: ", " -%}
{%- assign required = site.data.editions | where: include.feature, "required" | map: "name" | join: ", " -%}
<p class='badge icon-signpath' markdown='1'>Available for _{{ available }}_. {% if required != '' %} Required for _{{ required }}_. {% endif %}</p>