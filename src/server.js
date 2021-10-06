import express from "express"
import SpotifyWebApi from "spotify-web-api-node"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import dotenv from "dotenv"

dotenv.config()


const server = express()
server.use(cors())

server.use(express.json())

server.post("/login", (req, res) => {
  console.log(req.body.code.code)
  const code = req.body.code.code

  const spotifyApi = new SpotifyWebApi({
    redirectUri: "https://strivify.vercel.app",
    clientId: "ede976d713b14614b050b8afe5c3ac0c",
    clientSecret: "00e9ab0a66684138bcc0a27905299f29"
  }
  )

  spotifyApi.authorizationCodeGrant(code).then(data => {
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    })
  }).catch((error) => {
    console.log(error)
    res.sendStatus(400)
  })
})

const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
  console.log("Connected to mongo");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server listening on port " + port);
  });
}).catch(error => console.log(error));