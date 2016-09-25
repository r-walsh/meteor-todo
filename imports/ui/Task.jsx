import React from "react";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";

export default class Task extends React.Component {
	static get propTypes() {
		return {
			showPrivateButton: React.PropTypes.bool.isRequired
			, task: React.PropTypes.object.isRequired
		};
	}

	constructor( props ) {
		super( props );

		this.toggleChecked = this.toggleChecked.bind( this );
		this.togglePrivate = this.togglePrivate.bind( this );
		this.deleteTask = this.deleteTask.bind( this );
	}

	toggleChecked() {
		Meteor.call( "tasks.setChecked", this.props.task._id, !this.props.task.checked );
	}

	togglePrivate() {
		Meteor.call( "tasks.setPrivate", this.props.task._id, !this.props.task.private );
	}

	deleteTask() {
		Meteor.call( "tasks.remove", this.props.task._id );
	}

	render() {
		const taskClassName = classnames( {
			checked: this.props.task.checked
			, private: this.props.task.private
		} );

		return (
			<li className={ taskClassName }>
				<button
					className="delete"
					onClick={ this.deleteTask }
				>
					&times;
				</button>

				<input
					checked={ this.props.task.checked }
					onClick={ this.toggleChecked }
					readOnly
					type="checkbox"
				/>

				{ this.props.showPrivateButton
					?
						<button
							className="toggle-private"
							onClick={ this.togglePrivate }
						>
							{ this.props.task.private ? "Private" : "Public" }
						</button>
					:
						null
				}
				
				<span className="text">
					<strong>{ this.props.task.username }</strong>: { this.props.task.text }
				</span>
			</li>
		);
	}
}
