module.exports = ({
    client,
    logger
}) => {

const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();

router.put('/update', async (req, res) =>{
       try{
           // fetching uuid from cookie 
        const getuser =  req.cookies['connect.sid']
            // fetching user_id from redis
        const getclient = await client.getAsync(getuser);
        
        logger.info(`[Auth][update]- ${req.url}`);
       // fetching user from db by id
        const user = await UserModel.findById(getclient);
        
                // updating bio of user
        const updatebio = await UserModel.updateOne(user, {bio: req.body.bio});
        return res.status(200).json(updatebio);

       }
       catch(err){
           console.log(err); console.log('in 1'); 
           
       }
        
    })

    
return router;
}
