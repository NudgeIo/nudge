
import { Router } from 'express'
import channelCreation from '../controllers/channelCreation'



const router = Router()


router.get('/channel', channelCreation.fetchChannel)
router.post('/create-channel', channelCreation.createChannel)

router.get('/creator/:slug', channelCreation.fetchCreator)


export default router