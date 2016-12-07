---
layout: default
section: blog
---

<section class="row gtr">
  <article class="ph-col-12 tab-col-8 cmp-col-9 gtr">
    <h1>Blog Archive</h1>
    <ul>
      {% for post in site.posts %}
      <li class="blog-listing">
        <h2><a href="{{site.baseurl}}{{post.url}}">{{post.title}}</a></h2>
        <p>{{post.subtitle}}</p>
        <p>{{post.posted}}</p>
      </li>
      {% endfor %}
    </ul>
  </article>

  {% include blog-side.html %}

</section>