import { h, Component, createRef } from 'preact';
import _ from 'lodash';

export default class NewTabButton extends Component {
	render(props) {
		return (
			<li className="new-tab-button" onClick={this.handleClick}>
				<i className="fa fa-plus" />
			</li>
		);
	}

	handleClick = () => {
		this.props.onClick();
	}
}
