import React, { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import Video from './Video'
import './App.css';

const getVideos = async tag => {
  const instaTag = tag || "manutd"
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
    return longVideos.filter(v => v && v.video_duration < 30)
}

const getYoutubeLink = link => {
  const youtubeId = new URLSearchParams(link.split('?')[1]).get('v'); 
  return 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1'
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      youtubelink: '',
      tag: '',
      videos: [],
      youtubeSrc: ''
    };

    this.play = this.play.bind(this);
    this.handleYoutubeChange = this.handleYoutubeChange.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  handleYoutubeChange(event) {
    this.setState({youtubelink: event.target.value});
  }

  handleTagChange(event) {
    this.setState({tag: event.target.value});
  }

  async play() {
    this.setState({
      loading: true
    })

    const instaTag = this.state.tag || "manutd"
    const videos = await getVideos(instaTag)

    const youtubeInput = this.state.youtubelink || "https://www.youtube.com/watch?v=RUCn4w-S2KM"
    const youtubeSrc = getYoutubeLink(youtubeInput)
    this.setState({
      loading: false,
      videos,
      youtubeSrc
    })
  }

  render() {
    return (
      <React.Fragment>
        <h3 style={{'text-align': 'center', color: 'white'}}>Video generator</h3>
        <div style={{'text-align': 'center', color: 'white'}}>
            <label htmlFor="fname">Youtube link:</label>
            <input type="text" id="youtubelink" name="youtubelink" style={{width:'800px'}} value={this.state.youtubelink} onChange={this.handleYoutubeChange} />
        </div>

        <div style={{'text-align': 'center', color: 'white'}}>
            <label htmlFor="fname">Tag:</label>
            <input type="text" id="instatag" name="instatag" style={{width:'800px'}} value={this.state.tag} onChange={this.handleTagChange} />
        </div>

        <div style={{'text-align': 'center'}}>
            <button id="play" onClick={this.play} type="button">Play Video</button>
        </div>

        <div style={{'text-align': 'center'}}>
          <ClipLoader
            size={150}
            color={"#123abc"}
            loading={this.state.loading}
          />
      </div>

        
        <div style={{'text-align': 'center'}}>
            <Video videos={this.state.videos} />
        </div>

        <iframe width="0" height="0" id="youtube_video"
            src={this.state.youtubeSrc} allow="autoplay">
        </iframe>
      </React.Fragment>
    );
  }
}

export default App;
