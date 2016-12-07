---
layout: blog-post
title: Stay Classy!
subtitle: Defining a class in Ruby
category: Development
posted: Oct. 18, 2015
blogger-note: dbc-blog-note
---

As programming languages go, Ruby is object-oriented in a big way. Everything in Ruby is an object, and everything you do to anything is a method called on an object. Tying these objects and methods together are special object categories, called <strong>classes</strong>. Every object belongs to some class. Even a plain old string, like<code> "Hello, World!"</code>, is an example (or more properly, an <em>instance</em>) of the String class. And because that string is an instance of the String class, there are literally dozens of String-class methods that you can call on it, like<code> String#length:</code>

<ul class="code-block">
  <li>$ "Hello, World!".length</li>
  <li class="code-comment">=> 13</li>
</ul>

But you're not limited to the built-in array of classes, like String, Array, Hash, and Integer. Ruby is happy to let you create your own classes, from which you can create your own objects. Let's take a look at how a new class is defined in Ruby.

### Head of the Class

A class definition is very similar to a method definition. The first line is a keyword,<code> class</code>, followed by the name of the class, which must start with a capital letter. The last line is the keyword<code> end</code>, and everything in between defines the variables and methods common to all members of the class. Throughout this blog post, I'll build an example class,<code> Bank</code>, which models my 8-year-old daughter's piggy-bank. Here's how it begins:

<ul class="code-block">
  <li>class Bank</li>
  <li class="code-comment"># Define variables and methods here.</li>
  <li>end</li>
</ul>

The first thing that appears inside a class definition are its <em>attribute accessors</em>&mdash;special methods that create instance variables (more on instance variables in a minute) and make them accessable beyond the object's class methods. There are three options for attribute accessors:<code> attr_reader</code>, which makes it possible to return the value of the variable from outside the object, but not to alter it;<code> attr_writer</code>, which lets you change the value of the variable, but not read it; and <code>attr_accessor</code>, which lets you both read from and write to the variable. For our Bank class, I know I'll need two variables, "balance" and "unmatched_deposits," and since I want to be able to read their values from outside the object, but not change them, I'll give them both read-only attribute accessors:

<ul class="code-block">
  <li>class Bank</li>
  <ul class="code-tab">
    <li>attr_reader :balance</li>
    <li>attr_reader :unmatched_deposits</li>
  </ul>
  <li>end</li>
</ul>

Note that the attribute accessor methods use colons to name instance variables with symbols. Our Bank class definition now has two variables, but those variables have no values. To set their initial values, we'll need to write a special method for the class, called<code> #initialize</code>. This is the class method that gets called behind the scenes when you create a new object belonging to that class (technically, "instantiating" the object). <code>#initialize </code>sets the values of the instance variables for that object, either to default values, or to values that are passed into the<code> #initialize </code>method as arguments. We'll have one of each in our Bank class.

<ul class="code-block">
  <li>class Bank</li>
  <ul class="code-tab">
    <li>attr_reader :balance</li>
    <li>attr_reader :unmatched_deposits</li>
    <br>
    <li>def initialize(balance)</li>
    <ul class="code-tab">
      <li>@balance = balance</li>
      <li>@unmatched_deposits = 0</li>
    </ul>
    <li>end</li>
  </ul>
  <li>end</li>
</ul>

When we create an instance of our Bank class, we obviously need to know the starting balance&mdash;the amount you're putting in at the beginning. My daughter has a very good reason to keep a running total of her deposits as well, for reasons that will become apparent down the page. For now, trust me when I name that instance variable "unmatched_deposits" and set it to a default value of 0.

Notice that these two variables,<code> @balance </code>and<code> @unmateched_deposits</code>, begin with an "at-sign." In Ruby, the at-sign signifies <em>instance variables</em>, which are variables that are attached to specific instances of a class. Thus, every bank object that we create using this Bank class will have it's own @balance and @unmatched_deposits values. Unlike local variables, which are forgotten as soon as the method that created them ends, instance variables persist as long as the object they belong to exists. Also, they may be accessed&mdash;read from or written to&mdash;by any class method that is called on the object.

If your class has instance variables that won't need to be accessed by anything except the object's class methods, you don't have to use attribute accessors to create them. Instead, you can just add them inside the<code> #initialize </code>method, and set their starting values there. For example, if we needed to set an interest rate for our Bank objects (that would make them pretty special piggy banks!) we could create an instance variable and set its default value in the<code> #initialize </code>method, with a line like this:<code> @interest_rate = 0</code>. We could still define a class method to report or change the interest rate, but we wouldn't be able to access it any other way, because we didn't give it an attribute accessor. If we <em>were</em> to try to access it, we'd crash the program with a <strong>NoMethodError</strong>.

### Making Bank

We now have enough of a Bank class to create a piggy bank, and to find out how much money is in it. We can do that by instantiating a bank object, and then calling the attribute reader<code> #balance </code>on it.

<ul class="code-block">
  <li>$ piggy_bank = Bank.new(10.00)</li>
  <li class="code-comment">=> #&lt;Bank:0x00000001be35d8&gt;</li>
  <li>$ piggy_bank.balance</li>
  <li class="code-comment">=> 10.0</li>
</ul>

Here we've created a piggy_bank object, which is a member of the Bank class, and given it a starting balance of $10.00. The value returned by creating the object is its object ID, a unique number that marks that object's location in the computer's memory. Then we checked the balance in the piggy_bank, by calling<code> #balance </code>on it, which returned the current balance as a number with a floating-point decimal value, commonly called a <em>float</em>.

### Methods to our madness

Unfortunately, we can't <em>do</em> anything with our Bank objects yet, except create them. To be able to put money in or take it back out, we need to add more methods to the Bank class. Because these will be class methods, they will be able to access and manipulate the piggy_bank's instance variables. Let's define methods to deposit money into the bank, and take it out again:

<ul class="code-block">
  <li>class Bank</li>
  <ul class="code-tab">
    <li>attr_reader :balance</li>
    <li>attr_reader :unmatched_deposits</li>
    <br>
    <li>def initialize(balance)</li>
    <ul class="code-tab">
      <li>@balance = balance</li>
      <li>@unmatched_deposits = 0</li>
    </ul>
    <li>end</li>
    <br>
    <li>def deposit(amount)</li>
    <ul class="code-tab">
      <li>@balance += amount</li>
    </ul>
    <li class="code-indent">end</li>
    <br>
    <li class="headroom-half code-indent">def withdraw(amount)</li>
    <ul class="code-tab">
      <li class="code-indent-2x">@balance -= amount</li>
    </ul>
    <li class="code-indent">end</li>
  </ul>
  <li class="headroom-half">end</li>
</ul>

Each of these methods takes the argument it receives when it's called, and applies it to the instance variable<code> @balance</code>. Because<code> @balance </code>is an instance variable, it's available to Bank class methods like<code> #deposit </code>and<code> #withdraw </code>without needing to be passed in as an argument. Let's see what happens when my daughter adds $3.25 to the $10 already in her piggy_bank, and then takes $2.50 back out.

<div class="code-block">
  <ul>
    <li>$ piggy_bank.balance</li>
    <li class="code-comment">=> 10.0</li>
    <li>$ piggy_bank.deposit(3.25)</li>
    <li class="code-comment">=> 13.25</li>
    <li>$ piggy_bank.withdraw(2.50)</li>
    <li class="code-comment">=> 10.75</li>
  </ul>
</div>

As you see, our<code> Bank#deposit </code>and<code> Bank#withdraw </code>methods change the value of the<code> @balance </code>instance variable, and return the new balance in the account.

### Dancing and chewing gum at the same time

Of course, we might want to have class methods that do more than one thing at a time, to more than one instance variable. This is perfectly possible, and an excellent example of it can be seen in the deal that my daughter worked out with her grandfather. Remember that instance variable we set up in the beginning,<code> @unmatched_deposits</code>? Here's where we get to use it.

My daughter has convinced my dad to match any money she saves in her piggy bank whenever he comes to visit. So we need to modify the</code> Bank#deposit </code>method to keep a running total of deposits my daughter makes. We also need to define a new method that adds the matching funds that my father deposits in her bank and resets the<code> @unmatched_deposits </code>total back to 0. Let's do both of those now:

<div class="code-block">
  <ul>
    <li>class Bank</li>
    <ul class="code-tab">
      <li>attr_reader :balance</li>
      <li>attr_reader :unmatched_deposits</li>
      <br>
      <li>def initialize(balance)</li>
      <ul class="code-tab">
        <li>@balance = balance</li>
        <li>@unmatched_deposits = 0</li>
      </ul>
      <li>end</li>
      <br>
      <li>def deposit(amount)</li>
      <ul class="code-tab">
        <li>@balance += amount</li>
        <li>@unmatched_deposits += amount <span class="code-comment"># New line of code</span></li>
      </ul>
      <li>end</li>
      <br>
      <li>def withdraw(amount)</li>
      <ul class="code-tab">
        <li>@balance -= amount</li>
      </ul>
      <li>end</li>
      <br>
      <li>def match_deposits <span class="code-comment"># New method</span></li>
      <ul class="code-tab">
        <li>matching_deposit = @unmatched_deposits</li>
        <li>@unmatched_deposits = 0</li>
        <li>@balance += matching_deposit</li>
        <li class="code-comment"># So grandpa knows how much to kick in:</li>
        <li>return matching_deposit</li>
      </ul>
      <li>end</li>
    </ul>
    <li>end</li>
  </ul>
</div>

By now, we've put together a pretty robust little class. Let's see what happens when my daugher works her magic on her granddad. We'll assume the deposit-matching is a new deal, and not go back in time to match her earlier deposits.

<div class="code-block">
  <ul>
    <li>$ piggy_bank.balance</li>
    <li class="code-comment">=> 10.75</li>
    <li>$ piggy_bank.unmatched_deposits</li>
    <li class="code-comment">=> 0.0</li>
    <li>$ piggy_bank.deposit(5.00)</li>
    <li class="code-comment">=> 15.75</li>
    <li>$ piggy_bank.unmatched_deposits</li>
    <li class="code-comment">=> 5.0</li>
    <li>$ piggy_bank.deposit(7.50)</li>
    <li class="code-comment">=> 23.25</li>
    <li>$ piggy_bank.unmatched_deposits</li>
    <li class="code-comment">=> 12.5</li>
    <li>$ piggy_bank.match_deposits</li>
    <li class="code-comment">=> 12.5</li>
    <li>$ piggy_bank.balance</li>
    <li class="code-comment">=> 35.75</li>
    <li>$ piggy_bank.unmatched_deposits</li>
    <li class="code-comment">=> 0.0</li>
  </ul>
</div>

It's good to be eight years old, isn't it?

### You've got class!

There's lots more you can do with classes in Ruby. In fact, there's almost nothing you can do <em>without</em> them. But if you've made it this far, you know enough to start defining some useful classes of your own. Stay classy!
