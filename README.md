# Money_Splitter
A web based App which split the Money

An web Based Application which is used for split money between your friends and also you can chat with them.
You can also pay the due amount by this platform. You can also give feedback to our team to improvise ourselve and if you find any mistakes
or have a great idea that has to be implemented in this platform you can suggest that too.

The activities in the app :-

## 1. Registration_Page
This Page is used for user registration. A user will register using his first name, last name, email-id, phone no.
and ofcourse password. On successful registration he is directed to MainLogin_page.
<div>
<img src="/Screenshots/Register.png">
</div>

## 2. MainLogin_Page
This Page is used for user login and is the first activity when we start the app.
We have also a Manager login where admin can login and see the feedbacks.
A user can login using his email-id and password. On successful login he is directed to Friend Dashboard where you have to 
add friend and create a group.
<div>
<img src="/Screenshots/Main_Login.png">
</div>

## 3. Add Friend
This activity will appear after you click the 'Add Friend' option on the dashboard. Here you have to mention the friend email-id to add it
in your database and then you can add those friend in the group later.
Also friend email-id has to be in database (means they also use the platform if they are not register to this then an invitation mail is gone)
<div>
<img src="/Screenshots/friend_dashboard.png" alt="Drawing"  height="300" width="180" >
</div>

## 4. Create Group
This activity will appear after you click the 'Ad group' option on the dashboard. Here you have to mention the group name and its description
what this group is about.And when you submit this details your Groups are shown in list as below-
After click on particular group you will redirected to that group name dashboard.
<img src="/Screenshots/friend_dashboard2.png" alt="Drawing"  height="300" width="180" >
</div>

## 5. Add Member
This activity will appear after you click the 'Add group' option on the dashboard.Here you have to just enter the mail-id of that friend
that is already in your dashboard means the thing which we done in #3 step. Firstly you have to add that particular friend in your system
in Add Friend step and then that friend add in your group if it is present already.
<div>
<img src="/Screenshots/group_dashboard.png" alt="Drawing"  height="300" width="180" >
</div>

## 5. Add Bill
This activity will appear after you click the 'Add Bill' option on the dashboard. Here you have to mention the Note(what this bill is about)
, its amount, split between and those amounts. Then the bill is added to your dashboard as well as your fried dashboard.
If you lent the money to your friend then bill on dashboard has sign (+) in your dashboard and (-) on your friends dashboard.
(+) means your friend has to pay the due amount and vice-versa.
<div>
<img src="/Screenshots/add_bill.png" alt="Drawing"  height="300" width="180" >
</div>

## 6. Chat Box
This activity displays a list of all the group chats having one of the members as the user who logged in.This chatbox appear in particular
group you are in and it's basically a chat box where you send and receive messages.
<div>
<img src="/Screenshots/chat.png" alt="Drawing"  height="300" width="180" >
</div>

## 7. Settle Up and Payment
By this button all the bills are settled automatically if you have cash payment then simply click on that button it settled all the
bills and also there is option to pay there and if you pay online then after succesful payment it automatically settle up the amount
if pay in full.

## 7. Feedback
This activity is optional, if user find any mistakes or have a great idea that has to be implemented in this platform you can suggest that too. 
<div>
<img src="/Screenshots/feedback.png" alt="Drawing"  height="300" width="180" >
</div>

-->This is supportable on all devices as well (mobile,laptops,different screen sizes doesn't matter)

To run this Prject on your system-
1. You have mongodb on your system.
2. You have NodeJs install on your system.

How to run this project-
-On cmd line where this project is installed first run mongod
then npm start or nodemon(if you have that on you pc).

On Browser type-
localhost:3000
and register first
then login
and then ENJOY!!!!






