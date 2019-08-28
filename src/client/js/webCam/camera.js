class Camera {

  mediator = null;
  EVENTS = null;
  TRIGGERS = null;

  constructor(options) {
    this.mediator = options.mediator;
    this.EVENTS = this.mediator.EVENTS;
    this.TRIGGERS = this.mediator.TRIGGERS;
  }

  getUserMedia(options, successCallback, failureCallback) {
    const api = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    if (api) {
        return api.bind(navigator)(options, successCallback, failureCallback);
    }
  }

  getStream() {
    if (!navigator.getUserMedia &&
      !navigator.webkitGetUserMedia &&
      !navigator.mozGetUserMedia &&
      !navigator.msGetUserMedia) {
      alert('User Media API not supported.');
      return;
    }
    this.getUserMedia({video: true}, stream => {
        const video = document.createElement('video');
          video.setAttribute('width', '480');
          video.setAttribute('height', '320');
          video.setAttribute('autoplay', 'true');
        const canvas = document.querySelector('canvas');
        const context = canvas.getContext('2d');
        if ('srcObject' in video) {
            video.srcObject = stream;
        } else if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
        }
        video.addEventListener('timeupdate', () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imgData = context.getImageData(0, 0, canvas.width, canvas.height).data;
          const code = jsQR(imgData, canvas.width, canvas.height);
          if (code && code.data) {
            //pause video
            //...
            console.log(code.data);
            this.mediator.call(this.EVENTS.SEND_CODE, code.data);
          }
        });
    }, err => {
        console.error(`Error: ${err}`);
    });
  }

}