---
layout: default
section: blog
---

# Blog

<ul>
  {% for post in site.posts limit:5 %}
  <br>
  <li>
    <h3><a href="{{site.baseurl}}{{post.url}}">{{post.title}}</a></h3>
    <p><em>{{post.subtitle}}</em></p>
    <p>{{post.posted}}</p>
  </li>
  {% endfor %}
</ul>