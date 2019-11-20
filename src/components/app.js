import { h, Component, createRef } from 'preact';

import AddressBar from './address-bar';
import Header from './header';
import Tab from './tab';
import TabSwitcher from './tab-switcher';
import TabContainer from './tab-container';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';
import _ from 'lodash';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.refs = {};
	}

	componentWillMount() {
		this.state = {
			tabs: {},
			activeTabId: null
		};

		this.homePage = 'point://home';

		this.addTabs(this.homePage, null);

		this.setState({ activeTabId: Object.keys(this.state.tabs)[0] });
	}

	addTabs(url, title, callback = () => {}) {
		let id = 'tab'+Math.random().toString().replace('.', '');

		this.refs[id] = createRef();

		let tabs = this.state.tabs;
		tabs[id] = { url, title, spinner: false, favicon: null };
		this.setState({ tabs }, callback.bind(this, id));
	}

	closeTab(id, callback = () => {}) {
		let tabs = this.state.tabs;
		delete tabs[id];

		let newState = { tabs };

		if (this.state.activeTabId === id) {
			if (Object.keys(tabs).length === 0) {
				// No more tabs, quit
				this.closeWindow();
				return;
			}

			// todo: choose how browsers choose tabs
			let newActiveTabId = Object.keys(tabs)[ Object.keys(tabs).length-1 ];
			newState.activeTabId = newActiveTabId;
		}

		// todo: if closing the last tab, exit application (or hybernate on mac)

		this.setState(newState, callback.bind(this, id));
	}

	render() {
		let tabs = [];

		for (let id in this.state.tabs) {
			if (this.state.tabs.hasOwnProperty(id)) {
				let x = this.state.tabs[id];
				tabs.push(
					<Tab url={x.url}
						 isActive={id === this.state.activeTabId}
						 tabId={id}
						 ref={this.refs[id]}
						 spinner={x.spinner}

						 onPageTitleUpdated={this.onPageTitleUpdated.bind(this, id)}
						 onPageFaviconUpdated={this.onPageFaviconUpdated.bind(this, id)}
						 onCloseTabClick={this.onCloseTabClick.bind(this, id)}
						 onSpinnerStart={this.onSpinnerStart.bind(this, id)}
						 onSpinnerStop={this.onSpinnerStop.bind(this, id)}
						 onDidNavigate={this.onDidNavigate.bind(this, id)}
					/>
				);
			}
		}

		const activeUrl = this.getActiveTab().url;

		return (
			<div id="app">
				<TabSwitcher
					tabs={this.state.tabs}
					activeTabId={this.state.activeTabId}
					onNewTabClick={this.onNewTabClick}
					onTabClick={this.onTabClick}
					onCloseTabClick={this.onCloseTabClick}
				/>
				<AddressBar url={activeUrl} onChange={this.handleAddressBarChange} onNavigation={this.handleNavigation} />
				<TabContainer>
					{ tabs }
				</TabContainer>
			</div>
		);
	}

	handleAddressBarChange = (url) => {
		this.setState(state => {
			state.tabs[ this.state.activeTabId ].url = url;
			return state;
		});
	};

	handleNavigation = (action) => {
		let id = this.state.activeTabId;
		this.refs[id].current.handleNavigation(action);
	};

	onNewTabClick = () => {
		this.addTabs(this.homePage, null, (id) => {
			this.setState({
				activeTabId: id
			});
		});
	};

	onTabClick = (id) => {
		this.setState({ activeTabId: id });
	};
	onCloseTabClick = (id) => {
		this.closeTab(id);
	};
	onSpinnerStart = (id) => {
		this.setState(state => {
			state.tabs[id].spinner = true;
		});
	};
	onSpinnerStop = (id) => {
		this.setState(state => {
			state.tabs[id].spinner = false;
		});
	};
	onDidNavigate = (id, url) => {
		if (_.startsWith(url, 'http://localhost:5000/')) return; // todo: improve
		this.setState(state => {
			state.tabs[id].url = url;
		});
	};
	onPageTitleUpdated = (id, title) => {
		let tabs = this.state.tabs;
		if (!title) title = tabs[id].url;
		tabs[id].title = title;
		this.setState({ tabs });
	};
	onPageFaviconUpdated = (id, url) => {
		let tabs = this.state.tabs;
		tabs[id].favicon = url;
		this.setState({ tabs });
	};

	getActiveTab() {
		return this.state.tabs[ this.state.activeTabId ];
	}

	closeWindow() {
		const remote = require('electron').remote;
		let window = remote.getCurrentWindow();
		window.close();
	}
}
