import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Tasks = new Mongo.Collection( "tasks" );

if ( Meteor.isServer ) {
	// NO ARROW, this MATTERS
	Meteor.publish( "tasks", function() {
		return Tasks.find( {
			$or: [
				{ private: { $ne: true } }
				, { owner: this.userId }
			]
		} );
	} );
}

Meteor.methods( {
	"tasks.insert"( text ) {
		check( text, String );

		if ( !this.userId ) {
			throw new Meteor.Error( "not-authorized" );
		}

		Tasks.insert( {
			checked: false
			, createdAt: new Date()
			, owner: this.userId
			, text
			, username: Meteor.users.findOne( this.userId ).username
		} );
	}

	, "tasks.remove"( taskId ) {
		check( taskId, String );
		const task = Tasks.findOne( taskId );

		if ( task.private && task.owner !== this.userId ) {
			throw new Meteor.Error( "not-authorized" );
		}

		Tasks.remove( taskId );
	}
	, "tasks.setChecked"( taskId, setChecked ) {
		check( taskId, String );
		check( setChecked, Boolean );

		const task = Tasks.findOne( taskId );
		if ( task.private && task.owner !== this.userId ) {
			throw new Meteor.Error( "not-authorized" );
		}

		Tasks.update( taskId, { $set: { checked: setChecked } } );
	}

	, "tasks.setPrivate"( taskId, setToPrivate ) {
		check( taskId, String );
		check( setToPrivate, Boolean );

		const task = Tasks.findOne( taskId );

		if ( task.owner !== this.userId ) {
			throw new Meteor.Error( "not-authorized" );
		}

		Tasks.update( taskId, { $set: { private: setToPrivate } } );
	}
} );
