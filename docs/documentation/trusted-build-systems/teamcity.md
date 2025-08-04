---
# forward to docs.signpath.io
---
{%- assign path = page.url | replace: '/documentation/', '/' -%}
{% include redirect_to_docs.html target=path %}
