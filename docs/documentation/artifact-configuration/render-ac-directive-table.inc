{%- assign table-filter-column = "directive" -%}
{%- assign table-filter-value = include.directive -%}
{% assign table-omit-columns = "directive,isContainer" | split: ',' %}

<p><strong>Supported elements:</strong></p>

{%- include render-table.html table=site.data.tables.artifact-configuration.signing-file-elements -%}

{%- assign table-filter-column = nil -%}
{%- assign table-filter-value = nil -%}
{%- assign table-omit-columns = nil -%}
