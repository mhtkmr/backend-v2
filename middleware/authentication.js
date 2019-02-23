module.exports= ({client,logger}) => async function authenticate(req, res, next) {
    //fetch session id
    const sid = req.cookies['connect.sid'];
    //get mongoid of user from redis against sid
    const uid =await client.getAsync(sid);
    logger.info(`[Auth][module]-${sid},${uid}`);
    if((!sid||uid)||(sid||!uid)||(!sid||!uid)){
        return res.status(401).send({status: 401, message: 'Unauthorised'})
    }
    else if(sid&&uid){
        logger.info(`[Auth][module]- successful with ${sid}, ${uid}`);
        next();
    }
}