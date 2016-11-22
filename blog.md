---
layout: default
section: blog
---

# Blog

<ul>
  {% for post in site.posts limit:5 %}
  <li>
    <h4><a href="{{site.baseurl}}{{post.url}}">{{post.title}}</a></h4>
    <p><em>{{post.subtitle}}</em></p>
    <p>{{post.posted}}</p>
  </li>
  {% endfor %}
</ul>