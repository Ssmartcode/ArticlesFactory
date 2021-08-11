# ArticlesFactory

## How it started
This is my very first project built using node js. My purpose was to create a news website with am admin panel, where admins can write, 
update and delete their articles. My purpose was to create something that is similar to a CMS, but over simplified.
<br /> 

### Technologies used:
PUG, CSS3, javaScript, NodeJs with Express.
To create an article i have used a WYSIWYG from: https://www.tiny.cloud/auth/signup/

### Website presentation

To get the full potential of this website, the users should create an account
There are 3 types of account one can create:
* User - Has access to all aricles, including the premium ones (which are disabled for guests)
* Author - Can see, create, update and delete OWN articles
* Admin - Can see, create, update and delete ANY articles, even it they dont own

There are 4 categories of articles: 
* 3 categories for anyone: Entertainment, Technology and Health
* 1 premium for registerd users: Family

Trying to access an article from the family cateogry as a guest, will redirect you to login page!
