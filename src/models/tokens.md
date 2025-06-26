refresh and access token 
refresh usually ahve long duration compared to access token 

when you have aaccess token then you can access any feature that require authentication (used primiraly for uthentication )
we validate a user via access token only but we dont want user to enter password after every short duration 
so we give user a refresh token and store the same in our database , if they both match we give a new access token

A refresh token is a long-lived token used to get a new access token when the current one expires.
 Purpose
Keeps the user logged in without asking them to log in again.