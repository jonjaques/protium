import {default as server} from './index'

const port = process.env.PORT || 1337

server.listen(port, () => {
  console.log(`listening on ${port}...`)
})
