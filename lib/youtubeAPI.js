import { appendScripts } from './utilities';

function youtube_parser(url) {
	var regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}

export const youtubeAPI = {
	embedApi: () => {
		const videos = $('.inline-youtube');
		if (!videos.length) return;
		appendScripts(['https://www.youtube.com/iframe_api']).then(() => {
			youtubeAPI.handleIframe();
		});
	},
	handleIframe: () => {
		function onPlayerReady(event) {
			console.log('on ready', event);
			event.target.videoTitle = '';
		}
		function onPlayerStateChange(event) {
			const target = event.target.g;
			const wrapDom = $(target).closest('.inline-youtube');

			const playerStatus = event.data;

			if (playerStatus == -1) {
				// UNSTARTED
			} else if (playerStatus == 0) {
				// ENDED
				wrapDom.removeClass('play-video');
			} else if (playerStatus == 1) {
				// PLAYING
				wrapDom.addClass('play-video');
			} else if (playerStatus == 2) {
				// PAUSED
				wrapDom.removeClass('play-video');
			} else if (playerStatus == 3) {
				// BUFFERING
				wrapDom.addClass('play-video');
			} else if (playerStatus == 5) {
				// CUED
			}
		}

		function createYouTubePlayer({ target, width, height, videoId }) {
			const player = new YT.Player(target, {
				height: height,
				width: width,
				videoId: videoId,
				events: {
					onReady: onPlayerReady,
					onStateChange: onPlayerStateChange,
				},
				// playerVars: { autoplay: 1, controls: 0 },
			});
			return player;
		}

		function onYouTubeIframeAPIReady() {
			const videos = $('.inline-youtube');

			videos.each((index, video) => {
				const $video = $(video);
				const videoElement = $video.find('a');

				if (!videoElement.length) return;

				let anchorElement = videoElement
					.toArray()
					.filter(item => item.href && item.href.includes('youtu'));

				if (!anchorElement.length) return;
				anchorElement = anchorElement[0];

				const videoId = youtube_parser(anchorElement.href);
				if (!videoId) return;

				const img = $video.find('img');
				if (img) {
					const youtubeThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
					img.attr('data-src', youtubeThumbnail);
					img.attr('src', youtubeThumbnail);
				}

				const id = anchorElement.id || crypto.randomUUID();
				if (!video.getAttribute('id')) {
					video.setAttribute('id', id);
				}

				anchorElement.href = 'javascript:;';
				anchorElement.removeAttribute('data-fancybox');

				let newID = id + '-clone';

				const cloneVideoDiv = document.createElement('div');
				cloneVideoDiv.id = newID;
				cloneVideoDiv.className =
					'clone-youtube-player absolute inset-0 z-1 opacity-0 pointer-events-none';
				video.append(cloneVideoDiv);

				const player = createYouTubePlayer({
					target: newID,
					width: video.clientWidth,
					height: video.clientHeight,
					videoId: videoId,
				});

				console.log('Creating player for:', {
					width: video.clientWidth,
					height: video.clientHeight,
					videoId: videoId,
					target: id,
					player: player,
				});
				anchorElement.addEventListener('click', () => {
					const playerStatus = player.getPlayerState();

					if (playerStatus == -1) {
						// unstarted
					} else if (playerStatus == 0) {
						// ended
					} else if (playerStatus == 1) {
						// playing
						pauseVideo();
					} else if (playerStatus == 2) {
						// paused
						playVideo();
					} else if (playerStatus == 3) {
						// buffering
					} else if (playerStatus == 5) {
						// cued
						playVideo();
					}
				});

				function pauseVideo() {
					player.pauseVideo();
					// $video.removeClass("play-video");
				}
				function playVideo() {
					player.playVideo();
					// $video.addClass("play-video");
				}
			});
		}

		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
	},
	init: () => {
		youtubeAPI.embedApi();
	},
};
