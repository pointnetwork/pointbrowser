import { Component } from 'preact';

export default class TabContainer extends Component {
	render(props) {
		return (
			<div className="tab-container">
				{props.children}
			</div>
		);
	}
}
