const express = require('express');
const members = require('../Members');
const route = express.Router();


// signup
route.post('/signup',(req,res)=> {

    const {name, username, email, password} = req.body;

    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
    {return res.status(400).send({status: 'error', msg:'Use a valid email.'})}   
 
    if(password.length<6)
    {return res.status(400).send({status: 'error', msg:'Password must be longer than six.'})}

    if(!(/[a-zA-Z]{2}\d/.test(password)))
    {return res.status(400).send({status: 'error', msg:'Password must be alphanumeric.'})}   
 
    if(!name || !username|| !email || !password)
      { return res.status(400).send({status: 'error', msg:'Cannot leave any field empty.'})};

    // if(email.match(/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/))
    //   {res.status(200).send({status: 'ok', msg: ' Signup successful.'});}
    //   else{return res.status(400).send({status: 'error', msg:'Use a valid email.'})}   
   
      const count = members.push({
        name,
        username,
        email,
        password
    });

    res.status(200).send({status: 'ok', msg: 'Signup successful', count, members});
});


// Login
route.get('/login', (req,res)=> {

    const {username, password} =req.body;

    if(!username || !password)
       return res.status(400).send({status:'error', msg: 'Input details'});
    
    let index = -1;
    const found = members.some((member)=> {
        index++;
        return (member.username  === username)&&(member.password === password)
    });

    if(!found)
    return res.status(404).send({status: 'error', msg: `${username} does not exist`});
    
    const [member] = members.filter((member)=> {
        return member.username  === username;
    });

    member.name = member.name;
    member.username = member.username;
    member.email = member.email;
    member.password = member.password;
    
    members[index] = member;

    return res.status(200).send({status: 'ok', msg: 'Successful login', members});

    
})

// Fetch all members
route.get('/all_members', (req,res)=> {

    let msg = 'Success';
    let count = members.length;
    if(count===0)
       msg = 'There are no members';

    res.status(200).send({msg, count, members});
});


// Edit profile
route.put('/edit', (req,res)=> {

    const {name, username, email, password} =req.body;

    // if(!username)
    // return res.status(400).send({status:'error', msg: 'Input correct username'});

    let index = -1;
    const found = members.some((member)=> {
        index++;
        return member.username === username
    });

    if(!found)
       return res.status(404).send({status: 'error', msg: `${username} does not exist`});
       
    const [member] = members.filter((member)=> {
        return member.username === username;
    });

    member.name = name ? name : member.name;
    member.username = username ? username : member.username;
    member.email = email ? email : member.email;
    member.password = password ? password : member.password;
    
    members[index] = member;

    return res.status(200).send({status: 'ok', msg: 'Successful update', members});
});


// Get a single profile by username
route.post('/single_member', (req,res)=> {
    const{username} = req.body;
    if(!username)
       return res.status(400).send({status: 'error', msg: 'Please enter username'});

    const nMembers = members.filter((member)=> member.username === username);
    if(nMembers.length === 0)
       return res.status(404).send({status: 'error', msg: `No member with username ${username}`});

    return res.status(200).send({status: 'ok', msg: 'Success', nMembers});
});

module.exports = route;