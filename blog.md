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
      <h2><a href="{{site.baseurl}}{{post.url}}">{{post.title}}</a></h2>
      <h4><a href="{{site.baseurl}}{{post.url}}">{{post.subtitle}}</a></h4>
      <p>{{post.posted}}</p>
    </li>
    {% endfor %}
  </ul>
</article>

{% include blog-side.html %}