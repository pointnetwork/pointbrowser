import { h, Component } from 'preact';
import NewTabButton from '../new-tab-button';

export default class TabSwitcher extends Component {
	render(props) {
		let tabs = [];

		for (let id in props.tabs) {
			if (props.tabs.hasOwnProperty(id)) {
				let x = props.tabs[id];
				let title = (x.title === null || typeof x.title === 'undefined') ? x.url : x.title; // todo: for some reason if we just leave it empty '' it breaks css
				// let faviconSrc = (x.spinner) ? '/assets/loader1.gif' : x.favicon;
				let faviconSrc = (x.spinner) ? '/assets/loader1.gif' : '/assets/icons/favicon-16x16.png';
				tabs.push(
					<li className={(props.activeTabId === id) ? 'active' : ''} onClick={this.onTabClick.bind(this, id)}>
						<div className="tab-favicon">
							<img src={faviconSrc} />
						</div>
						<span className="title">{title}</span>
						<span onClick={this.onCloseTabClick.bind(this, id)} className="close-tab-button">&times;</span>
					</li>
				);
			}
		}

		return (
			<ul className="tab-switcher">
				{ tabs }
				<NewTabButton onClick={this.onNewTabClick} />
			</ul>
		);
	}

	onNewTabClick = () => {
		this.props.onNewTabClick();
	};
	onTabClick = (id) => {
		this.props.onTabClick(id);
	};
	onCloseTabClick = (id, e) => {
		e.stopPropagation();
		this.props.onCloseTabClick(id);
	};
}
