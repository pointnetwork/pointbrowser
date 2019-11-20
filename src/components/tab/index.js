import { h, Component, createRef } from 'preact';
import _ from 'lodash';

export default class Tab extends Component {
	constructor(props) {
		super(props);
		this.wv = createRef();
		this.wvListeners = {
			'page-title-updated': this.onPageTitleUpdated,
			'update-target-url': this.onUpdateTargetUrl,
			'did-start-loading': this.onDidStartLoading,
			'did-stop-loading': this.onDidStopLoading,
			'page-favicon-updated': this.onPageFaviconUpdated,
			'did-navigate': this.onDidNavigate,
			'did-navigate-in-page': this.onDidNavigateInPage,
			close: this.onClose
		};
	}

	navigateWebView(url) {
		const web = this.wv.current;
		web.navigate(url);
	}

	componentWillMount() {
		this.setState({ targetUrlTooltip: '' });
	}

	componentDidMount() {
		for (let name in this.wvListeners) {
			if (this.wvListeners.hasOwnProperty(name)) {
				this.wv.current.addEventListener(name, this.wvListeners[name]);
			}
		}
	}

	componentWillUnmount() {
		for (let name in this.wvListeners) {
			if (this.wvListeners.hasOwnProperty(name)) {
				this.wv.current.removeEventListener(name, this.wvListeners[name]);
			}
		}
	}

	render(props) {
		let url = props.url;
		const PORT = 5000; // todo: config it

		if (_.startsWith(url, 'point://')) {
			url = url.replace('point://', 'http://localhost:'+PORT+'/_point_protocol/')+'.html';
		}
		else {
			// ok
		}

		return (
			<div className={'tab ' + ((props.isActive) ? '' : 'hide')}>
				<webview
					id={'webviewTab'+props.tabId}
					src={url}
					enableremotemodule="false"
					ref={this.wv}
					partition="persist:webviewsession"
				/>
				<div className={'target-url-tooltip '+((this.state.targetUrlTooltip.length > 0) ? 'show' : 'hide')}>{this.state.targetUrlTooltip}</div>
			</div>
		);
	}

	handleNavigation = (action) => {
		const web = this.wv.current;

		switch (action) {
			case 'back':
				web.goBack();
				break;
			case 'forward':
				web.goForward();
				break;
			case 'reload':
				web.reload();
				break;
			default:
		}
	};

	onPageTitleUpdated = e => {
		this.props.onPageTitleUpdated(e.title);
	};
	onClose = e => {
		this.props.onCloseTabClick();
	};
	onUpdateTargetUrl = e => {
		this.setState({ targetUrlTooltip: e.url });
	};
	onDidStartLoading = e => {
		this.props.onSpinnerStart();
	};
	onDidStopLoading = e => {
		this.props.onSpinnerStop();
	};
	onDidNavigate = e => {
		this.props.onDidNavigate(e.url);
	};
	onDidNavigateInPage = e => {
		console.log(e);
	};
	onPageFaviconUpdated = e => {
		let faviconUrl = e.favicons[0];
		this.props.onPageFaviconUpdated(faviconUrl);
	};
}
