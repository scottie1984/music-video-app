import React from "react";

export default class Video extends React.Component {
    constructor() {
        super();
        this.state = {
          currentUrlIdx: 0,
        }
    
        this.handleEnded = this.handleEnded.bind(this);
      }
    
      handleEnded(e) {
        const nextUrlIdx = (this.state.currentUrlIdx === this.props.videos.length) ? 0 : this.state.currentUrlIdx + 1
        this.setState({ currentUrlIdx: nextUrlIdx });
      }

  render() {
      const vidoes = this.props.videos.map(v => v.video_url)
    return (
      <video
        src={vidoes[this.state.currentUrlIdx]}
        muted
        autoPlay
        onEnded={this.handleEnded}
      />
    );
  }
}