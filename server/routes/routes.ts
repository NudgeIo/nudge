
import { Router } from 'express'
import channelCreation from '../controllers/channelCreation'



const router = Router()


router.get('/channel', channelCreation.fetchChannel)
router.get('/create-channel', channelCreation.createChannel)


export default router