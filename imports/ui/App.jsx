import React from "react";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";
import { Tasks } from "../api/tasks";
import AccountsUIWrapper from "./AccountsUIWrapper";
import Task from "./Task";

class App extends React.Component {
	static get propTypes() {
		return {
			currentUser: React.PropTypes.object
			, incompleteCount: React.PropTypes.number.isRequired
			, tasks: React.PropTypes.array.isRequired
		};
	}

	constructor( props ) {
		super( props );

		this.state = {
			hideCompleted: false
			, newTaskName: ""
		};

		this.handleChange = this.handleChange.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.toggleHideCompleted = this.toggleHideCompleted.bind( this );
	}

	toggleHideCompleted() {
		this.setState( { hideCompleted: !this.state.hideCompleted } );
	}

	handleSubmit( event ) {
		event.preventDefault();

		Meteor.call( "tasks.insert", this.state.newTaskName );

		this.setState( { newTaskName: "" } );
	}

	handleChange( event ) {
		this.setState( { newTaskName: event.target.value } );
	}

	render() {
		let tasks = this.props.tasks;
		if ( this.state.hideCompleted ) {
			tasks = tasks.filter( task => !task.checked );
		}

		const filteredTasks = tasks.map( ( task ) => {
			const currentUserId = this.props.currentUser && this.props.currentUser._id;
			const showPrivateButton = task.owner === currentUserId;

			return (
				<Task
					key={ task._id }
					task={ task }
					showPrivateButton={ showPrivateButton }
				/>
			);
		} );

		return (
			<div className="container">
				<header>
					<h1>Todo List ({ this.props.incompleteCount })</h1>

					<label className="hide-completed">
						<input
							checked={ this.state.hideCompleted }
							onClick={ this.toggleHideCompleted }
							readOnly
							type="checkbox"
						/>
						Hide Completed Tasks
					</label>

					<AccountsUIWrapper />
					{ this.props.currentUser
						?
						<form
							className="new-task"
							onSubmit={ this.handleSubmit }
						>
							<input
								onChange={ this.handleChange }
								placeholder="Type to add new tasks"
								ref="textInput"
								type="text"
								value={ this.state.newTaskName }
							/>
						</form>
						:
						null
					}
				</header>

				<ul>
					{ filteredTasks }
				</ul>
			</div>
		);
	}
}

export default createContainer( () => {
	Meteor.subscribe( "tasks" );

	return {
		currentUser: Meteor.user()
		, incompleteCount: Tasks.find( { checked: { $ne: true } } ).count()
		, tasks: Tasks.find( {}, { sort: { createdAt: -1 } } ).fetch()
	};
}, App );
