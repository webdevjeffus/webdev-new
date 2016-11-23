---
layout: default
section: blog
---

<article>
  <h1>Blog Archive</h1>

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
</article>

{% include blog-side.html %}