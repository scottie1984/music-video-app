import React, { Component } from 'react';
import './App.css';

function videoPlay(i, videos, document) {
  const vid = document.getElementById("myVideo"); 
  vid.setAttribute("src", videos[i].video_url);
  vid.load()
  vid.play(); 
}

class App extends Component {

  videos = []

  async play() {
    const instaTag = document.getElementById("instatag").value || "manutd"
    const response = await fetch(`https://www.instagram.com/explore/tags/${instaTag}/?__a=1`)
    const data = await response.json();
    const edges = data.graphql.hashtag.edge_hashtag_to_media.edges
    const videosShortCodes = edges.filter(e => e.node.is_video).map(e => e.node.shortcode)

    const longVideos = []
    for (const videoSc of videosShortCodes) {
        const videoRes = await fetch(`https://www.instagram.com/graphql/query/?query_hash=77fa889ea175f55eea62d9285abc769d&variables=%7B%22shortcode%22%3A%22${videoSc}%22%7D`)
        const videoData = await videoRes.json();
        longVideos.push(videoData.data.shortcode_media)
    }
    const videos = longVideos.filter(v => v.video_duration < 30)
    const youtubeInput = document.getElementById("youtubelink").value || "https://www.youtube.com/watch?v=RUCn4w-S2KM"
    const youtubeId = new URLSearchParams(youtubeInput.split('?')[1]).get('v'); 
    const youtube_video = document.getElementById("youtube_video"); 
    youtube_video.src = 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1';
    let i = 0
    videoPlay(i, videos, document)

    document.getElementById('myVideo').addEventListener('ended',myHandler,false);
    function myHandler() {
        i++;
        if(i === videos.length){
            i = 0;
            videoPlay(i, videos, document);
        }
        else{
            videoPlay(i, videos, document);
        }
    }
  }

  render() {
    return (
      <React.Fragment>
        <h3 style={{'text-align': 'center', color: 'white'}}>Video generator</h3>
        <div style={{'text-align': 'center', color: 'white'}}>
            <label htmlFor="fname">Youtube link:</label>
            <input type="text" id="youtubelink" name="youtubelink" style={{width:'800px'}} />
        </div>

        <div style={{'text-align': 'center', color: 'white'}}>
            <label htmlFor="fname">Tag:</label>
            <input type="text" id="instatag" name="instatag" style={{width:'800px'}} />
        </div>

        <div style={{'text-align': 'center'}}>
            <button id="play" onClick={this.play.bind(this)} type="button">Play Video</button>
        </div>

        
        <div style={{'text-align': 'center'}}>
            <video id="myVideo" muted>
            Your browser does not support HTML5 video.
            </video>
        </div>

        <iframe width="0" height="0" id="youtube_video"
            src="" allow="autoplay">
        </iframe>
      </React.Fragment>
    );
  }
}

export default App;
