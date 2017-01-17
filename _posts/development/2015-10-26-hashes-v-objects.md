---
layout: blog-post
title: Similar != Same
subtitle: A look at Ruby hashes and Javascript objects
category: Development
posted: Oct. 26, 2015
blogger-note: dbc-blog-note
alt: Learn the differences between a Ruby hash and a Javascript object
---

<p>The web development immersive at Dev Bootcamp focuses on Ruby as its primary back-end language. Because of this, DBC students spend a lot of time switching between Ruby and JavaScript, the front-end language that's built in to all modern web browsers. We can ignore the essentially religious debate about which langauge is "better," but we can't avoid the fact that they're different. One of the most important differences between Ruby and JavaScript is in how they handle the composite data structures. Ruby does this with its <em>hash</em>, while JS calls its version an <em>object</em>.</p>

<p>Ruby's hash and JavaScript's object do roughly the same thing&mdash;they both represent a collection of values accessed using keys. Their usage is similar, as is their syntax, but they have some important differences under the hood. In this blog post, I'll look first at the similarities between the two, and then their differences.</p>

<h4>Somewhat alike...</h4>

<p>Ruby's hash and JavaScript's object <em>look</em> alike. Their syntax is very similar. Let's look at how you might create a hash and an object with literal notation:</p>

<ul class="code-block">
  <li class="code-comment"># Ruby hash:</li>
  <li>tim = { name: "Tim", age: 25, shoe_size: 9 }</li>
  <li class="code-comment hdrm-more">// JS object:</li>
  <li>var tim = { name: "Tim", age: 25, shoe_size: 9 };</li>
</ul>

<p>You also access their values in similar, but not identical, ways:</p>

<ul class="code code-block">
  <li class="code-comment"># Ruby hash:</li>
  <li>tim[:age]</li>
  <li class="code-comment">=> 25</li>
  <li class="code-comment hdrm-more">// JS object:</li>
  <li>tim.age;</li>
  <li class="code-comment">=> 25</li>
</ul>

<p>In each case, the data structure consists of a set of labeled values; Tim's age (label) is 25 (value). In Ruby, we call the label a <em>key</em>, and in JavaScript, we call it a <em>property</em>, but the practical effect is the same. It's interesting and sometimes useful to note that in Ruby, the keys can be of any data type (string, symbol, number, etc.), while in JavaScript, the properties are not really any type of data at all&mdash;they're just properties of the object. In our example hash, we created all of the keys as symbols.</p>

<p>The <em>values</em> in Ruby hashes and JavaScript objects may be of any type&mdash;numbers, strings, arrays, even hashes or objects. For example, we can add an array to our two Tims simply by accessing a new key or property, and assigning it a value:</p>

<ul class="code-block">
  <li class="code-comment"># Ruby hash:</li>
  <li>tim[:pets] = [ "dog", "possum", "iguana" ]</li>
  <li class="code-comment">=> [ "dog", "possum", "iguana" ]</li>
  <li>tim[:pets][1]</li>
  <li class="code-comment">=> "possum"</li>
  <li class="code-comment hdrm-more">// JS object:</li>
  <li>tim.pets = [ "dog", "possum", "iguana" ];</li>
  <li class="code-comment">=> [ "dog", "possum", "iguana" ];</li>
  <li>tim.pets[1]</li>
  <li class="code-comment">=> "possum"</li>
</ul>

<h4>...but different somehow</h4>

<p>One important advantage JavaScript objects have over Ruby hashes is that a JS object can take a function as a value. Since methods in Ruby aren't objects, you can't assign a method as a hash value. In order to make our tim object greet us in JavaScript, we add a property that has a function as its value:</p>

<ul class="code-block">
  <li class="code-comment">// JS object:</li>
  <li>tim.say_hi = function(name) {</li>
  <li class="code-tab">console.log("Hi there, " + name + "!")</li>
  <li>};</li>
  <li class="code-comment">=> function (name) { console.log("Hi there, " + name + "!") }</li>
  <li class="hdrm-more">tim.say_hi("Bob")</li>
  <li class="code-comment">=> Hi there, Bob!</li>
</ul>

<p>This is a handy bit of functionality possessed by JavaScript objects, with no direct equivalent for Ruby hashes. You <em>could</em> use a Proc object in a Ruby hash, but it's more likely that if you want to put a method in a data structure in Ruby, you really need something more robust than a simple hash. For these purposes, Ruby provides classes, which carry with them a whole suite of capabilities including inheritance of built-in methods from superclasses, the potential to add class methods inherited by all objects belonging to the class, and protected instance variables. JavaScript's rough equivalent to Ruby's class is the constructor function, which streamlines the creation of similar objects, but otherwise lacks the power and versatility of Ruby's class.</p>

<p>In the case of the Ruby version of our friend tim, as he becomes more complex, we need to consider creating a Person class, then creating tim as an instance of that class, instead of as a simple hash. But that's a subject for another post, which would compare Ruby classes with JavaScript constructor functions.</p>
