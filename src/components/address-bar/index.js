import { h, Component } from 'preact';

export default class AddressBar extends Component {
	componentWillMount() {
		this.setState({ input: this.props.url });
	}

	componentWillReceiveProps(nextProps, nextContext) {
		// todo: is the flow ok here?
		if (nextProps.url !== this.props.url) {
			if (nextProps.url !== this.state.input) {
				this.setState({ input: nextProps.url });
			}
		}
	}

	render(props) {
		return (
			<div className="address-bar-container">
				<button onClick={this.goBack} className="btn-back"><i className="fa fa-arrow-left" /></button>
				<button onClick={this.goForward} className="btn-forward"><i className="fa fa-arrow-right" /></button>
				<button onClick={this.reload} className="btn-repeat"><i className="fa fa-repeat" /></button>
				<input value={this.state.input} className="address-bar" onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress} />
				<button onClick={this.menu} className="btn-menu"><i className="fa fa-bars" /></button>
			</div>
		);
	}

	handleKeyPress = (e) => {
		this.setState({ input: e.target.value });
		if (e.key === 'Enter') {
			// todo: validate url

			let val = this.state.input;

			// todo: this isn't already done by webview? apparently not
			let https = val.slice(0, 8).toLowerCase();
			let http = val.slice(0, 7).toLowerCase();
			if (https === 'https://') {
				val = val.replace('https://', 'http://'); // todo: why not allow https? just need some cert on proxy side? and trust here?
			}
			if (http !== 'http://' && https !== 'https://') {
				val = 'http://' + val;
			}

			if (val !== this.props.url) {
				this.props.onChange(val);
				this.setState({ input: val });
				e.target.blur();
			}
			else {
				this.reload(); // cause it's pointless to update state, it'll render with the same prop and webview will not be reloaded
			}
		}
	};

	handleKeyDown = (e) => {
		if (e.key === 'Escape') {
			this.setState({ input: this.props.url });
			e.target.blur();
		}
	};

	goBack = () => {
		this.props.onNavigation('back');
	};
	goForward = () => {
		this.props.onNavigation('forward');
	};
	reload = () => {
		this.props.onNavigation('reload');
	};
	menu = () => {} // todo
}
